const { MgDb, DoiBong, MuaGiai, BangXepHang } = require('../models');

const MgDbController = {
    // Lấy danh sách đội bóng theo mùa giải
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const data = await MgDb.findAll({
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

    // Thêm liên kết mới giữa mùa giải và đội bóng
    async create(req, res) {
        try {
            const { MaMuaGiai, MaDoiBong } = req.body;

            // Kiểm tra liên kết đã tồn tại chưa
            const existingLink = await MgDb.findOne({
                where: { MaMuaGiai, MaDoiBong },
            });

            if (existingLink) {
                return res.status(400).json({ error: 'Liên kết này đã tồn tại.' });
            }

            // Tạo liên kết mới
            const newLink = await MgDb.create({
                MaMuaGiai,
                MaDoiBong,
            });

            // Kiểm tra và cập nhật bảng xếp hạng nếu cần
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

    // Thêm nhiều liên kết giữa mùa giải và đội bóng
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
                const { MaMuaGiai, MaDoiBong } = link;
    
                // Kiểm tra liên kết đã tồn tại chưa
                const existingLink = await MgDb.findOne({
                    where: { MaMuaGiai, MaDoiBong },
                });
    
                if (existingLink) {
                    existingLinks.push(link); // Ghi nhận liên kết đã tồn tại
                    continue;
                }
    
                // Tạo liên kết mới
                const newLink = await MgDb.create({ MaMuaGiai, MaDoiBong });
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

    // Cập nhật liên kết giữa mùa giải và đội bóng
    async update(req, res) {
        try {
            const { MaMuaGiai, MaDoiBong } = req.params; // Liên kết cũ
            const updates = req.body; // Dữ liệu mới

            const link = await MgDb.findOne({
                where: { MaMuaGiai, MaDoiBong },
            });

            if (!link) {
                return res.status(404).json({ error: 'Không tìm thấy liên kết để cập nhật.' });
            }

            // Kiểm tra nếu cần đổi sang liên kết mới (MaMuaGiai, MaDoiBong khác)
            if (
                updates.MaMuaGiai && updates.MaMuaGiai !== MaMuaGiai ||
                updates.MaDoiBong && updates.MaDoiBong !== MaDoiBong
            ) {
                const newLink = await MgDb.findOne({
                    where: {
                        MaMuaGiai: updates.MaMuaGiai || MaMuaGiai,
                        MaDoiBong: updates.MaDoiBong || MaDoiBong,
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

    // Xóa liên kết giữa mùa giải và đội bóng
    async delete(req, res) {
        try {
            const { MaMuaGiai, MaDoiBong } = req.params;

            const link = await MgDb.findOne({
                where: { MaMuaGiai, MaDoiBong },
            });

            if (!link) {
                return res.status(404).json({ error: 'Không tìm thấy liên kết để xóa.' });
            }

            await link.destroy();
            res.status(204).send();
        } catch (error) {
            console.error('Lỗi khi xóa liên kết:', error);
            res.status(500).json({ error: 'Lỗi khi xóa liên kết.' });
        }
    },
};

module.exports = MgDbController;
