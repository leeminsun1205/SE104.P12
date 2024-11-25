const Cauthu = require('../models/Cauthu');

// Lấy danh sách cầu thủ
const getCauthus = async (req, res) => {
    try {
        const cauthus = await Cauthu.findAll();
        res.status(200).json(cauthus);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách cầu thủ' });
    }
};

// Tạo mới cầu thủ
const createCauthu = async (req, res) => {
    try {
        const { MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo } = req.body;
        const newCauthu = await Cauthu.create({ MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo });
        res.status(201).json(newCauthu);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo cầu thủ mới' });
    }
};

// Xóa cầu thủ
const deleteCauthu = async (req, res) => {
    try {
        const { MaCauThu } = req.params;
        const deleted = await Cauthu.destroy({
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

module.exports = { getCauthus, createCauthu, deleteCauthu };