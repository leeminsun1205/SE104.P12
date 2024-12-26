const { BanThang, TranDau, CauThu, DoiBong, LoaiBanThang, ThamSo} = require('../models');
const { autoUpdateMatch } = require('../services/autoUpdateServices');

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
            const { MaTranDau, MaDoiBong, MaCauThu } = req.params;
            const { MaLoaiBanThang, ThoiDiem } = req.body;
    
            if (!MaLoaiBanThang || !ThoiDiem) {
                return res.status(400).json({ error: 'Thiếu dữ liệu cần thiết để tạo bàn thắng.' });
            }
    
            // Lấy thông tin từ bảng ThamSo
            const thamSo = await ThamSo.findOne();
            if (!thamSo) {
                return res.status(500).json({ error: 'Tham số hệ thống chưa được cấu hình.' });
            }
    
            const { ThoiDiemGhiBanToiDa } = thamSo;
    
            // Kiểm tra điều kiện ThoiDiem
            if (ThoiDiem > ThoiDiemGhiBanToiDa) {
                return res.status(400).json({
                    error: `Thời điểm ghi bàn không hợp lệ. Phải nhỏ hơn hoặc bằng ${ThoiDiemGhiBanToiDa}.`,
                });
            }
    
            // Gọi hàm tự động cập nhật trận đấu
            const { banThang, tranDau, vuaPhaLuoi } = await autoUpdateMatch(
                MaTranDau,
                MaDoiBong,
                MaCauThu,
                MaLoaiBanThang,
                ThoiDiem
            );
    
            res.status(201).json({ banThang, tranDau, vuaPhaLuoi });
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
