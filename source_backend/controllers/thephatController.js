const ThePhat = require('../models/thephat');

const getThePhat = async (req, res) => {
    try {
        const thePhats = await ThePhat.findAll();
        res.status(200).json(thePhats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách thẻ phạt!', details: error.message });
    }
};

const createThePhat = async (req, res) => {
    try {
        const { MaCauThu, MaTranDau, MaLoaiThePhat, ThoiDiem, LyDo } = req.body;

        if (!MaCauThu || !MaTranDau || !MaLoaiThePhat || !ThoiDiem) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' });
        }

        const thePhat = await ThePhat.create({ MaCauThu, MaTranDau, MaLoaiThePhat, ThoiDiem, LyDo });
        res.status(201).json({ message: 'Thêm thẻ phạt thành công!', data: thePhat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi thêm thẻ phạt!', details: error.message });
    }
};

const deleteThePhat = async (req, res) => {
    try {
        const { MaThePhat } = req.params;

        const result = await ThePhat.destroy({ where: { MaThePhat } });
        if (result === 0) {
            return res.status(404).json({ message: `Không tìm thấy thẻ phạt với mã ${MaThePhat}!` });
        }

        res.status(200).json({ message: `Xóa thẻ phạt với mã ${MaThePhat} thành công!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa thẻ phạt!', details: error.message });
    }
};

const updateThePhat = async (req, res) => {
    try {
        const { MaThePhat } = req.params;
        const { MaCauThu, MaTranDau, MaLoaiThePhat, ThoiDiem, LyDo } = req.body;

        if (!MaCauThu && !MaTranDau && !MaLoaiThePhat && !ThoiDiem && !LyDo) {
            return res.status(400).json({ message: 'Không có thông tin nào để cập nhật!' });
        }

        const [updatedRows] = await ThePhat.update(
            { MaCauThu, MaTranDau, MaLoaiThePhat, ThoiDiem, LyDo },
            { where: { MaThePhat } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ message: `Không tìm thấy thẻ phạt với mã ${MaThePhat} để cập nhật!` });
        }

        const updatedThePhat = await ThePhat.findOne({ where: { MaThePhat } });
        res.status(200).json({ message: `Cập nhật thẻ phạt với mã ${MaThePhat} thành công!`, data: updatedThePhat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật thẻ phạt!', details: error.message });
    }
};

module.exports = { getThePhat, createThePhat, deleteThePhat, updateThePhat };
