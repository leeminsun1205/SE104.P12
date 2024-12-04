const DSThePhat = require('../models/dsthephat');

// Lấy tất cả DS thẻ phạt
exports.getDSThePhat = async (req, res) => {
    try {
        const dsThePhats = await DSThePhat.findAll();
        res.json(dsThePhats);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách DS thẻ phạt!', error });
    }
};

// Thêm DS thẻ phạt mới
exports.createDSThePhat = async (req, res) => {
    try {
        const dsThePhat = await DSThePhat.create(req.body);
        res.status(201).json({ message: 'Thêm DS thẻ phạt thành công!', data: dsThePhat });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi thêm DS thẻ phạt!', error });
    }
};

// Xóa DS thẻ phạt
exports.deleteDSThePhat = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await DSThePhat.destroy({ where: { MaThePhat: id } });
        if (result === 0) {
            return res.status(404).json({ message: 'Không tìm thấy DS thẻ phạt!' });
        }
        res.json({ message: 'Xóa DS thẻ phạt thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa DS thẻ phạt!', error });
    }
};

// Cập nhật DS thẻ phạt
exports.updateDSThePhat = async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedRows] = await DSThePhat.update(req.body, {
            where: { MaThePhat: id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy DS thẻ phạt để cập nhật!' });
        }

        const updatedDSThePhat = await DSThePhat.findOne({ where: { MaThePhat: id } });
        res.json({ message: 'Cập nhật DS thẻ phạt thành công!', data: updatedDSThePhat });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật DS thẻ phạt!', error });
    }
};
