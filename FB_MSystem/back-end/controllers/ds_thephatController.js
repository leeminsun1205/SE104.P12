const { DsThePhat, CauThu, VongDau, ThePhat, TranDau } = require('../models');

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
            console.error('Lỗi khi lấy danh sách thẻ phạt theo vòng đấu.', error);
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

    async update(req, res) {
        try {
            // Không cần params, logic tự động cập nhật toàn bộ danh sách thẻ phạt
            const thePhatData = await ThePhat.findAll({
                attributes: ['MaCauThu', 'MaTranDau'], // Chỉ lấy MaCauThu và MaTranDau
            });

            // Lấy MaVongDau từ bảng TranDau dựa trên MaTranDau
            const tranDauMap = {};
            const tranDauData = await TranDau.findAll({
                attributes: ['MaTranDau', 'MaVongDau'], // Chỉ lấy MaTranDau và MaVongDau
            });
            tranDauData.forEach(tran => {
                tranDauMap[tran.MaTranDau] = tran.MaVongDau;
            });

            // Duyệt qua danh sách ThePhat và cập nhật DsThePhat
            for (const thePhat of thePhatData) {
                const { MaCauThu, MaTranDau } = thePhat;
                const MaVongDau = tranDauMap[MaTranDau];

                if (!MaVongDau) {
                    console.warn(`Không tìm thấy MaVongDau cho MaTranDau: ${MaTranDau}`);
                    continue;
                }

                // Đếm số thẻ vàng và thẻ đỏ của cầu thủ trong vòng đấu
                const soThe = await ThePhat.findAll({
                    attributes: [
                        [sequelize.fn('SUM', sequelize.literal("CASE WHEN MaLoaiThePhat = 'VANG' THEN 1 ELSE 0 END")), 'SoTheVang'],
                        [sequelize.fn('SUM', sequelize.literal("CASE WHEN MaLoaiThePhat = 'DO' THEN 1 ELSE 0 END")), 'SoTheDo'],
                    ],
                    where: {
                        MaCauThu,
                        MaTranDau,
                    },
                    raw: true,
                });

                const SoTheVang = parseInt(soThe[0].SoTheVang, 10) || 0;
                const SoTheDo = parseInt(soThe[0].SoTheDo, 10) || 0;

                // Cập nhật TinhTrangThiDau
                const TinhTrangThiDau = SoTheVang >= 2 || SoTheDo >= 1 ? 0 : 1; // 0: Treo giò, 1: Có thể thi đấu

                // Kiểm tra và cập nhật DsThePhat
                const [dsThePhat, created] = await DsThePhat.findOrCreate({
                    where: { MaCauThu, MaVongDau },
                    defaults: { SoTheVang, SoTheDo, TinhTrangThiDau },
                });

                if (!created) {
                    await dsThePhat.update({ SoTheVang, SoTheDo, TinhTrangThiDau });
                }
            }

            res.status(200).json({ message: 'Cập nhật danh sách thẻ phạt thành công!' });
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật thông tin danh sách thẻ phạt.' });
        }
    },
};

module.exports = DsThePhatController;
