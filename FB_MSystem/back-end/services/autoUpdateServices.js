const sequelize = require('../config/database',{logging: console.log, });
const { TranDau, VongDau, MgDb, DbCt, BanThang, VuaPhaLuoi } = require('../models');

// Hàm tự động cập nhật trận đấu
const autoUpdateMatch = async (maTranDau, maDoiBongParam, maCauThuParam, maLoaiBanThang, thoiDiem) => {
    console.log("Bắt đầu autoUpdateMatch với:", { maTranDau, maDoiBong: maDoiBongParam, maCauThu: maCauThuParam, maLoaiBanThang, thoiDiem });
    const transaction = await sequelize.transaction(); // Start a transaction

    try {
        const maCauThu = maCauThuParam;
        const maDoiBong = maDoiBongParam;

        // Lấy thông tin trận đấu, bao gồm mùa giải
        const tranDau = await TranDau.findOne({
            where: { MaTranDau: maTranDau },
            include: {
                model: VongDau,
                as: 'VongDau',
                attributes: ['MaMuaGiai'],
            },
            transaction,
            
            rejectOnEmpty: true, // Thêm để throw lỗi nếu không tìm thấy
        });

        console.log("Thông tin TranDau:", tranDau.toJSON());

        if (tranDau.TinhTrang !== true) {
            throw new Error('Trận đấu không ở trạng thái đang diễn ra.');
        }

        if (maDoiBong !== tranDau.MaDoiBongNha && maDoiBong !== tranDau.MaDoiBongKhach) {
            throw new Error('Đội bóng không thuộc trận đấu này.');
        }

        const maMuaGiai = tranDau.VongDau.MaMuaGiai;

        const isPlayerInTeamInSeason = await DbCt.findOne({
            where: { MaCauThu: maCauThu },
            include: [{
                model: MgDb,
                as: 'MgDb', // Đảm bảo bí danh này khớp với định nghĩa association của bạn
                where: { MaMuaGiai: maMuaGiai, MaDoiBong: maDoiBong},
                required: true // Bắt buộc phải có bản ghi khớp ở bảng MgDb
            }],
            logging: console.log,
            transaction,
        });

        console.log("Kết quả kiểm tra cầu thủ trong đội (mùa giải):", isPlayerInTeamInSeason ? isPlayerInTeamInSeason.toJSON() : 'Không tìm thấy');

        if (!isPlayerInTeamInSeason) {
            throw new Error('Cầu thủ không thuộc đội bóng trong mùa giải này.');
        }

        if (maDoiBong === tranDau.MaDoiBongNha) {
            tranDau.BanThangDoiNha = (tranDau.BanThangDoiNha || 0) + 1;
        } else if (maDoiBong === tranDau.MaDoiBongKhach) {
            tranDau.BanThangDoiKhach = (tranDau.BanThangDoiKhach || 0) + 1;
        }

        await tranDau.save({ transaction });

        const banThang = await BanThang.create({
            MaTranDau: maTranDau,
            MaDoiBong: maDoiBong,
            MaCauThu: maCauThu,
            MaLoaiBanThang: maLoaiBanThang,
            ThoiDiem: thoiDiem,
            transaction,
        });

        // Gọi hàm tự động cập nhật vua phá lưới
        const vuaPhaLuoi = await autoUpdateTopScorer(maCauThu, maMuaGiai, maDoiBong, maTranDau, transaction); // Pass transaction

        await transaction.commit();

        return { banThang, tranDau, vuaPhaLuoi };

    } catch (error) {
        await transaction.rollback();
        console.error("Lỗi khi cập nhật trận đấu:", error);
        throw error;
    }
};

// Hàm tự động cập nhật vua phá lưới
const autoUpdateTopScorer = async (MaCauThu, MaMuaGiai, MaDoiBong, MaTranDau) => {
    // Tìm cầu thủ trong bảng VuaPhaLuoi
    let vuaPhaLuoi = await VuaPhaLuoi.findOne({
        where: { MaCauThu, MaMuaGiai },
    });

    // Kiểm tra xem cầu thủ đã ghi bàn trong trận này chưa
    const hasScoredInMatch = await BanThang.findOne({
        where: { MaTranDau, MaCauThu },
    });

    if (!vuaPhaLuoi) {
        // Nếu cầu thủ chưa có trong bảng VuaPhaLuoi, thêm mới
        vuaPhaLuoi = await VuaPhaLuoi.create({
            MaCauThu,
            MaMuaGiai,
            MaDoiBong,
            SoTran: 1, // Ghi bàn lần đầu trong trận này
            SoBanThang: 1, // Ghi 1 bàn thắng
        });
    } else {
        // Nếu cầu thủ đã có trong bảng VuaPhaLuoi, cập nhật
        vuaPhaLuoi.SoBanThang += 1;

        // Tăng số trận nếu chưa ghi bàn trong trận này
        if (!hasScoredInMatch) {
            vuaPhaLuoi.SoTran += 1;
        }

        await vuaPhaLuoi.save();
    }

    return vuaPhaLuoi;
};

module.exports = {
    autoUpdateMatch,
    autoUpdateTopScorer,
};
