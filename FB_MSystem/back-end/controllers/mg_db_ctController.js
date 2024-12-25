const { MgDbCt, CauThu, DoiBong, MuaGiai } = require('../models');

const MgDbCtController = {
    // Lấy danh sách đội bóng và cầu thủ theo mùa giải
    // Lấy danh sách đội bóng theo mã mùa giải
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const data = await MgDbCt.findAll({
                where: { MaMuaGiai },
                include: [
                    {
                        model: DoiBong,
                        as: 'DoiBong',
                        attributes: ['MaDoiBong', 'TenDoiBong', 'MaSan'], // Các cột cần lấy của bảng DoiBong
                    },
                ],
            });
            res.status(200).json(data.map(item => item.DoiBong));
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đội bóng theo mùa giải:", error);
            res.status(500).json({ error: 'Lỗi khi lấy danh sách đội bóng theo mùa giải.' });
        }
    },

    // Lấy danh sách cầu thủ của đội bóng trong mùa giải
    async getByDoiBong(req, res) {
        try {
            const { MaMuaGiai, MaDoiBong } = req.params;
            const data = await MgDbCt.findAll({
                where: { MaMuaGiai, MaDoiBong },
                include: [
                    {
                        model: CauThu,
                        as: 'CauThu',
                        attributes: ['MaCauThu', 'TenCauThu', 'NgaySinh', 'ViTri'], // Các cột cần lấy của bảng CauThu
                    },
                ],
            });
            res.status(200).json(data.map(item => item.CauThu));
        } catch (error) {
            console.error("Lỗi khi lấy danh sách cầu thủ của đội bóng trong mùa giải:", error);
            res.status(500).json({ error: 'Lỗi khi lấy danh sách cầu thủ của đội bóng trong mùa giải.' });
        }
    },

    // Thêm liên kết mới giữa mùa giải, đội bóng, và cầu thủ
    async create(req, res) {
        try {
            // Lấy các tham số từ URL
            const { MaMuaGiai, MaDoiBong, MaCauThu } = req.params;

            // Kiểm tra xem liên kết giữa mùa giải, đội bóng, cầu thủ đã tồn tại chưa
            const existingLink = await MG_DB_CT.findOne({
                where: { MaMuaGiai, MaDoiBong, MaCauThu },
            });

            if (existingLink) {
                return res.status(400).json({ error: 'Liên kết này đã tồn tại.' });
            }

            // Tạo liên kết mới giữa mùa giải, đội bóng và cầu thủ
            const newLink = await MG_DB_CT.create({
                MaMuaGiai,
                MaDoiBong,
                MaCauThu,
            });

            // Kiểm tra xem đội bóng đã có trong bảng xếp hạng của mùa giải chưa
            const existingRank = await BangXepHang.findOne({
                where: { MaMuaGiai, MaDoiBong },
            });

            // Nếu đội bóng chưa có trong bảng xếp hạng, thêm đội bóng với các giá trị mặc định
            if (!existingRank) {
                await BangXepHang.create({
                    MaMuaGiai,
                    MaDoiBong,
                    DiemSo: 0, // Điểm ban đầu là 0
                    SoTran: 0,  // Số trận ban đầu là 0
                    HieuSo: 0   // Hiệu số ban đầu là 0
                });
            }

            // Trả về thông tin liên kết mới tạo
            res.status(201).json(newLink);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi thêm liên kết mới.' });
        }
    },


    // Cập nhật liên kết giữa mùa giải, đội bóng, và cầu thủ
    async update(req, res) {
        try {
            const { MaMuaGiai, MaDoiBong, MaCauThu } = req.params; // Liên kết cũ
            const updates = req.body; // Dữ liệu mới

            const link = await MgDbCt.findOne({
                where: { MaMuaGiai, MaDoiBong, MaCauThu },
            });

            if (!link) {
                return res.status(404).json({ error: 'Không tìm thấy liên kết để cập nhật.' });
            }

            // Kiểm tra nếu cần đổi sang liên kết mới (MaMuaGiai, MaDoiBong, MaCauThu khác)
            if (
                updates.MaMuaGiai && updates.MaMuaGiai !== MaMuaGiai ||
                updates.MaDoiBong && updates.MaDoiBong !== MaDoiBong ||
                updates.MaCauThu && updates.MaCauThu !== MaCauThu
            ) {
                const newLink = await MgDbCt.findOne({
                    where: {
                        MaMuaGiai: updates.MaMuaGiai || MaMuaGiai,
                        MaDoiBong: updates.MaDoiBong || MaDoiBong,
                        MaCauThu: updates.MaCauThu || MaCauThu,
                    },
                });

                if (newLink) {
                    return res.status(400).json({ error: 'Liên kết mới đã tồn tại.' });
                }
            }

            // Cập nhật liên kết
            await link.update(updates);

            res.status(200).json(link);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật liên kết.' });
        }
    },

    // Xóa liên kết giữa mùa giải, đội bóng, và cầu thủ
    async delete(req, res) {
        try {
            const { MaMuaGiai, MaDoiBong, MaCauThu } = req.params;

            const link = await MgDbCt.findOne({
                where: { MaMuaGiai, MaDoiBong, MaCauThu },
            });

            if (!link) {
                return res.status(404).json({ error: 'Không tìm thấy liên kết để xóa.' });
            }

            await link.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa liên kết.' });
        }
    },
};

module.exports = MgDbCtController;
