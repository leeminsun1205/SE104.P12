// src/utils/bangXepHangUtils.js
const { TranDau } = require('../models'); // Đảm bảo import các model cần thiết
const Sequelize = require('sequelize');

async function sortByDoiDau(MaMuaGiai, bangXepHang) {
    const getHeadToHeadStats = async (doiBong1, doiBong2) => {
        const tranDaus = await TranDau.findAll({
            where: {
                MaVongDau: { [Sequelize.Op.startsWith]: MaMuaGiai },
                [Sequelize.Op.or]: [
                    { MaDoiBongNha: doiBong1.MaDoiBong, MaDoiBongKhach: doiBong2.MaDoiBong },
                    { MaDoiBongNha: doiBong2.MaDoiBong, MaDoiBongKhach: doiBong1.MaDoiBong }
                ]
            },
            attributes: ['BanThangDoiNha', 'BanThangDoiKhach', 'MaDoiBongNha'],
        });

        let diemDoi1 = 0;
        let diemDoi2 = 0;
        let hieuSoDoi1 = 0;
        let hieuSoDoi2 = 0;
        let banThangDoi1 = 0;
        let banThangDoi2 = 0;

        for (const tranDau of tranDaus) {
            const nha = tranDau.MaDoiBongNha === doiBong1.MaDoiBong;
            const thangDoiNha = nha ? tranDau.BanThangDoiNha : tranDau.BanThangDoiKhach;
            const thangDoiKhach = nha ? tranDau.BanThangDoiKhach : tranDau.BanThangDoiNha;

            if (thangDoiNha > thangDoiKhach) {
                if (nha) diemDoi1 += 3;
                else diemDoi2 += 3;
            } else if (thangDoiNha < thangDoiKhach) {
                if (nha) diemDoi2 += 3;
                else diemDoi1 += 3;
            } else {
                diemDoi1 += 1;
                diemDoi2 += 1;
            }

            if (nha) {
                banThangDoi1 += tranDau.BanThangDoiNha;
                banThangDoi2 += tranDau.BanThangDoiKhach;
                hieuSoDoi1 += tranDau.BanThangDoiNha - tranDau.BanThangDoiKhach;
            } else {
                banThangDoi2 += tranDau.BanThangDoiNha;
                banThangDoi1 += tranDau.BanThangDoiKhach;
                hieuSoDoi2 += tranDau.BanThangDoiNha - tranDau.BanThangDoiKhach;
            }
        }

        return { diemDoi1, diemDoi2, hieuSoDoi1, hieuSoDoi2, banThangDoi1, banThangDoi2 };
    };

    const compareTeams = async (teamA, teamB) => {
        const headToHead = await getHeadToHeadStats(teamA, teamB);
        if (headToHead.diemDoi1 !== headToHead.diemDoi2) {
            return headToHead.diemDoi2 - headToHead.diemDoi1;
        }
        if (headToHead.hieuSoDoi1 !== headToHead.hieuSoDoi2) {
            return headToHead.hieuSoDoi2 - headToHead.hieuSoDoi1;
        }
        if (headToHead.banThangDoi1 !== headToHead.banThangDoi2) {
            return headToHead.banThangDoi2 - headToHead.banThangDoi1;
        }
        return 0;
    };

    const sortPromises = [];
    for (let i = 0; i < bangXepHang.length; i++) {
        for (let j = i + 1; j < bangXepHang.length; j++) {
            const teamA = bangXepHang[i];
            const teamB = bangXepHang[j];

            if (teamA.DiemSo === teamB.DiemSo && teamA.HieuSo === teamB.HieuSo && teamA.SoBanThang === teamB.SoBanThang) {
                sortPromises.push(
                    compareTeams(teamA, teamB).then(comparison => {
                        if (comparison > 0) {
                            // Swap positions
                            [bangXepHang[i], bangXepHang[j]] = [bangXepHang[j], bangXepHang[i]];
                        }
                    })
                );
            }
        }
    }

    await Promise.all(sortPromises);
    return bangXepHang;
}

module.exports = { sortByDoiDau };