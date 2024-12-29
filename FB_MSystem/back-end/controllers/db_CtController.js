const { DbCt, CauThu, ThamSo, MgDb } = require('../models');

const DbCtController = {
    // Lấy danh sách cầu thủ theo đội bóng
    async getByDoiBong(req, res) {
        try {
            const { MaDoiBong } = req.params;

            // Nối bảng DbCt với MgDb để lấy thông tin MaMuaGiai
            const data = await DbCt.findAll({
                where: { MaDoiBong },
                include: [
                    {
                        model: CauThu,
                        as: 'CauThu',
                        attributes: ['MaCauThu', 'TenCauThu', 'NgaySinh', 'QuocTich', 'LoaiCauThu', 'ViTri', 'ChieuCao', 'CanNang', 'SoAo', 'TieuSu'], // Các cột cần lấy của bảng CauThu
                    },
                    {
                        model: MgDb,  // Nối với bảng MgDb
                        as: 'MgDb',
                        attributes: ['MaMuaGiai'], // Các cột cần lấy của bảng MgDb
                    }
                ],
            });

            // Chỉ lấy các trường cần thiết
            const formattedData = data.map(item => ({
                MaMuaGiai: item.MgDb ? item.MgDb.MaMuaGiai : null,  // Lấy MaMuaGiai từ bảng MgDb
                MaDoiBong: item.MaDoiBong,
                MaCauThu: item.CauThu.MaCauThu,
                TenCauThu: item.CauThu.TenCauThu,
                NgaySinh: item.CauThu.NgaySinh,
                QuocTich: item.CauThu.QuocTich,
                LoaiCauThu: item.CauThu.LoaiCauThu,
                ViTri: item.CauThu.ViTri,
                ChieuCao: item.CauThu.ChieuCao,
                CanNang: item.CauThu.CanNang,
                SoAo: item.CauThu.SoAo,
                TieuSu: item.CauThu.TieuSu,
            }));

            res.status(200).json({ cauThu: formattedData });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách cầu thủ theo đội bóng:", error);
            res.status(500).json({ error: 'Lỗi khi lấy danh sách cầu thủ theo đội bóng.' });
        }
    },
    async getByCauThu(req, res) {
        try {
            const { MaCauThu } = req.params;

            const data = await DbCt.findAll({
                where: { MaCauThu },
                include: [
                    {
                        model: CauThu,
                        as: 'CauThu',
                        attributes: ['MaCauThu', 'TenCauThu', 'NgaySinh', 'QuocTich', 'LoaiCauThu', 'ViTri', 'ChieuCao', 'CanNang', 'SoAo', 'TieuSu'],
                    },
                    {
                        model: MgDb,
                        as: 'MgDb',
                        attributes: ['MaMuaGiai'],
                    }
                ],
            });

            if (!data || data.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy thông tin cầu thủ.' });
            }

            const formattedData = data.map(item => ({
                MaMuaGiai: item.MgDb ? item.MgDb.MaMuaGiai : null,
                MaDoiBong: item.MaDoiBong,
                MaCauThu: item.CauThu.MaCauThu,
                TenCauThu: item.CauThu.TenCauThu,
                NgaySinh: item.CauThu.NgaySinh,
                QuocTich: item.CauThu.QuocTich,
                LoaiCauThu: item.CauThu.LoaiCauThu,
                ViTri: item.CauThu.ViTri,
                ChieuCao: item.CauThu.ChieuCao,
                CanNang: item.CauThu.CanNang,
                SoAo: item.CauThu.SoAo,
                TieuSu: item.CauThu.TieuSu,
            }));

            res.status(200).json({ cauThu: formattedData });
        } catch (error) {
            console.error("Lỗi khi lấy thông tin cầu thủ theo mã cầu thủ:", error);
            res.status(500).json({ error: 'Lỗi khi lấy thông tin cầu thủ.' });
        }
    },
    // Thêm liên kết mới giữa đội bóng và cầu thủ
    async create(req, res) {
        try {
            const { MaDoiBong, MaCauThu } = req.body;

            // Kiểm tra xem cầu thủ đã có trong đội bóng nào chưa
            const existingPlayerInTeam = await DbCt.findOne({
                where: { MaCauThu },
            });

            if (existingPlayerInTeam) {
                return res.status(400).json({ error: 'Cầu thủ này đã thuộc một đội bóng khác.' });
            }

            // Kiểm tra liên kết đã tồn tại chưa (trong trường hợp logic nghiệp vụ cho phép 1 cầu thủ ở 1 đội bóng nhiều lần trong các mùa giải khác nhau, bạn có thể bỏ qua bước này hoặc điều chỉnh)
            const existingLink = await DbCt.findOne({
                where: { MaDoiBong, MaCauThu },
            });

            if (existingLink) {
                return res.status(400).json({ error: 'Liên kết này đã tồn tại.' });
            }

            // Tạo liên kết mới
            const newLink = await DbCt.create({ MaDoiBong, MaCauThu });

            res.status(201).json(newLink);
        } catch (error) {
            console.error('Lỗi khi tạo liên kết:', error);
            res.status(500).json({ error: 'Lỗi khi tạo liên kết.' });
        }
    },

    // Thêm nhiều liên kết giữa đội bóng và cầu thủ
    async createMany(req, res) {
        try {
            const { links } = req.body; // Nhận danh sách các bản ghi từ body
            if (!Array.isArray(links) || links.length === 0) {
                return res.status(400).json({ error: 'Danh sách liên kết không hợp lệ.' });
            }

            const createdLinks = [];
            const existingLinks = [];
            const invalidLinks = [];
            const playerAlreadyInTeamLinks = [];

            for (const link of links) {
                const { MaDoiBong, MaCauThu } = link;

                // Kiểm tra xem cầu thủ đã có trong đội bóng nào chưa
                const existingPlayerInAnyTeam = await DbCt.findOne({
                    where: { MaCauThu },
                });

                if (existingPlayerInAnyTeam) {
                    playerAlreadyInTeamLinks.push(link);
                    continue;
                }

                // Kiểm tra liên kết đã tồn tại chưa
                const existingLink = await DbCt.findOne({
                    where: { MaDoiBong, MaCauThu },
                });

                if (existingLink) {
                    existingLinks.push(link); // Ghi nhận liên kết đã tồn tại
                    continue;
                }

                // Tạo liên kết mới
                try {
                    const newLink = await DbCt.create({ MaDoiBong, MaCauThu });
                    createdLinks.push(newLink);
                } catch (error) {
                    console.error('Lỗi khi tạo liên kết trong createMany:', error);
                    invalidLinks.push(link); // Ghi nhận liên kết không hợp lệ nếu có lỗi khi tạo
                }
            }

            res.status(201).json({
                createdLinks,
                existingLinks,
                invalidLinks,
                playerAlreadyInTeamLinks,
                message: `${createdLinks.length} liên kết mới đã được tạo. ${existingLinks.length} liên kết đã tồn tại. ${invalidLinks.length} liên kết không hợp lệ. ${playerAlreadyInTeamLinks.length} cầu thủ đã thuộc đội bóng khác.`,
            });
        } catch (error) {
            console.error('Lỗi khi tạo nhiều liên kết:', error);
            res.status(500).json({ error: 'Lỗi khi tạo nhiều liên kết.' });
        }
    },

    // Cập nhật liên kết giữa đội bóng và cầu thủ
    async update(req, res) {
        try {
            const { MaDoiBong, MaCauThu } = req.params; // Liên kết cũ
            const updates = req.body; // Dữ liệu mới

            const link = await DbCt.findOne({
                where: { MaDoiBong, MaCauThu },
            });

            if (!link) {
                return res.status(404).json({ error: 'Không tìm thấy liên kết để cập nhật.' });
            }

            // Kiểm tra nếu cần đổi sang liên kết mới (MaDoiBong, MaCauThu khác)
            if (
                updates.MaDoiBong && updates.MaDoiBong !== MaDoiBong ||
                updates.MaCauThu && updates.MaCauThu !== MaCauThu
            ) {
                const newLink = await DbCt.findOne({
                    where: {
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

    // Xóa liên kết giữa đội bóng và cầu thủ
    async delete(req, res) {
        try {
            const { MaDoiBong, MaCauThu } = req.params;

            const link = await DbCt.findOne({
                where: { MaDoiBong, MaCauThu },
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

module.exports = DbCtController;