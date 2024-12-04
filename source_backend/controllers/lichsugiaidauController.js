<<<<<<< HEAD
// controllers/LichSuGiaiDauController.js
const LichSuGiaiDau = require('../models/LichSuGiaiDau');
=======
const LichSuGiaiDau = require('../models/lichsugiaidau');
>>>>>>> a07afed323c93860ee640e8f3265ba141ac6eadc

// Lấy tất cả lịch sử giải đấu
exports.getLichSuGiaiDau = async (req, res) => {
    try {
<<<<<<< HEAD
        const LichSuGiaiDau = await LichSuGiaiDau.findAll();
        res.status(200).json(LichSuGiaiDau);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách lịch sử giải đấu' });
=======
        const giaiDaus = await LichSuGiaiDau.findAll();
        res.json(giaiDaus);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách lịch sử giải đấu!', error });
>>>>>>> a07afed323c93860ee640e8f3265ba141ac6eadc
    }
};

// Thêm lịch sử giải đấu mới
exports.createLichSuGiaiDau = async (req, res) => {
    try {
        const giaiDau = await LichSuGiaiDau.create(req.body);
        res.status(201).json({ message: 'Thêm giải đấu thành công!', data: giaiDau });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi thêm giải đấu!', error });
    }
};

// Xóa lịch sử giải đấu
exports.deleteLichSuGiaiDau = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await LichSuGiaiDau.destroy({ where: { MaGiaiDau: id } });
        if (result === 0) {
            return res.status(404).json({ message: 'Không tìm thấy giải đấu!' });
        }
        res.json({ message: 'Xóa giải đấu thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa giải đấu!', error });
    }
};

// Cập nhật lịch sử giải đấu
exports.updateLichSuGiaiDau = async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedRows] = await LichSuGiaiDau.update(req.body, {
            where: { MaGiaiDau: id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy giải đấu để cập nhật!' });
        }

        const updatedGiaiDau = await LichSuGiaiDau.findOne({ where: { MaGiaiDau: id } });
        res.json({ message: 'Cập nhật giải đấu thành công!', data: updatedGiaiDau });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật giải đấu!', error });
    }
};
