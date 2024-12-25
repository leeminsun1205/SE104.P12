const { TranDau, VongDau, MgDbCt, BanThang, VuaPhaLuoi } = require('../models');

// Hàm tự động cập nhật trận đấu
const autoUpdateMatch = async (MaTranDau, MaDoiBong, MaCauThu, MaLoaiBanThang, ThoiDiem) => {
    const tranDau = await TranDau.findOne({
        where: { MaTranDau },
        include: {
            model: VongDau,
            as: 'VongDau',
            attributes: ['MaMuaGiai'],
        },
    });

    if (!tranDau) {
        throw new Error('Không tìm thấy trận đấu.');
    }

    const { MaMuaGiai } = tranDau.VongDau;

    if (tranDau.TinhTrang !== true) {
        throw new Error('Trận đấu không ở trạng thái đang diễn ra.');
    }

    if (MaDoiBong !== tranDau.MaDoiBongNha && MaDoiBong !== tranDau.MaDoiBongKhach) {
        throw new Error('Đội bóng không thuộc trận đấu này.');
    }

    const isPlayerInTeam = await MgDbCt.findOne({
        where: { MaMuaGiai, MaDoiBong, MaCauThu },
    });

    if (!isPlayerInTeam) {
        throw new Error('Cầu thủ không thuộc đội bóng.');
    }

    if (MaDoiBong === tranDau.MaDoiBongNha) {
        tranDau.BanThangDoiNha = tranDau.BanThangDoiNha ? tranDau.BanThangDoiNha + 1 : 1;
    } else if (MaDoiBong === tranDau.MaDoiBongKhach) {
        tranDau.BanThangDoiKhach = tranDau.BanThangDoiKhach ? tranDau.BanThangDoiKhach + 1 : 1;
    }

    await tranDau.save();

    const banThang = await BanThang.create({
        MaTranDau,
        MaDoiBong,
        MaCauThu,
        MaLoaiBanThang,
        ThoiDiem,
    });

    // Gọi hàm tự động cập nhật vua phá lưới
    const vuaPhaLuoi = await autoUpdateTopScorer(MaCauThu, MaMuaGiai, MaDoiBong, MaTranDau);

    return { banThang, tranDau, vuaPhaLuoi };
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
