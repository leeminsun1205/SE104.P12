const Vongdau = require('../models/vongdau');

const getVongdau = async (req, res) => {
    try {
        const vongdau = await Vongdau.findAll();
        res.status(200).json(vongdau);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách vòng đấu' });
    }
};

const createVongdau = async (req, res) => {
    try {
        const { MaVongDau, MaMuaGiai, LuotDau, SoThuTu, NgayBatDau, NgayKetThuc } = req.body;
        const newVongdau = await Vongdau.create({ MaVongDau, MaMuaGiai, LuotDau, SoThuTu, NgayBatDau, NgayKetThuc });
        res.status(201).json(newVongdau);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo vòng đấu mới' });
    }
};

const deleteVongdau = async (req, res) => {
    try {
        const { MaVongDau } = req.params;
        const deleted = await Vongdau.destroy({
            where: { MaVongDau: MaVongDau }
        });

        if (deleted) {
            res.status(200).json({ message: `Vòng đấu với mã ${MaVongDau} đã được xóa.` });
        } else {
            res.status(404).json({ message: `Không tìm thấy vòng đấu với mã ${MaVongDau}.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa vòng đấu.', error: error.message });
    }
};

module.exports = { getVongdau, createVongdau, deleteVongdau };