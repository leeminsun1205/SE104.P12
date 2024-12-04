const LoaiBanThang = require('../models/LoaiBanThang'); // Import model LoaiBanThang

// Lấy danh sách loại bàn thắng
const getLoaiBanThang = async (req, res) => {
    try {
        const LoaiBanThangs = await LoaiBanThang.findAll();
        res.status(200).json(LoaiBanThangs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể lấy danh sách loại bàn thắng.', error: error.message });
    }
};

// Thêm một loại bàn thắng mới
const createLoaiBanThang = async (req, res) => {
    try {
        const { MaLoaiBanThang, TenLoaiBanThang, MoTa } = req.body;

        // Kiểm tra loại bàn thắng đã tồn tại chưa
        const existingLoai = await LoaiBanThang.findOne({ where: { MaLoaiBanThang } });
        if (existingLoai) {
            return res.status(400).json({ message: 'Mã loại bàn thắng đã tồn tại.' });
        }

        // Thêm loại bàn thắng mới
        const newLoaiBanThang = await LoaiBanThang.create({
            MaLoaiBanThang,
            TenLoaiBanThang,
            MoTa,
        });

        res.status(201).json({ message: 'Thêm loại bàn thắng thành công.', newLoaiBanThang });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể thêm loại bàn thắng.', error: error.message });
    }
};

// Cập nhật loại bàn thắng
const updateLoaiBanThang = async (req, res) => {
    try {
        const { MaLoaiBanThang } = req.params;
        const { TenLoaiBanThang, MoTa } = req.body;

        // Kiểm tra loại bàn thắng có tồn tại
        const LoaiBanThang = await LoaiBanThang.findOne({ where: { MaLoaiBanThang } });
        if (!LoaiBanThang) {
            return res.status(404).json({ message: `Không tìm thấy loại bàn thắng với mã ${MaLoaiBanThang}.` });
        }

        // Cập nhật thông tin
        LoaiBanThang.TenLoaiBanThang = TenLoaiBanThang || LoaiBanThang.TenLoaiBanThang;
        LoaiBanThang.MoTa = MoTa || LoaiBanThang.MoTa;
        await LoaiBanThang.save();

        res.status(200).json({ message: `Cập nhật loại bàn thắng với mã ${MaLoaiBanThang} thành công.`, LoaiBanThang });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể cập nhật loại bàn thắng.', error: error.message });
    }
};

// Xóa loại bàn thắng
const deleteLoaiBanThang = async (req, res) => {
    try {
        const { MaLoaiBanThang } = req.params;

        // Kiểm tra loại bàn thắng có tồn tại
        const deleted = await LoaiBanThang.destroy({ where: { MaLoaiBanThang } });
        if (!deleted) {
            return res.status(404).json({ message: `Không tìm thấy loại bàn thắng với mã ${MaLoaiBanThang}.` });
        }

        res.status(200).json({ message: `Xóa loại bàn thắng với mã ${MaLoaiBanThang} thành công.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể xóa loại bàn thắng.', error: error.message });
    }
};

module.exports = { getLoaiBanThang, createLoaiBanThang, updateLoaiBanThang, deleteLoaiBanThang };
