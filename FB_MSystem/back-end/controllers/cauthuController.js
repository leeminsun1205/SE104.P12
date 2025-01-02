const { CauThu, ThamSo, Mg_Db, Db_Ct } = require('../models');

const CauThuController = {
    async getAll(req, res) {
        try {
            const cauThus = await CauThu.findAll();
            res.status(200).json({cauThu: cauThus});
        } catch (error) {
            console.error('Lỗi khi lấy danh sách cầu thủ:', error);
            res.status(500).json({ error: 'Lỗi khi lấy danh sách cầu thủ.', details: error.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const cauThu = await CauThu.findByPk(id);
            if (!cauThu) return res.status(404).json({ error: 'Không tìm thấy cầu thủ.' });
            res.status(200).json(cauThu);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin cầu thủ:', error);
            res.status(500).json({ error: 'Lỗi khi lấy thông tin cầu thủ.', details: error.message });
        }
    },

    async create(req, res) {
        try {
            const { MaCauThu, TenCauThu, NgaySinh, QuocTich, ViTri, ChieuCao, CanNang, SoAo, TieuSu } = req.body;
    
            // Lấy giá trị TuoiToiThieu và TuoiToiDa từ bảng ThamSo
            const thamSo = await ThamSo.findOne({ where: { id: 1 } });
            if (!thamSo) {
                return res.status(500).json({ error: 'Không tìm thấy giá trị tham số.' });
            }
    
            // Kiểm tra QuocTich và đặt giá trị mặc định cho LoaiCauThu, 1 là trong nước và 0 là ngoài nước
            const LoaiCauThu = (QuocTich && QuocTich.toLowerCase() === 'việt nam') ? 1 : 0;
    
            // Thêm cầu thủ
            const cauThu = await CauThu.create({
                MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo, TieuSu
            });
            res.status(201).json(cauThu);
        } catch (error) {
            console.error('Lỗi khi thêm cầu thủ mới:', error);
            res.status(500).json({ error: 'Lỗi khi thêm cầu thủ mới.', details: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { TenCauThu, NgaySinh, QuocTich, ViTri, ChieuCao, CanNang, SoAo, TieuSu } = req.body;

            const LoaiCauThu = (QuocTich && QuocTich.toLowerCase() === 'việt nam') ? 1 : 0;

            const cauThu = await CauThu.findByPk(id);
            if (!cauThu) {
                return res.status(404).json({ error: 'Không tìm thấy cầu thủ.' });
            }
            await cauThu.update({
                TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo, TieuSu,
            });
            res.status(200).json(cauThu);
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin cầu thủ:', error);
            res.status(500).json({ error: 'Lỗi khi cập nhật thông tin cầu thủ.', details: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const cauThu = await CauThu.findByPk(id);
            if (!cauThu) return res.status(404).json({ error: 'Không tìm thấy cầu thủ.' });
    
            // Kiểm tra các bảng liên quan
            const dbctCount = await DbCt.count({ where: { MaCauThu: id } });
            const banThangCount = await BanThang.count({ where: { MaCauThu: id } });
            const thePhatCount = await ThePhat.count({ where: { MaCauThu: id } });
    
            if (dbctCount > 0 || banThangCount > 0 || thePhatCount > 0) {
                return res.status(400).json({
                    error: 'Không thể xóa cầu thủ vì tồn tại các liên kết phụ thuộc.',
                    details: {
                        dbCt: dbctCount > 0,
                        banThang: banThangCount > 0,
                        thePhat: thePhatCount > 0,
                    }
                });
            }
    
            await cauThu.destroy();
            res.status(204).send();
        } catch (error) {
            console.error('Lỗi khi xóa cầu thủ:', error);
            res.status(500).json({ error: 'Lỗi khi xóa cầu thủ.', details: error.message });
        }
    },
};

module.exports = CauThuController;
