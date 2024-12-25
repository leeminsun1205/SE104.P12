const { BanThang, TranDau, CauThu, DoiBong, LoaiBanThang, MgDbCt, VongDau } = require('../models');

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
            // Lấy MaTranDau, MaDoiBong từ params và MaLoaiBanThang, ThoiDiem từ body
            const { MaTranDau, MaDoiBong, MaCauThu } = req.params;
            const { MaBanThang, MaLoaiBanThang, ThoiDiem } = req.body;
    
            // Kiểm tra các thông tin cần thiết
            if (!MaLoaiBanThang || !ThoiDiem) {
                return res.status(400).json({ error: 'Thiếu dữ liệu cần thiết để tạo bàn thắng.' });
            }
    
            // Kiểm tra trận đấu có tồn tại không
            const tranDau = await TranDau.findOne({
                where: { MaTranDau },
                include: {
                    model: VongDau,
                    as: 'VongDau',
                    attributes: ['MaMuaGiai'], // Lấy thông tin MaMuaGiai từ VongDau
                },
            });
    
            if (!tranDau) {
                return res.status(404).json({ error: 'Không tìm thấy trận đấu.' });
            }
    
            // Lấy MaMuaGiai từ VongDau
            const { MaMuaGiai } = tranDau.VongDau;
    
            // Kiểm tra trạng thái trận đấu
            if (tranDau.TinhTrang !== true) {
                return res.status(400).json({ error: 'Trận đấu không ở trạng thái đang diễn ra.' });
            }
    
            // Kiểm tra đội bóng có thuộc trận đấu không
            if (MaDoiBong !== tranDau.MaDoiBongNha && MaDoiBong !== tranDau.MaDoiBongKhach) {
                return res.status(400).json({ error: 'Đội bóng không thuộc trận đấu này.' });
            }
    
            // Kiểm tra cầu thủ có thuộc đội bóng không
            const isPlayerInTeam = await MgDbCt.findOne({
                where: { MaMuaGiai, MaDoiBong, MaCauThu },
            });
    
            if (!isPlayerInTeam) {
                return res.status(400).json({ error: 'Cầu thủ không thuộc đội bóng.' });
            }
    
            // Cập nhật số bàn thắng cho đội bóng
            if (MaDoiBong === tranDau.MaDoiBongNha) {
                tranDau.BanThangDoiNha = tranDau.BanThangDoiNha ? tranDau.BanThangDoiNha + 1 : 1;
            } else if (MaDoiBong === tranDau.MaDoiBongKhach) {
                tranDau.BanThangDoiKhach = tranDau.BanThangDoiKhach ? tranDau.BanThangDoiKhach + 1 : 1;
            }
    
            // Lưu thay đổi vào cơ sở dữ liệu
            await tranDau.save();
    
            // Tạo bản ghi bàn thắng
            const banThang = await BanThang.create({
                MaBanThang, MaTranDau, MaDoiBong, MaCauThu, MaLoaiBanThang, ThoiDiem,
            });
    
            // Trả về kết quả
            res.status(201).json({ banThang, tranDau });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
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
