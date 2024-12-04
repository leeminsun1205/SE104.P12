const LoaiThePhat = require('../models/loaithephat');

// Lấy danh sách loại thẻ phạt
const getLoaiThePhat = async (req, res) => {
    try {
        const loaiThePhats = await LoaiThePhat.findAll();
        res.status(200).json(loaiThePhats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Không thể lấy danh sách loại thẻ phạt.', details: err.message });
    }
};

// Thêm loại thẻ phạt mới
const createLoaiThePhat = async (req, res) => {
    try {
        const { TenLoaiThePhat, MoTa } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!TenLoaiThePhat) {
            return res.status(400).json({ message: 'Tên loại thẻ phạt là bắt buộc!' });
        }

        const loaiThePhat = await LoaiThePhat.create({ TenLoaiThePhat, MoTa });
        res.status(201).json({ message: 'Thêm loại thẻ phạt thành công!', data: loaiThePhat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi thêm loại thẻ phạt!', details: error.message });
    }
};

// Xóa loại thẻ phạt
const deleteLoaiThePhat = async (req, res) => {
    try {
        const { MaLoaiThePhat } = req.params;

        // Xóa loại thẻ phạt
        const result = await LoaiThePhat.destroy({ where: { MaLoaiThePhat } });
        if (result === 0) {
            return res.status(404).json({ message: `Không tìm thấy loại thẻ phạt với mã ${MaLoaiThePhat}!` });
        }

        res.status(200).json({ message: `Xóa loại thẻ phạt với mã ${MaLoaiThePhat} thành công!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa loại thẻ phạt!', details: error.message });
    }
};

// Cập nhật loại thẻ phạt
const updateLoaiThePhat = async (req, res) => {
    try {
        const { MaLoaiThePhat } = req.params;
        const { TenLoaiThePhat, MoTa } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!TenLoaiThePhat && !MoTa) {
            return res.status(400).json({ message: 'Không có thông tin nào để cập nhật!' });
        }

        // Cập nhật loại thẻ phạt
        const [updatedRows] = await LoaiThePhat.update({ TenLoaiThePhat, MoTa }, { where: { MaLoaiThePhat } });

        if (updatedRows === 0) {
            return res.status(404).json({ message: `Không tìm thấy loại thẻ phạt với mã ${MaLoaiThePhat} để cập nhật!` });
        }

        const updatedLoaiThePhat = await LoaiThePhat.findOne({ where: { MaLoaiThePhat } });
        res.status(200).json({ message: `Cập nhật loại thẻ phạt với mã ${MaLoaiThePhat} thành công!`, data: updatedLoaiThePhat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật loại thẻ phạt!', details: error.message });
    }
};

module.exports = { getLoaiThePhat, createLoaiThePhat, deleteLoaiThePhat, updateLoaiThePhat };
