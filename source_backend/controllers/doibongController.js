const DoiBong = require('../models/DoiBong');

const getDoiBong = async (req, res) => {
    try {
        const DoiBong = await DoiBong.findAll();
        res.status(200).json(DoiBong);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách đội bóng' });
    }
};

const createDoiBong = async (req, res) => {
    try {
        const { MaDoiBong, TenDoiBong, CoQuanChuQuan, ThanhPhoTrucThuoc, MaSan, HLV, ThongTin, Logo } = req.body;
        const newDoiBong = await DoiBong.create({ MaDoiBong, TenDoiBong, CoQuanChuQuan, ThanhPhoTrucThuoc, MaSan, HLV, ThongTin, Logo });
        res.status(201).json(newDoiBong);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo đội bóng mới' });
    }
};

const deleteDoiBong = async (req, res) => {
    try {
        const { MaDoiBong } = req.params;
        const deleted = await DoiBong.destroy({
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

module.exports = { getDoiBong, createDoiBong, deleteDoiBong };