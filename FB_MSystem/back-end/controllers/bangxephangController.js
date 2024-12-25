const { BangXepHang, DoiBong, VongDau, MG_DB_CT } = require('../models');

const BangXepHangController = {
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const bangXepHang = await BangXepHang.findAll({
                where: { MaMuaGiai },
                include: [
                    { model: DoiBong, as: 'DoiBong' },
                    { model: VongDau, as: 'VongDau' },
                    {
                        model: MG_DB_CT, // Model has to be defined correctly
                        as: 'MG_DB_CT',   // Ensure alias is correct
                        include: [
                            { model: DoiBong, as: 'DoiNha', attributes: ['TenDoiBong'] },
                            { model: DoiBong, as: 'DoiKhach', attributes: ['TenDoiBong'] }
                        ]
                    }
                ],
                order: [['DiemSo', 'DESC']]
            });

            if (bangXepHang.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy bảng xếp hạng cho mùa giải này.' });
            }

            res.status(200).json(bangXepHang);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getByVongDau(req, res) {
        try {
            const { MaVongDau } = req.params;
            const bangXepHang = await BangXepHang.findAll({
                where: { MaVongDau },
                include: [
                    { model: DoiBong, as: 'DoiBong' },
                    {
                        model: MG_DB_CT,  // Model has to be defined correctly
                        as: 'MG_DB_CT',   // Ensure alias is correct
                        include: [
                            { model: DoiBong, as: 'DoiNha', attributes: ['TenDoiBong'] },
                            { model: DoiBong, as: 'DoiKhach', attributes: ['TenDoiBong'] }
                        ]
                    }
                ],
                order: [['DiemSo', 'DESC']]
            });

            if (bangXepHang.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy bảng xếp hạng cho vòng đấu này.' });
            }

            res.status(200).json(bangXepHang);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = BangXepHangController;
