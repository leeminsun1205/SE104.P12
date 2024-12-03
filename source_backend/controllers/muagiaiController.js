const Muagiai = require('../models/muagiai');

const getMuagiai = async (req, res) => {
    try {
        const muagiai = await Muagiai.findAll();
        res.status(200).json(muagiai);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách mùa giải' });
    }
};

const createMuagiai = async (req, res) => {
    try {
        const { MaMuaGiai, TenMuaGiai, NgayBatDau, NgayKetThuc } = req.body;
        const newMuagiai = await Muagiai.create({ MaMuaGiai, TenMuaGiai, NgayBatDau, NgayKetThuc });
        res.status(201).json(newMuagiai);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo mùa giải mới' });
    }
};

const deleteMuagiai = async (req, res) => {
    try {
        const { MaMuaGiai } = req.params;
        const deleted = await Muagiai.destroy({
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

module.exports = { getMuagiai, createMuagiai, deleteMuagiai };