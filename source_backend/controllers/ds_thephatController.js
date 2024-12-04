const DSThePhat = require('../models/dsthephat');

// Lấy danh sách thẻ phạt
const getDSThePhat = async (req, res) => {
    try {
        const thephats = await DSThePhat.findAll();
        res.status(200).json(thephats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Không thể lấy danh sách thẻ phạt.', details: err.message });
    }
};

// Thêm mới danh sách thẻ phạt
const createDSThePhat = async (req, res) => {
    try {
        const { MaCauThu, MaVongDau, SoTheVang, SoTheDo, TinhTrangThiDau } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!MaCauThu || !MaVongDau || SoTheVang === undefined || SoTheDo === undefined) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' });
        }

        const newThePhat = await DSThePhat.create({ MaCauThu, MaVongDau, SoTheVang, SoTheDo, TinhTrangThiDau });
        res.status(201).json({ message: 'Thêm thẻ phạt thành công!', data: newThePhat });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Không thể tạo mới thẻ phạt.', details: err.message });
    }
};

// Xóa danh sách thẻ phạt
const deleteDSThePhat = async (req, res) => {
    try {
        const { MaThePhat } = req.params;

        // Xóa danh sách thẻ phạt
        const result = await DSThePhat.destroy({ where: { MaThePhat } });
        if (result === 0) {
            return res.status(404).json({ message: `Không tìm thấy thẻ phạt với mã ${MaThePhat}!` });
        }

        res.status(200).json({ message: `Xóa thẻ phạt với mã ${MaThePhat} thành công!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa thẻ phạt!', details: error.message });
    }
};

// Cập nhật danh sách thẻ phạt
const updateDSThePhat = async (req, res) => {
    try {
        const { MaThePhat } = req.params;

        // Cập nhật danh sách thẻ phạt
        const [updatedRows] = await DSThePhat.update(req.body, { where: { MaThePhat } });

        if (updatedRows === 0) {
            return res.status(404).json({ message: `Không tìm thấy thẻ phạt với mã ${MaThePhat} để cập nhật!` });
        }

        const updatedDSThePhat = await DSThePhat.findOne({ where: { MaThePhat } });
        res.status(200).json({ message: `Cập nhật thẻ phạt với mã ${MaThePhat} thành công!`, data: updatedDSThePhat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật thẻ phạt!', details: error.message });
    }
};

module.exports = { getDSThePhat, createDSThePhat, deleteDSThePhat, updateDSThePhat };
