const Doibong = require('../models/Doibong');

const getDoibong = async (req, res) => {
    try {
        const doibong = await Doibong.findAll();
        res.status(200).json(Doibong);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách đội bóng' });
    }
};

const createDoibong = async (req, res) => {
    try {
        const { MaDoiBong, TenDoiBong, CoQuanChuQuan, ThanhPhoTrucThuoc, MaSan, HLV, ThongTin, Logo } = req.body;
        const newDoibong = await Doibong.create({ MaDoiBong, TenDoiBong, CoQuanChuQuan, ThanhPhoTrucThuoc, MaSan, HLV, ThongTin, Logo });
        res.status(201).json(newDoibong);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo đội bóng mới' });
    }
};

const deleteDoibong = async (req, res) => {
    try {
        const { MaDoiBong } = req.params;
        const deleted = await Doibong.destroy({
            where: { MaDoiBong: MaDoiBong }
        });

        if (deleted) {
            res.status(200).json({ message: `Đội bóng với mã ${MaDoiBong} đã được xóa.` });
        } else {
            res.status(404).json({ message: `Không tìm thấy đội bóng với mã ${MaDoiBong}.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa đội bóng.', error: error.message });
    }
};

module.exports = { getDoibong, createDoibong, deleteDoibong };