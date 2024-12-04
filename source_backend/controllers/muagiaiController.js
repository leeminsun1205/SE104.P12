const MuaGiai = require('../models/muagiai');

const getMuaGiai = async (req, res) => {
    try {
        const muaGiaiList = await MuaGiai.findAll();
        res.status(200).json(muaGiaiList);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách mùa giải' });
    }
};

const createMuaGiai = async (req, res) => {
    try {
        const { MaMuaGiai, TenMuaGiai, NgayBatDau, NgayKetThuc } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!MaMuaGiai || !TenMuaGiai || !NgayBatDau || !NgayKetThuc) {
            return res.status(400).json({ error: 'Thiếu thông tin bắt buộc.' });
        }
        if (new Date(NgayBatDau) >= new Date(NgayKetThuc)) {
            return res.status(400).json({ error: 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc.' });
        }

        // Tạo mới mùa giải
        const newMuaGiai = await MuaGiai.create({ MaMuaGiai, TenMuaGiai, NgayBatDau, NgayKetThuc });
        res.status(201).json(newMuaGiai);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo mùa giải mới', details: err.message });
    }
};

const updateMuaGiai = async (req, res) => {
    try {
        const { MaMuaGiai } = req.params;
        const { TenMuaGiai, NgayBatDau, NgayKetThuc } = req.body;

        // Tìm mùa giải cần cập nhật
        const muaGiai = await MuaGiai.findOne({ where: { MaMuaGiai } });
        if (!muaGiai) {
            return res.status(404).json({ error: `Không tìm thấy mùa giải với mã ${MaMuaGiai}.` });
        }

        // Cập nhật thông tin mùa giải
        if (NgayBatDau && NgayKetThuc && new Date(NgayBatDau) >= new Date(NgayKetThuc)) {
            return res.status(400).json({ error: 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc.' });
        }

        const updatedMuaGiai = await muaGiai.update({
            TenMuaGiai: TenMuaGiai || muaGiai.TenMuaGiai,
            NgayBatDau: NgayBatDau || muaGiai.NgayBatDau,
            NgayKetThuc: NgayKetThuc || muaGiai.NgayKetThuc
        });

        res.status(200).json({ message: 'Cập nhật mùa giải thành công.', updatedMuaGiai });
    } catch (err) {
        res.status(500).json({ error: 'Không thể cập nhật mùa giải.', details: err.message });
    }
};

const deleteMuaGiai = async (req, res) => {
    try {
        const { MaMuaGiai } = req.params;
        const deleted = await MuaGiai.destroy({ where: { MaMuaGiai } });

        if (deleted) {
            res.status(200).json({ message: `Mùa giải với mã ${MaMuaGiai} đã được xóa.` });
        } else {
            res.status(404).json({ message: `Không tìm thấy mùa giải với mã ${MaMuaGiai}.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa mùa giải.', error: error.message });
    }
};

module.exports = { getMuaGiai, createMuaGiai, updateMuaGiai, deleteMuaGiai };
