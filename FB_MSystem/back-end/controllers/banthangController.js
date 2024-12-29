const { BanThang, TranDau, CauThu, DoiBong, LoaiBanThang, ThamSo, VongDau, sequelize} = require('../models');
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
    async getByTranDauandId(req, res) {
        try {
            const { MaTranDau, id } = req.params;
            const banThang = await BanThang.findOne({
                where: { MaTranDau: MaTranDau, MaBanThang: id },
                include: [
                    { model: TranDau, as: 'TranDau' },
                    { model: CauThu, as: 'CauThu' },
                    { model: DoiBong, as: 'DoiBong' },
                    { model: LoaiBanThang, as: 'LoaiBanThang' },
                ],
            });

            if (!banThang) {
                return res.status(404).json({ message: 'Không tìm thấy bàn thắng cho trận đấu và ID này.' });
            }

            res.status(200).json(banThang);
        } catch (error) {
            console.error('Lỗi khi lấy bàn thắng theo MaTranDau và ID:', error);
            res.status(500).json({ error: 'Lỗi khi lấy bàn thắng.', details: error.message });
        }
    },
    async getByCauThu(req, res) {
        try {
            const { MaCauThu } = req.params; // Lấy mã cầu thủ từ URL
    
            // Truy vấn danh sách bàn thắng của cầu thủ
            const banThangs = await BanThang.findAll({
                where: { MaCauThu },
                include: [
                    { model: TranDau, as: 'TranDau' }, // Thông tin trận đấu
                    { model: DoiBong, as: 'DoiBong' }, // Thông tin đội bóng
                    { model: LoaiBanThang, as: 'LoaiBanThang' }, // Loại bàn thắng
                ],
            });
    
            // Trả về danh sách bàn thắng
            res.status(200).json(banThangs);
        } catch (error) {
            console.error('Lỗi khi lấy bàn thắng theo mã cầu thủ:', error);
            res.status(500).json({ error: 'Lỗi khi lấy bàn thắng theo mã cầu thủ.' });
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
            const thamSo = await ThamSo.findOne(); // Changed to findOne()
            if (!thamSo) {
                return res.status(500).json({ error: 'Tham số hệ thống chưa được cấu hình.' });
            }
            const { ThoiDiemGhiBanToiDa } = thamSo; // Access property directly
    
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
    async putByTranDauandID(req, res) {
        try {
            const { MaTranDau, id } = req.params;
            const { MaLoaiBanThang, ThoiDiem } = req.body;

            // Tìm bàn thắng cần cập nhật
            const banThang = await BanThang.findOne({
                where: { MaTranDau: MaTranDau, MaBanThang: id }
            });

            if (!banThang) {
                return res.status(404).json({ message: 'Không tìm thấy bàn thắng cho trận đấu và ID này.' });
            }

            // Cập nhật các trường có thể thay đổi
            if (MaLoaiBanThang) {
                banThang.MaLoaiBanThang = MaLoaiBanThang;
            }
            if (ThoiDiem) {
                banThang.ThoiDiem = ThoiDiem;
            }

            await banThang.save();

            // Lấy lại thông tin bàn thắng đã cập nhật để trả về
            const updatedBanThang = await BanThang.findByPk(id, {
                include: [
                    { model: TranDau, as: 'TranDau' },
                    { model: CauThu, as: 'CauThu' },
                    { model: DoiBong, as: 'DoiBong' },
                    { model: LoaiBanThang, as: 'LoaiBanThang' },
                ],
            });

            res.status(200).json(updatedBanThang);

        } catch (error) {
            console.error('Lỗi khi cập nhật bàn thắng theo MaTranDau và ID:', error);
            res.status(500).json({ error: 'Lỗi khi cập nhật bàn thắng.', details: error.message });
        }
    },
    async delete(req, res) {
        const t = await sequelize.transaction(); 
        try {
            const { id } = req.params;
            const banThang = await BanThang.findByPk(id, { transaction: t });
            if (!banThang) {
                await t.rollback(); // Rollback nếu không tìm thấy bàn thắng
                return res.status(404).json({ error: 'Không tìm thấy bàn thắng.' });
            }
    
            // Lấy thông tin MaCauThu và MaMuaGiai từ bàn thắng bị xóa
            const { MaCauThu, TranDau } = banThang;
            const { MaVongDau } = await VongDau.findByPk(TranDau.MaVongDau, {
                attributes: ['MaVongDau'],
                include: [{ model: MuaGiai, as: 'MuaGiai', attributes: ['MaMuaGiai'] }],
                transaction: t,
            });
    
            const MaMuaGiai = TranDau.VongDau.MuaGiai.MaMuaGiai;
    
            await banThang.destroy({ transaction: t });
    
            // Cập nhật Vua Phá Lưới
            await updateVuaPhaLuoi(MaMuaGiai, t);
    
            await t.commit(); // Commit nếu mọi thứ thành công
            res.status(204).send();
        } catch (error) {
            await t.rollback(); // Rollback nếu có lỗi
            console.error('Lỗi khi xóa bàn thắng:', error);
            res.status(500).json({ error: 'Lỗi khi xóa bàn thắng.', details: error.message });
        }
    },
    async deleteByTranDauandID(req, res) {
        try {
            const { MaTranDau, id } = req.params;

            const banThang = await BanThang.findOne({
                where: { MaTranDau: MaTranDau, MaBanThang: id }
            });

            if (!banThang) {
                return res.status(404).json({ message: 'Không tìm thấy bàn thắng với MaTranDau và ID này.' });
            }

            await banThang.destroy();

            res.status(200).json({ message: 'Xóa bàn thắng thành công.' });

        } catch (error) {
            console.error('Lỗi khi xóa bàn thắng theo MaTranDau và ID:', error);
            res.status(500).json({ error: 'Lỗi khi xóa bàn thắng.', details: error.message });
        }
    },
    
    // Hàm cập nhật Vua Phá Lưới
    async updateVuaPhaLuoi(MaMuaGiai, transaction) {
        try {
            // Xóa các bản ghi hiện tại trong bảng VuaPhaLuoi cho mùa giải này
            await VuaPhaLuoi.destroy({
                where: { MaMuaGiai: MaMuaGiai },
                transaction: transaction,
            });
    
            // Tính toán lại Vua Phá Lưới từ bảng BanThang
            const topScorers = await BanThang.findAll({
                attributes: [
                    'MaCauThu',
                    [sequelize.fn('COUNT', sequelize.col('MaBanThang')), 'SoBanThang'],
                ],
                where: {
                    MaMuaGiai: MaMuaGiai,
                },
                group: ['MaCauThu'],
                order: [[sequelize.fn('COUNT', sequelize.col('MaBanThang')), 'DESC']],
                limit: 1, // Chỉ lấy người ghi bàn nhiều nhất
                transaction: transaction,
            });
    
            // Thêm bản ghi mới vào VuaPhaLuoi nếu có cầu thủ ghi bàn
            if (topScorers.length > 0) {
                const topScorer = topScorers[0];
                await VuaPhaLuoi.create({
                    MaMuaGiai: MaMuaGiai,
                    MaCauThu: topScorer.MaCauThu,
                    SoBanThang: topScorer.get('SoBanThang'),
                }, { transaction: transaction });
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật Vua Phá Lưới:', error);
            throw error; // Re-throw lỗi để được xử lý ở cấp cao hơn
        }
    }
};

module.exports = BanThangController;
