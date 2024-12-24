const { BanThang, TranDau, CauThu, DoiBong, LoaiBanThang } = require('../models');

const BanThangController = {
    async getAll(req, res) {
        try {
            const banThangs = await BanThang.findAll({
                include: [
                    { model: TranDau, as: 'TranDau' },
                    { model: CauThu, as: 'CauThu' },
                    { model: DoiBong, as: 'DoiBong' },
                    { model: LoaiBanThang, as: 'LoaiBanThang' },
                ],
            });
            res.status(200).json(banThangs);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách bàn thắng.' });
        }
    },

    async getByTranDau(req, res) {
        try {
            const { MaTranDau } = req.params;
            const banThangs = await BanThang.findAll({
                where: { MaTranDau },
                include: [
                    { model: CauThu, as: 'CauThu' },
                    { model: DoiBong, as: 'DoiBong' },
                    { model: LoaiBanThang, as: 'LoaiBanThang' },
                ],
            });
            res.status(200).json(banThangs);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy bàn thắng của trận đấu.' });
        }
    },

    async create(req, res) {
        try {
            const { MaTranDau, MaDoiBong } = req.params;
            const { MaBanThang, MaCauThu, MaLoaiBanThang, ThoiDiem } = req.body;
    
            if (!MaCauThu || !MaLoaiBanThang || !ThoiDiem) {
                return res.status(400).json({ error: 'Thiếu dữ liệu cần thiết để tạo bàn thắng.' });
            }
    
            const tranDau = await TranDau.findOne({
                where: { MaTranDau }
            });
    
            if (!tranDau) {
                return res.status(404).json({ error: 'Không tìm thấy trận đấu.' });
            }
    
            if (tranDau.TinhTrang !== true) {
                return res.status(400).json({ error: 'Trận đấu không ở trạng thái đang diễn ra.' });
            }
    
            if (MaDoiBong !== tranDau.MaDoiBongNha && MaDoiBong !== tranDau.MaDoiBongKhach) {
                return res.status(400).json({ error: 'Đội bóng không thuộc trận đấu này.' });
            }

            if (MaDoiBong === tranDau.MaDoiBongNha) {
                tranDau.BanThangDoiNha = tranDau.BanThangDoiNha ? tranDau.BanThangDoiNha + 1 : 1;
            } else if (MaDoiBong === tranDau.MaDoiBongKhach) {
                tranDau.BanThangDoiKhach = tranDau.BanThangDoiKhach ? tranDau.BanThangDoiKhach + 1 : 1;
            }
    
            await tranDau.save();
    
            const banThang = await BanThang.create({
                MaBanThang, MaTranDau, MaDoiBong, MaCauThu, MaLoaiBanThang, ThoiDiem,
            });
    
            res.status(201).json({ banThang, tranDau });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const banThang = await BanThang.findByPk(id);
            if (!banThang) return res.status(404).json({ error: 'Không tìm thấy bàn thắng.' });
            await banThang.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa bàn thắng.' });
        }
    },
};

module.exports = BanThangController;
