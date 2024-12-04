<<<<<<< HEAD
// controllers/DSThePhatController.js
const DSThePhat = require('../models/DSThePhat');
=======
const DSThePhat = require('../models/dsthephat');
>>>>>>> a07afed323c93860ee640e8f3265ba141ac6eadc

// Lấy tất cả DS thẻ phạt
exports.getDSThePhat = async (req, res) => {
    try {
<<<<<<< HEAD
        const thephats = await DSThePhat.findAll();
        res.status(200).json(thephats);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách thẻ phạt' });
=======
        const dsThePhats = await DSThePhat.findAll();
        res.json(dsThePhats);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách DS thẻ phạt!', error });
>>>>>>> a07afed323c93860ee640e8f3265ba141ac6eadc
    }
};

// Thêm DS thẻ phạt mới
exports.createDSThePhat = async (req, res) => {
    try {
<<<<<<< HEAD
        const { MaCauThu, MaVongDau, SoTheVang, SoTheDo, TinhTrangThiDau } = req.body;
        const newThePhat = await DSThePhat.create({ MaCauThu, MaVongDau, SoTheVang, SoTheDo, TinhTrangThiDau });
        res.status(201).json(newThePhat);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo mới thẻ phạt' });
=======
        const dsThePhat = await DSThePhat.create(req.body);
        res.status(201).json({ message: 'Thêm DS thẻ phạt thành công!', data: dsThePhat });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi thêm DS thẻ phạt!', error });
>>>>>>> a07afed323c93860ee640e8f3265ba141ac6eadc
    }
};

// Xóa DS thẻ phạt
exports.deleteDSThePhat = async (req, res) => {
    try {
<<<<<<< HEAD
        const { MaCauThu } = req.params;
        const deleted = await DSThePhat.destroy({
            where: { MaCauThu: MaCauThu }
=======
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
>>>>>>> a07afed323c93860ee640e8f3265ba141ac6eadc
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
