const CauThu = require('../models/cauthu');

const getCauThu = async (req, res) => {
    try {
        const cauThu = await CauThu.findAll();
        res.status(200).json(cauThu);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách cầu thủ' });
    }
};

const createCauThu = async (req, res) => {
    try {
        const { MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo } = req.body;
        const newCauThu = await CauThu.create({ MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo });
        res.status(201).json(newCauThu);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo cầu thủ mới' });
    }
};

const deleteCauThu = async (req, res) => {
    try {
        const { MaCauThu } = req.params;
        const deleted = await CauThu.destroy({
            where: { MaCauThu: MaCauThu }
        });

        if (deleted) {
            res.status(200).json({ message: `Cầu thủ với mã ${MaCauThu} đã được xóa.` });
        } else {
            res.status(404).json({ message: `Không tìm thấy cầu thủ với mã ${MaCauThu}.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa cầu thủ.', error: error.message });
    }
};

const updateCauThu = async (req, res) => {
    try {
        const { MaCauThu } = req.params; 
        const {
            TenCauThu,
            NgaySinh,
            QuocTich,
            LoaiCauThu,
            ViTri,
            ChieuCao,
            CanNang,
            SoAo
        } = req.body; 

        const cauThu = await CauThu.findOne({ where: { MaCauThu: MaCauThu } });

        if (!cauThu) {
            return res.status(404).json({ message: `Không tìm thấy cầu thủ với mã ${MaCauThu}.` });
        }

        const updatedCauThu = await cauThu.update({
            TenCauThu,
            NgaySinh,
            QuocTich,
            LoaiCauThu,
            ViTri,
            ChieuCao,
            CanNang,
            SoAo
        });

        res.status(200).json({ message: 'Cập nhật cầu thủ thành công.', cauThu: updatedCauThu });
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật cầu thủ.', error: error.message });
    }
};

module.exports = { getCauThu, createCauThu, deleteCauThu, updateCauThu};