const { DsThePhat, CauThu, VongDau } = require('../models');

const DsThePhatController = {
    async getByVongDau(req, res) {
        try {
            const { MaVongDau } = req.params;
            const dsThePhat = await DsThePhat.findAll({
                where: { MaVongDau },
                include: [
                    { model: CauThu, as: 'CauThu' },
                    { model: VongDau, as: 'VongDau' },
                ],
            });
            res.status(200).json(dsThePhat);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách thẻ phạt theo vòng đấu.' });
        }
    },

    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const dsThePhat = await DsThePhat.findAll({
                where: { MaMuaGiai },
                include: [
                    { model: CauThu, as: 'CauThu' },
                ],
            });
            res.status(200).json(dsThePhat);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách thẻ phạt theo mùa giải.' });
        }
    },

    async create(req, res) {
        try {
            const { MaCauThu, MaVongDau, SoTheVang, SoTheDo } = req.body;

            // Kiểm tra điều kiện số thẻ vàng và thẻ đỏ
            let tinhTrangThiDau = 1; // Mặc định là có thể thi đấu
            if (SoTheVang >= 2 || SoTheDo >= 1) {
                tinhTrangThiDau = 0; // Nếu thẻ vàng >= 2 hoặc thẻ đỏ >= 1, thì treo giò
            }

            const dsThePhat = await DsThePhat.create({
                MaCauThu, MaVongDau, SoTheVang, SoTheDo, TinhTrangThiDau: tinhTrangThiDau,
            });
            res.status(201).json(dsThePhat);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi thêm danh sách thẻ phạt mới.' });
        }
    },

    async update(req, res) {
        try {
            const { macauthu, mavongdau } = req.params;
            const updates = req.body;
            const dsThePhat = await DsThePhat.findOne({
                where: {
                    macauthu, // Điều kiện đầu tiên
                    mavongdau  // Điều kiện thứ hai
                }
            });
            if (!dsThePhat) return res.status(404).json({ error: 'Không tìm thấy thông tin thẻ phạt.' });

            // Kiểm tra và cập nhật TinhTrangThiDau
            const { SoTheVang, SoTheDo } = updates;
            if (SoTheVang >= 2 || SoTheDo >= 1) {
                updates.TinhTrangThiDau = 0; // Treo giò
            } else {
                updates.TinhTrangThiDau = 1; // Có thể thi đấu
            }

            await dsThePhat.update(updates);
            res.status(200).json(dsThePhat);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật thông tin danh sách thẻ phạt.' });
        }
    },

    async delete(req, res) {
        try {
            const { macauthu, mavongdau } = req.params;
            const dsThePhat = await DsThePhat.findOne({
                where: {
                    macauthu, // Điều kiện đầu tiên
                    mavongdau  // Điều kiện thứ hai
                }
            });
            if (!dsThePhat) return res.status(404).json({ error: 'Không tìm thấy thông tin thẻ phạt.' });
            await dsThePhat.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa danh sách thẻ phạt.' });
        }
    },
};

module.exports = DsThePhatController;
