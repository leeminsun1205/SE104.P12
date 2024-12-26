const { MgDbCt, CauThu, DoiBong, MuaGiai, BangXepHang, ThamSo } = require('../models');

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
            const { MaMuaGiai, MaDoiBong, MaCauThu } = req.params;
    
            // Kiểm tra liên kết đã tồn tại chưa
            const existingLink = await MgDbCt.findOne({
                where: { MaMuaGiai, MaDoiBong, MaCauThu },
            });
    
            if (existingLink) {
                return res.status(400).json({ error: 'Liên kết này đã tồn tại.' });
            }
    
            // Tạo liên kết mới
            const newLink = await MgDbCt.create({
                MaMuaGiai,
                MaDoiBong,
                MaCauThu,
            });
    
            // Kiểm tra và cập nhật bảng xếp hạng
            const existingRank = await BangXepHang.findOne({
                where: { MaMuaGiai, MaDoiBong },
            });
    
            if (!existingRank) {
                await BangXepHang.create({
                    MaMuaGiai,
                    MaDoiBong,
                    SoTran: 0,
                    SoTranThang: 0,
                    SoTranHoa: 0,
                    SoTranThua: 0,
                    SoBanThang: 0,
                    SoBanThua: 0,
                    DiemSo: 0,
                    HieuSo: 0,
                });
            }

            res.status(201).json(newLink);
        } catch (error) {
            console.error('Lỗi khi tạo liên kết:', error);
            res.status(500).json({ error: 'Lỗi khi tạo liên kết.' });
        }
    },

    async createMany(req, res) {
        try {
            const { links } = req.body; // Nhận danh sách các bản ghi từ body
    
            if (!Array.isArray(links) || links.length === 0) {
                return res.status(400).json({ error: 'Danh sách liên kết không hợp lệ.' });
            }
    
            const createdLinks = [];
            const existingLinks = [];
            const missingRanks = new Set();
    
            for (const link of links) {
                const { MaMuaGiai, MaDoiBong, MaCauThu } = link;
    
                // Kiểm tra liên kết đã tồn tại chưa
                const existingLink = await MgDbCt.findOne({
                    where: { MaMuaGiai, MaDoiBong, MaCauThu },
                });
    
                if (existingLink) {
                    existingLinks.push(link); // Ghi nhận liên kết đã tồn tại
                    continue;
                }
    
                // Tạo liên kết mới
                const newLink = await MgDbCt.create({ MaMuaGiai, MaDoiBong, MaCauThu });
                createdLinks.push(newLink);
    
                // Kiểm tra và ghi nhận bảng xếp hạng cần cập nhật
                const existingRank = await BangXepHang.findOne({
                    where: { MaMuaGiai, MaDoiBong },
                });
    
                if (!existingRank) {
                    missingRanks.add(`${MaMuaGiai}-${MaDoiBong}`); // Ghi nhận thông tin bảng xếp hạng cần tạo
                }
            }
    
            // Tạo bảng xếp hạng cho những đội chưa có
            for (const rank of missingRanks) {
                const [MaMuaGiai, MaDoiBong] = rank.split('-');
                await BangXepHang.create({
                    MaMuaGiai,
                    MaDoiBong,
                    SoTran: 0,
                    SoTranThang: 0,
                    SoTranHoa: 0,
                    SoTranThua: 0,
                    SoBanThang: 0,
                    SoBanThua: 0,
                    DiemSo: 0,
                    HieuSo: 0,
                });
            }
    
            res.status(201).json({
                createdLinks,
                existingLinks,
                message: `${createdLinks.length} liên kết mới đã được tạo. ${existingLinks.length} liên kết đã tồn tại.`,
            });
        } catch (error) {
            console.error('Lỗi khi tạo nhiều liên kết:', error);
            res.status(500).json({ error: 'Lỗi khi tạo nhiều liên kết.' });
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
