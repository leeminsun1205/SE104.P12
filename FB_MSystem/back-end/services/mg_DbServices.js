const { DoiBong, SanThiDau, BangXepHang, ThamSo, CauThu, DbCt} = require('../models');
// Hàm xử lý cập nhật bảng xếp hạng
async function updateRanking(MaMuaGiai, MaDoiBong) {
    try {
        // Kiểm tra xem đội bóng đã có trong bảng xếp hạng chưa
        const existingRank = await BangXepHang.findOne({
            where: { MaMuaGiai, MaDoiBong },
        });

        // Nếu chưa có, tạo mới
        if (!existingRank) {
            return await BangXepHang.create({
                MaMuaGiai,
                MaDoiBong,
                SoTran: 0,
                SoTranThang: 0,
                SoTranHoa: 0,
                SoTranThua: 0,
                SoBanThang: 0,
                SoBanThua: 0,
                DiemSo: 0,
                HieuSo: 0,
            });
        }
        return existingRank; // Nếu đã tồn tại, trả về thông tin hiện tại
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật bảng xếp hạng: ${error.message}`);
    }
};

async function validateStadiumConditions(MaDoiBong) {
    const thamSo = await ThamSo.findOne();
    if (!thamSo) {
        throw new Error('Không thể lấy giá trị tham số từ hệ thống.');
    }

    const doiBong = await DoiBong.findByPk(MaDoiBong, {
        include: {
            model: SanThiDau,
            as: 'SanThiDau', // Liên kết với bảng sân
            attributes: ['SucChua', 'TieuChuan', 'TenSan'],
        },
    });

    if (!doiBong) {
        throw new Error(`Đội bóng với mã ${MaDoiBong} không tồn tại.`);
    }

    const san = doiBong.SanThiDau;
    if (!san) {
        throw new Error(`Đội bóng ${doiBong.TenDoiBong} không có sân nhà.`);
    }

    if (san.SucChua < thamSo.SucChuaToiThieu) {
        throw new Error(`Sân ${san.TenSan} không đạt sức chứa tối thiểu (${thamSo.SucChuaToiThieu}).`);
    }

    if (san.TieuChuan < thamSo.TieuChuanToiThieu) {
        throw new Error(`Sân ${san.TenSan} không đạt tiêu chuẩn tối thiểu (${thamSo.TieuChuanToiThieu}).`);
    }

    return true;
};

async function validatePlayerConditions(MaMuaGiai, MaDoiBong) {
    const thamSo = await ThamSo.findOne();
    if (!thamSo) {
        throw new Error('Không thể lấy giá trị tham số từ hệ thống.');
    }

    const { TuoiToiThieu, TuoiToiDa, SoLuongCauThuToiThieu, SoLuongCauThuToiDa, SoCauThuNgoaiToiDa } = thamSo;

    // Lấy danh sách cầu thủ trong đội bóng của mùa giải
    const cauThus = await DbCt.findAll({
        where: { MaDoiBong },
        include: {
            model: CauThu,
            as: 'CauThu',
            attributes: ['NgaySinh', 'LoaiCauThu'], // Chỉ lấy thông tin cần thiết
        },
    });

    const totalPlayers = cauThus.length;
    const foreignPlayers = cauThus.filter(ct => !ct.CauThu.LoaiCauThu).length;

    if (totalPlayers < SoLuongCauThuToiThieu) {
        throw new Error(
            `Đội bóng ${MaDoiBong} không đạt số lượng cầu thủ tối thiểu (${SoLuongCauThuToiThieu} cầu thủ).`
        );
    }

    if (totalPlayers > SoLuongCauThuToiDa) {
        throw new Error(
            `Đội bóng ${MaDoiBong} vượt quá số lượng cầu thủ tối đa (${SoLuongCauThuToiDa} cầu thủ).`
        );
    }

    if (foreignPlayers > SoCauThuNgoaiToiDa) {
        throw new Error(
            `Đội bóng ${MaDoiBong} vượt quá số lượng cầu thủ ngoại tối đa (${SoCauThuNgoaiToiDa} cầu thủ).`
        );
    }

    // Kiểm tra độ tuổi của từng cầu thủ
    const currentYear = new Date().getFullYear();
    for (const ct of cauThus) {
        const birthYear = new Date(ct.CauThu.NgaySinh).getFullYear();
        const age = currentYear - birthYear;

        if (age < TuoiToiThieu || age > TuoiToiDa) {
            throw new Error(
                `Cầu thủ ${ct.CauThu.TenCauThu} của đội ${MaDoiBong} không đáp ứng độ tuổi (${TuoiToiThieu}-${TuoiToiDa} tuổi).`
            );
        }
    }

    return true;
};

module.exports = { updateRanking, validateStadiumConditions, validatePlayerConditions};