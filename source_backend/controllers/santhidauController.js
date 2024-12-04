const SanThiDau = require('../models/santhidau');

// Lấy danh sách sân thi đấu
const getSanThiDau = async (req, res) => {
    try {
        const SanThiDau = await SanThiDau.findAll();
        res.status(200).json(SanThiDau);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể lấy danh sách sân thi đấu.', error: error.message });
    }
};

// Thêm sân thi đấu mới
const createSanThiDau = async (req, res) => {
    try {
        const { MaSan, TenSan, DiaChiSan, SucChua, TieuChuan } = req.body;

        // Kiểm tra sân thi đấu đã tồn tại chưa
        const existingSan = await SanThiDau.findOne({ where: { MaSan } });
        if (existingSan) {
            return res.status(400).json({ message: 'Mã sân thi đấu đã tồn tại.' });
        }

        // Thêm sân thi đấu
        const newSanThiDau = await SanThiDau.create({
            MaSan,
            TenSan,
            DiaChiSan,
            SucChua,
            TieuChuan,
        });

        res.status(201).json({ message: 'Thêm sân thi đấu thành công.', newSanThiDau });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể thêm sân thi đấu.', error: error.message });
    }
};

// Cập nhật thông tin sân thi đấu
const updateSanThiDau = async (req, res) => {
    try {
        const { MaSan } = req.params;
        const { TenSan, DiaChiSan, SucChua, TieuChuan } = req.body;

        // Tìm sân thi đấu cần cập nhật
        const SanThiDau = await SanThiDau.findOne({ where: { MaSan } });
        if (!SanThiDau) {
            return res.status(404).json({ message: `Không tìm thấy sân thi đấu với mã ${MaSan}.` });
        }

        // Cập nhật thông tin
        SanThiDau.TenSan = TenSan || SanThiDau.TenSan;
        SanThiDau.DiaChiSan = DiaChiSan || SanThiDau.DiaChiSan;
        SanThiDau.SucChua = SucChua || SanThiDau.SucChua;
        SanThiDau.TieuChuan = TieuChuan || SanThiDau.TieuChuan;

        await SanThiDau.save();

        res.status(200).json({ message: `Cập nhật sân thi đấu với mã ${MaSan} thành công.`, SanThiDau });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể cập nhật sân thi đấu.', error: error.message });
    }
};

// Xóa sân thi đấu
const deleteSanThiDau = async (req, res) => {
    try {
        const { MaSan } = req.params;

        // Xóa sân thi đấu
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
