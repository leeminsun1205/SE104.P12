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
            // Lấy MaTranDau và MaDoiBong từ URL params
            const { MaTranDau, MaDoiBong } = req.params;
    
            // Lấy các trường còn lại từ body
            const { MaBanThang, MaCauThu, MaLoaiBanThang, ThoiDiem } = req.body;
    
            // Kiểm tra dữ liệu đầu vào (nếu cần thiết)
            if (!MaCauThu || !MaLoaiBanThang || !ThoiDiem) {
                return res.status(400).json({ error: 'Thiếu dữ liệu cần thiết để tạo bàn thắng.' });
            }
    
            // Tìm thông tin trận đấu từ MaTranDau
            const tranDau = await TranDau.findOne({
                where: { MaTranDau }
            });
    
            // Kiểm tra xem trận đấu có tồn tại không
            if (!tranDau) {
                return res.status(404).json({ error: 'Không tìm thấy trận đấu.' });
            }
    
            // Kiểm tra xem MaDoiBong có phải là đội nhà hoặc đội khách
            if (MaDoiBong !== tranDau.MaDoiBongNha && MaDoiBong !== tranDau.MaDoiBongKhach) {
                return res.status(400).json({ error: 'Đội bóng không thuộc trận đấu này.' });
            }
    
            // Cập nhật số bàn thắng cho đội nhà hoặc đội khách
            if (MaDoiBong === tranDau.MaDoiBongNha) {
                // Tăng số bàn thắng cho đội nhà
                tranDau.BanThangDoiNha = tranDau.BanThangDoiNha ? tranDau.BanThangDoiNha + 1 : 1;
            } else if (MaDoiBong === tranDau.MaDoiBongKhach) {
                // Tăng số bàn thắng cho đội khách
                tranDau.BanThangDoiKhach = tranDau.BanThangDoiKhach ? tranDau.BanThangDoiKhach + 1 : 1;
            }
    
            // Lưu thay đổi của trận đấu
            await tranDau.save();
    
            // Tạo bàn thắng mới
            const banThang = await BanThang.create({
                MaBanThang, MaTranDau, MaDoiBong, MaCauThu, MaLoaiBanThang, ThoiDiem,
            });
    
            // Trả về kết quả thành công
            res.status(201).json({ banThang, tranDau });
        } catch (error) {
            // Xử lý lỗi
            res.status(500).json({ error: 'Lỗi khi thêm bàn thắng.' });
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
