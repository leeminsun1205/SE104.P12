const VongDau = require('../models/VongDau');

const getVongDau = async (req, res) => {
    try {
        const VongDau = await VongDau.findAll();
        res.status(200).json(VongDau);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách vòng đấu' });
    }
};

const createVongDau = async (req, res) => {
    try {
        const { MaVongDau, MaMuaGiai, LuotDau, SoThuTu, NgayBatDau, NgayKetThuc } = req.body;
        const newVongDau = await VongDau.create({ MaVongDau, MaMuaGiai, LuotDau, SoThuTu, NgayBatDau, NgayKetThuc });
        res.status(201).json(newVongDau);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo vòng đấu mới' });
    }
};

const deleteVongDau = async (req, res) => {
    try {
        const { MaVongDau } = req.params;
        const deleted = await VongDau.destroy({
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

module.exports = { getVongDau, createVongDau, deleteVongDau };