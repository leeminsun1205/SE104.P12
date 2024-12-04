const BanThang = require('../models/banthang');
const TranDau = require('../models/trandau');
const CauThu = require('../models/cauthu');
const LoaiBanThang = require('../models/loaibanthang');
const DoiBong = require('../models/doibong');

// Lấy danh sách bàn thắng
const getBanThang = async (req, res) => {
    try {
        const { MaTranDau, MaDoiBong } = req.query;
        const whereCondition = {};

        if (MaTranDau) whereCondition.MaTranDau = MaTranDau;
        if (MaDoiBong) whereCondition.MaDoiBong = MaDoiBong;

        const banThangs = await BanThang.findAll({
            where: whereCondition,
            include: [
                { model: TranDau, as: 'tranDau' },
                { model: CauThu, as: 'cauThu' },
                { model: LoaiBanThang, as: 'loaiBanThang' },
                { model: DoiBong, as: 'doiBong' },
            ],
        });

        res.status(200).json(banThangs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể lấy danh sách bàn thắng.', error: error.message });
    }
};

// Thêm bàn thắng mới
const createBanThang = async (req, res) => {
    try {
        const { MaBanThang, MaTranDau, MaDoiBong, MaCauThu, MaLoaiBanThang, ThoiDiem } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!MaBanThang || !MaTranDau || !MaDoiBong || !MaCauThu || !MaLoaiBanThang || !ThoiDiem) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc để thêm bàn thắng.' });
        }

        // Kiểm tra ràng buộc
        const tranDau = await TranDau.findOne({ where: { MaTranDau } });
        if (!tranDau) return res.status(404).json({ message: `Không tìm thấy trận đấu với mã ${MaTranDau}.` });

        const cauThu = await CauThu.findOne({ where: { MaCauThu } });
        if (!cauThu) return res.status(404).json({ message: `Không tìm thấy cầu thủ với mã ${MaCauThu}.` });

        const loaiBanThang = await LoaiBanThang.findOne({ where: { MaLoaiBanThang } });
        if (!loaiBanThang) return res.status(404).json({ message: `Không tìm thấy loại bàn thắng với mã ${MaLoaiBanThang}.` });

        const doiBong = await DoiBong.findOne({ where: { MaDoiBong } });
        if (!doiBong) return res.status(404).json({ message: `Không tìm thấy đội bóng với mã ${MaDoiBong}.` });

        // Thêm bàn thắng
        const newBanThang = await BanThang.create({ MaBanThang, MaTranDau, MaDoiBong, MaCauThu, MaLoaiBanThang, ThoiDiem });

        res.status(201).json({ message: 'Thêm bàn thắng thành công.', newBanThang });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể thêm bàn thắng.', error: error.message });
    }
};

// Cập nhật bàn thắng
const updateBanThang = async (req, res) => {
    try {
        const { MaBanThang } = req.params;
        const { ThoiDiem } = req.body;

        const banThang = await BanThang.findOne({ where: { MaBanThang } });
        if (!banThang) return res.status(404).json({ message: `Không tìm thấy bàn thắng với mã ${MaBanThang}.` });

        await banThang.update({ ThoiDiem });

        res.status(200).json({ message: `Cập nhật bàn thắng với mã ${MaBanThang} thành công.`, banThang });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể cập nhật bàn thắng.', error: error.message });
    }
};

// Xóa bàn thắng
const deleteBanThang = async (req, res) => {
    try {
        const { MaBanThang } = req.params;

        const deleted = await BanThang.destroy({ where: { MaBanThang } });
        if (!deleted) return res.status(404).json({ message: `Không tìm thấy bàn thắng với mã ${MaBanThang}.` });

        res.status(200).json({ message: `Xóa bàn thắng với mã ${MaBanThang} thành công.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể xóa bàn thắng.', error: error.message });
    }
};

module.exports = { getBanThang, createBanThang, updateBanThang, deleteBanThang };
