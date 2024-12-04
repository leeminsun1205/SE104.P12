<<<<<<< HEAD
const SanThiDau = require('../models/santhidau');

// Lấy danh sách sân thi đấu
const getSanThiDau = async (req, res) => {
    try {
        const sanThiDaus = await SanThiDau.findAll();
        res.status(200).json(sanThiDaus);
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
        const sanThiDau = await SanThiDau.findOne({ where: { MaSan } });
        if (!sanThiDau) {
            return res.status(404).json({ message: `Không tìm thấy sân thi đấu với mã ${MaSan}.` });
        }

        // Cập nhật thông tin
        sanThiDau.TenSan = TenSan || sanThiDau.TenSan;
        sanThiDau.DiaChiSan = DiaChiSan || sanThiDau.DiaChiSan;
        sanThiDau.SucChua = SucChua || sanThiDau.SucChua;
        sanThiDau.TieuChuan = TieuChuan || sanThiDau.TieuChuan;

        await sanThiDau.save();

        res.status(200).json({ message: `Cập nhật sân thi đấu với mã ${MaSan} thành công.`, sanThiDau });
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
=======
const Santhidau = require('../models/santhidau');

const getSanthidau = async (req, res) => {
    try {
        const santhidau = await Santhidau.findAll();
        res.status(200).json(santhidau);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách sân thi đấu' });
    }
};

const createSanthidau = async (req, res) => {
    try {
        const { MaSan, TenSan, DiaChiSan, SucChua, TieuChuan } = req.body;
        const newSanthidau = await Santhidau.create({ MaSan, TenSan, DiaChiSan, SucChua, TieuChuan });
        res.status(201).json(newSanthidau);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo sân thi đấu mới' });
    }
};

const deleteSanthidau = async (req, res) => {
    try {
        const { MaSan } = req.params;
        const deleted = await Santhidau.destroy({
            where: { MaSan: MaSan }
        });

        if (deleted) {
            res.status(200).json({ message: `Sân với mã ${MaSan} đã được xóa.` });
        } else {
            res.status(404).json({ message: `Không tìm thấy sân thi đấu với mã ${MaSan}.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa sân thi đấu.', error: error.message });
    }
};

module.exports = { getSanthidau, createSanthidau, deleteSanthidau };
>>>>>>> 44bbe262c884313044fd09f4beee4849b952ecdc
