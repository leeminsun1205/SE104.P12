const SanThiDau = require('../models/santhidau');

const getSanThiDau = async (req, res) => {
    try {
        const sanThiDauList = await SanThiDau.findAll();
        res.status(200).json(sanThiDauList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể lấy danh sách sân thi đấu.', error: error.message });
    }
};

const createSanThiDau = async (req, res) => {
    try {
        const { MaSan, TenSan, DiaChiSan, SucChua, TieuChuan } = req.body;

        if (!MaSan || !TenSan || !DiaChiSan || !SucChua || !TieuChuan) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc.' });
        }

        const existingSan = await SanThiDau.findOne({ where: { MaSan } });
        if (existingSan) {
            return res.status(400).json({ message: 'Mã sân thi đấu đã tồn tại.', existingSan });
        }

        const newSanThiDau = await SanThiDau.create({ MaSan, TenSan, DiaChiSan, SucChua, TieuChuan });
        res.status(201).json(newSanThiDau);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể thêm sân thi đấu.', error: error.message });
    }
};

const updateSanThiDau = async (req, res) => {
    try {
        const { MaSan } = req.params;
        const { TenSan, DiaChiSan, SucChua, TieuChuan } = req.body;

        const sanThiDau = await SanThiDau.findOne({ where: { MaSan } });
        if (!sanThiDau) {
            return res.status(404).json({ message: `Không tìm thấy sân thi đấu với mã ${MaSan}.` });
        }

        await sanThiDau.update({ TenSan, DiaChiSan, SucChua, TieuChuan });
        res.status(200).json(sanThiDau);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể cập nhật sân thi đấu.', error: error.message });
    }
};

const deleteSanThiDau = async (req, res) => {
    try {
        const { MaSan } = req.params;

        const deleted = await SanThiDau.destroy({ where: { MaSan } });
        if (!deleted) {
            return res.status(404).json({ message: `Không tìm thấy sân thi đấu với mã ${MaSan}.` });
        }

        res.status(200).json({ message: `Xóa sân thi đấu với mã ${MaSan} thành công.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể xóa sân thi đấu.', error: error.message });
    }
};

module.exports = { getSanThiDau, createSanThiDau, updateSanThiDau, deleteSanThiDau };
