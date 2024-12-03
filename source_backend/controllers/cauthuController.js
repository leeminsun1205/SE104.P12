const Cauthu = require('../models/Cauthu');

const getCauthu = async (req, res) => {
    try {
        const cauthus = await Cauthu.findAll();
        res.status(200).json(cauthus);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách cầu thủ' });
    }
};

const createCauthu = async (req, res) => {
    try {
        const { MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo } = req.body;
        const newCauthu = await Cauthu.create({ MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo });
        res.status(201).json(newCauthu);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo cầu thủ mới' });
    }
};

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

const updateCauthu = async (req, res) => {
    try {
        const { MaCauThu } = req.params; // Lấy mã cầu thủ từ URL
        const { TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo } = req.body; // Dữ liệu cập nhật

        // Tìm cầu thủ cần cập nhật
        const cauthu = await Cauthu.findOne({ where: { MaCauThu } });
        if (!cauthu) {
            return res.status(404).json({ message: `Không tìm thấy cầu thủ với mã ${MaCauThu}.` });
        }

        // Cập nhật thông tin
        cauthu.TenCauThu = TenCauThu || cauthu.TenCauThu;
        cauthu.NgaySinh = NgaySinh || cauthu.NgaySinh;
        cauthu.QuocTich = QuocTich || cauthu.QuocTich;
        cauthu.LoaiCauThu = LoaiCauThu !== undefined ? LoaiCauThu : cauthu.LoaiCauThu;
        cauthu.ViTri = ViTri || cauthu.ViTri;
        cauthu.ChieuCao = ChieuCao || cauthu.ChieuCao;
        cauthu.CanNang = CanNang || cauthu.CanNang;
        cauthu.SoAo = SoAo || cauthu.SoAo;

        // Lưu thay đổi vào cơ sở dữ liệu
        await cauthu.save();

        res.status(200).json({ message: `Cập nhật thành công cầu thủ với mã ${MaCauThu}.`, cauthu });
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật cầu thủ.', error: error.message });
    }
};

module.exports = { getCauthu, createCauthu, deleteCauthu, updateCauthu };