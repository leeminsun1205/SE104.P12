// controllers/thanhTichController.js
const ThanhTich = require('../models/ThanhTich');

// Lấy danh sách thành tích
const getThanhTich = async (req, res) => {
    try {
        const thanhTich = await ThanhTich.findAll();
        res.status(200).json(thanhTich);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách thành tích' });
    }
};

// Tạo mới thành tích
const createThanhTich = async (req, res) => {
    try {
        const { MaDoiBong, MaMuaGiai, SoTranDaThiDau, SoTranThang, SoTranHoa, SoTranThua, XepHang } = req.body;
        const newThanhTich = await ThanhTich.create({ MaDoiBong, MaMuaGiai, SoTranDaThiDau, SoTranThang, SoTranHoa, SoTranThua, XepHang });
        res.status(201).json(newThanhTich);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo mới thành tích' });
    }
};

// Xóa thành tích
const deleteThanhTich = async (req, res) => {
    try {
        const { MaDoiBong } = req.params;
        const deleted = await ThanhTich.destroy({
            where: { MaDoiBong: MaDoiBong }
        });

        if (deleted) {
            res.status(200).json({ message: `Thành tích của đội bóng với mã ${MaDoiBong} đã được xóa.` });
        } else {
            res.status(404).json({ message: `Không tìm thấy thành tích của đội bóng với mã ${MaDoiBong}.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa thành tích.', error: error.message });
    }
};

module.exports = { getThanhTich, createThanhTich, deleteThanhTich };
