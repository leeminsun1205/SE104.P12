const MuaGiai = require('../models/MuaGiai');

const getMuaGiai = async (req, res) => {
    try {
        const MuaGiai = await MuaGiai.findAll();
        res.status(200).json(MuaGiai);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách mùa giải' });
    }
};

const createMuaGiai = async (req, res) => {
    try {
        const { MaMuaGiai, TenMuaGiai, NgayBatDau, NgayKetThuc } = req.body;
        const newMuaGiai = await MuaGiai.create({ MaMuaGiai, TenMuaGiai, NgayBatDau, NgayKetThuc });
        res.status(201).json(newMuaGiai);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo mùa giải mới' });
    }
};

const deleteMuaGiai = async (req, res) => {
    try {
        const { MaMuaGiai } = req.params;
        const deleted = await MuaGiai.destroy({
            where: { MaMuaGiai: MaMuaGiai }
        });

        if (deleted) {
            res.status(200).json({ message: `Mùa giải với mã ${MaMuaGiai} đã được xóa.` });
        } else {
            res.status(404).json({ message: `Không tìm thấy mùa giải với mã ${MaMuaGiai}.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa mùa giải.', error: error.message });
    }
};

module.exports = { getMuaGiai, createMuaGiai, deleteMuaGiai };