const { DbCt, CauThu, ThamSo } = require('../models');

const DbCtController = {
    // Lấy danh sách cầu thủ theo đội bóng
    async getByDoiBong(req, res) {
        try {
            const { MaDoiBong } = req.params;
            const data = await DbCt.findAll({
                where: { MaDoiBong },
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
            console.error("Lỗi khi lấy danh sách cầu thủ theo đội bóng:", error);
            res.status(500).json({ error: 'Lỗi khi lấy danh sách cầu thủ theo đội bóng.' });
        }
    },

    // Thêm liên kết mới giữa đội bóng và cầu thủ
    async create(req, res) {
        try {
            const { MaDoiBong, MaCauThu } = req.body;
    
            // Lấy thông tin từ bảng ThamSo
            const thamSo = await ThamSo.findOne();
            if (!thamSo) {
                return res.status(500).json({ error: 'Tham số hệ thống chưa được cấu hình.' });
            }
    
            const { TuoiToiThieu, TuoiToiDa } = thamSo;
    
            // Lấy thông tin cầu thủ
            const cauThu = await CauThu.findByPk(MaCauThu);
            if (!cauThu) {
                return res.status(404).json({ error: `Không tìm thấy cầu thủ với mã ${MaCauThu}.` });
            }
    
            // Tính tuổi cầu thủ
            const currentYear = new Date().getFullYear();
            const birthYear = new Date(cauThu.NgaySinh).getFullYear();
            const age = currentYear - birthYear;
    
            // Kiểm tra độ tuổi tối thiểu và tối đa
            if (age < TuoiToiThieu || age > TuoiToiDa) {
                return res.status(400).json({
                    error: `Cầu thủ ${cauThu.TenCauThu} (${MaCauThu}) không đáp ứng độ tuổi tham gia (${TuoiToiThieu}-${TuoiToiDa} tuổi).`,
                });
            }
    
            // Kiểm tra liên kết đã tồn tại chưa
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
    
            // Lấy thông tin từ bảng ThamSo
            const thamSo = await ThamSo.findOne();
            if (!thamSo) {
                return res.status(500).json({ error: 'Tham số hệ thống chưa được cấu hình.' });
            }
    
            const { TuoiToiThieu, TuoiToiDa } = thamSo;
    
            for (const link of links) {
                const { MaDoiBong, MaCauThu } = link;
    
                // Lấy thông tin cầu thủ
                const cauThu = await CauThu.findByPk(MaCauThu);
                if (!cauThu) {
                    invalidLinks.push({
                        MaDoiBong,
                        MaCauThu,
                        error: `Không tìm thấy cầu thủ với mã ${MaCauThu}.`,
                    });
                    continue;
                }
    
                // Tính tuổi cầu thủ
                const currentYear = new Date().getFullYear();
                const birthYear = new Date(cauThu.NgaySinh).getFullYear();
                const age = currentYear - birthYear;
    
                // Kiểm tra độ tuổi tối thiểu và tối đa
                if (age < TuoiToiThieu || age > TuoiToiDa) {
                    invalidLinks.push({
                        MaDoiBong,
                        MaCauThu,
                        error: `Cầu thủ ${cauThu.TenCauThu} không đáp ứng độ tuổi (${TuoiToiThieu}-${TuoiToiDa} tuổi).`,
                    });
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
                const newLink = await DbCt.create({ MaDoiBong, MaCauThu });
                createdLinks.push(newLink);
            }
    
            res.status(201).json({
                createdLinks,
                existingLinks,
                invalidLinks,
                message: `${createdLinks.length} liên kết mới đã được tạo. ${existingLinks.length} liên kết đã tồn tại. ${invalidLinks.length} liên kết không hợp lệ.`,
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
