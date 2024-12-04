const LoaiThePhat = require('../models/loaithephat');

// Lấy tất cả loại thẻ phạt
exports.getLoaiThePhat = async (req, res) => {
    try {
        const loaiThePhats = await LoaiThePhat.findAll();
        res.json(loaiThePhats);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách loại thẻ phạt!', error });
    }
};

// Thêm loại thẻ phạt mới
exports.createLoaiThePhat = async (req, res) => {
    try {
        const loaiThePhat = await LoaiThePhat.create(req.body);
        res.status(201).json({ message: 'Thêm loại thẻ phạt thành công!', data: loaiThePhat });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi thêm loại thẻ phạt!', error });
    }
};

// Xóa loại thẻ phạt
exports.deleteLoaiThePhat = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await LoaiThePhat.destroy({ where: { MaLoaiThePhat: id } });
        if (result === 0) {
            return res.status(404).json({ message: 'Không tìm thấy loại thẻ phạt!' });
        }
        res.json({ message: 'Xóa loại thẻ phạt thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa loại thẻ phạt!', error });
    }
};

// Cập nhật loại thẻ phạt
exports.updateLoaiThePhat = async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedRows] = await LoaiThePhat.update(req.body, {
            where: { MaLoaiThePhat: id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy loại thẻ phạt để cập nhật!' });
        }

        const updatedLoaiThePhat = await LoaiThePhat.findOne({ where: { MaLoaiThePhat: id } });
        res.json({ message: 'Cập nhật loại thẻ phạt thành công!', data: updatedLoaiThePhat });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật loại thẻ phạt!', error });
    }
};
