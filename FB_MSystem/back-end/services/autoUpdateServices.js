const { TranDau, VongDau, MgDb, DbCt, BanThang, VuaPhaLuoi, DoiBong, LoaiBanThang } = require('../models');
const sequelize = require('../config/database');

const autoUpdateMatch = async (maTranDau, maDoiBong, maCauThu, maLoaiBanThang, thoiDiem) => {
    const transaction = await sequelize.transaction();

    try {
        // Lấy thông tin trận đấu
        const tranDau = await TranDau.findOne({
            where: { MaTranDau: maTranDau },
            include: {
                model: VongDau,
                as: 'VongDau',
                attributes: ['MaMuaGiai'],
            },
            transaction,
            lock: transaction.LOCK.UPDATE // Thêm lock để tránh race condition khi cập nhật
        });

        if (!tranDau) {
            throw new Error('Không tìm thấy trận đấu.');
        }

        if (tranDau.TinhTrang !== true) {
            throw new Error('Trận đấu không ở trạng thái đang diễn ra.');
        }
        if (maDoiBong !== tranDau.MaDoiBongNha && maDoiBong !== tranDau.MaDoiBongKhach) {
            throw new Error('Đội bóng không thuộc trận đấu này.');
        }

        // Kiểm tra xem cầu thủ có thuộc đội bóng này không
        const isPlayerInTeam = await DbCt.findOne({
            where: { MaCauThu: maCauThu, MaDoiBong: maDoiBong },
            transaction,
        });

        if (!isPlayerInTeam) {
            throw new Error('Cầu thủ không thuộc đội bóng này.');
        }

        

        // Cập nhật số bàn thắng
        console.log(maLoaiBanThang);
        if (maLoaiBanThang === 'LBT03') { // LBT03 là mã loại bàn thắng "Phản lưới nhà"
            if (maDoiBong === tranDau.MaDoiBongNha) {
                tranDau.BanThangDoiKhach = (tranDau.BanThangDoiKhach || 0) + 1;
            } else if (maDoiBong === tranDau.MaDoiBongKhach) {
                tranDau.BanThangDoiNha = (tranDau.BanThangDoiNha || 0) + 1;
            }
        } else {
            if (maDoiBong === tranDau.MaDoiBongNha) {
                tranDau.BanThangDoiNha = (tranDau.BanThangDoiNha || 0) + 1;
            } else if (maDoiBong === tranDau.MaDoiBongKhach) {
                tranDau.BanThangDoiKhach = (tranDau.BanThangDoiKhach || 0) + 1;
            }
        }

        await tranDau.save({ transaction });

        // Tạo mới bàn thắng
        const banThang = await BanThang.create({
            MaTranDau: maTranDau,
            MaDoiBong: maDoiBong,
            MaCauThu: maCauThu,
            MaLoaiBanThang: maLoaiBanThang,
            ThoiDiem: thoiDiem,
        }, { transaction });

        // Gọi hàm tự động cập nhật vua phá lưới (đã được sửa đổi để nhận transaction)
        const vuaPhaLuoiResult = await autoUpdateTopScorer(maCauThu, tranDau.VongDau.MaMuaGiai, maDoiBong, maTranDau, transaction);

        await transaction.commit();

        return { banThang, tranDau, vuaPhaLuoi: vuaPhaLuoiResult };

    } catch (error) {
        await transaction.rollback();
        console.error("Lỗi khi cập nhật trận đấu:", error);
        throw error;
    }
};

// Hàm tự động cập nhật vua phá lưới (đã sửa đổi để nhận transaction)
const autoUpdateTopScorer = async (MaCauThu, MaMuaGiai, MaDoiBong, MaTranDau, transaction) => {
    // Tìm cầu thủ trong bảng VuaPhaLuoi với lock
    let vuaPhaLuoi = await VuaPhaLuoi.findOne({
        where: { MaCauThu, MaMuaGiai },
        transaction,
        lock: transaction.LOCK.UPDATE
    });

    const hasScoredInMatch = await BanThang.findOne({
        where: { MaTranDau, MaCauThu },
        transaction,
    });

    if (!vuaPhaLuoi) {
        vuaPhaLuoi = await VuaPhaLuoi.create({
            MaCauThu,
            MaMuaGiai,
            MaDoiBong,
            SoTran: 1,
            SoBanThang: 1,
        }, { transaction });
    } else {
        vuaPhaLuoi.SoBanThang += 1;
        if (!hasScoredInMatch) {
            vuaPhaLuoi.SoTran += 1;
        }
        await vuaPhaLuoi.save({ transaction });
    }

    return vuaPhaLuoi;
};

module.exports = {
    autoUpdateMatch,
    autoUpdateTopScorer,
};