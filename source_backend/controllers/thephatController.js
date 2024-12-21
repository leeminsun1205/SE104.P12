const { ThePhat, TranDau, CauThu, LoaiThePhat } = require('../models');

const ThePhatController = {
    async getAll(req, res) {
        try {
            const thePhats = await ThePhat.findAll({
                include: [
                    { model: TranDau, as: 'TranDau' },
                    { model: CauThu, as: 'CauThu' },
                    { model: LoaiThePhat, as: 'LoaiThePhat' },
                ],
            });
            res.status(200).json(thePhats);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách thẻ phạt.' });
        }
    },

    async getByTranDau(req, res) {
        try {
            const { MaTranDau } = req.params;
            const thePhats = await ThePhat.findAll({
                where: { MaTranDau },
                include: [
                    { model: CauThu, as: 'CauThu' },
                    { model: LoaiThePhat, as: 'LoaiThePhat' },
                ],
            });
            res.status(200).json(thePhats);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thẻ phạt của trận đấu.' });
        }
    },

    async create(req, res) {
        try {
            const { MaThePhat, MaTranDau, MaCauThu, MaLoaiThePhat, ThoiGian, LyDo } = req.body;
            const thePhat = await ThePhat.create({
                MaThePhat, MaTranDau, MaCauThu, MaLoaiThePhat, ThoiGian, LyDo,
            });
            res.status(201).json(thePhat);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi thêm thẻ phạt.' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const thePhat = await ThePhat.findByPk(id);
            if (!thePhat) return res.status(404).json({ error: 'Không tìm thấy thẻ phạt.' });
            await thePhat.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa thẻ phạt.' });
        }
    },
};

module.exports = ThePhatController;
