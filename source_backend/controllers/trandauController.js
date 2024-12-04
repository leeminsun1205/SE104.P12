const TranDau = require('../models/trandau');

// Lấy danh sách các trận đấu
const getTranDau = async (req, res) => {
    try {
        const tranDaus = await TranDau.findAll();
        res.status(200).json(tranDaus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách trận đấu!', details: error.message });
    }
};

// Thêm trận đấu mới
const createTranDau = async (req, res) => {
    try {
        const {
            MaTranDau,
            MaVongDau,
            MaDoiBongNha,
            MaDoiBongKhach,
            NgayThiDau,
            GioThiDau,
            MaSan,
            BanThangDoiNha,
            BanThangDoiKhach,
        } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (
            !MaTranDau ||
            !MaVongDau ||
            !MaDoiBongNha ||
            !MaDoiBongKhach ||
            !NgayThiDau ||
            !GioThiDau ||
            !MaSan ||
            BanThangDoiNha === undefined ||
            BanThangDoiKhach === undefined
        ) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' });
        }

        const tranDau = await TranDau.create({
            MaTranDau,
            MaVongDau,
            MaDoiBongNha,
            MaDoiBongKhach,
            NgayThiDau,
            GioThiDau,
            MaSan,
            BanThangDoiNha,
            BanThangDoiKhach,
        });

        res.status(201).json({ message: 'Thêm trận đấu thành công!', data: tranDau });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi thêm trận đấu!', details: error.message });
    }
};

// Xóa trận đấu
const deleteTranDau = async (req, res) => {
    try {
        const { MaTranDau } = req.params;

        // Xóa trận đấu
        const result = await TranDau.destroy({ where: { MaTranDau } });
        if (result === 0) {
            return res.status(404).json({ message: `Không tìm thấy trận đấu với mã ${MaTranDau}!` });
        }

        res.status(200).json({ message: `Xóa trận đấu với mã ${MaTranDau} thành công!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa trận đấu!', details: error.message });
    }
};

// Cập nhật thông tin trận đấu
const updateTranDau = async (req, res) => {
    try {
        const { MaTranDau } = req.params;
        const {
            MaVongDau,
            MaDoiBongNha,
            MaDoiBongKhach,
            NgayThiDau,
            GioThiDau,
            MaSan,
            BanThangDoiNha,
            BanThangDoiKhach,
        } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (
            !MaVongDau &&
            !MaDoiBongNha &&
            !MaDoiBongKhach &&
            !NgayThiDau &&
            !GioThiDau &&
            !MaSan &&
            BanThangDoiNha === undefined &&
            BanThangDoiKhach === undefined
        ) {
            return res.status(400).json({ message: 'Không có thông tin nào để cập nhật!' });
        }

        // Cập nhật trận đấu
        const [updatedRows] = await TranDau.update(
            {
                MaVongDau,
                MaDoiBongNha,
                MaDoiBongKhach,
                NgayThiDau,
                GioThiDau,
                MaSan,
                BanThangDoiNha,
                BanThangDoiKhach,
            },
            { where: { MaTranDau } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ message: `Không tìm thấy trận đấu với mã ${MaTranDau} để cập nhật!` });
        }

        const updatedTranDau = await TranDau.findOne({ where: { MaTranDau } });
        res.status(200).json({
            message: `Cập nhật trận đấu với mã ${MaTranDau} thành công!`,
            data: updatedTranDau,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật trận đấu!', details: error.message });
    }
};

module.exports = {
    getTranDau,
    createTranDau,
    deleteTranDau,
    updateTranDau,
};
