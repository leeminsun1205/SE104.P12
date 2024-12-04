const CauThu = require('../models/CauThu');

const getCauThu = async (req, res) => {
    try {
        const CauThu = await CauThu.findAll();
        res.status(200).json(CauThu);
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

module.exports = { getCauThu, createCauThu, deleteCauThu };