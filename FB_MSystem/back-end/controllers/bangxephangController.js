const { BangXepHang, DoiBong, MgDbCt } = require('../models');

const BangXepHangController = {
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const bangXepHang = await BangXepHang.findAll({
                where: { MaMuaGiai },
                include: [
                    {
                        model: DoiBong, 
                        as: 'DoiBong',  // Đảm bảo alias khớp với alias trong định nghĩa BangXepHang
                        attributes: ['TenDoiBong'],  // Chỉ lấy thuộc tính TenDoiBong của DoiBong
                    },
                ],
                attributes: ['SoTran', 'SoTranThang', 'SoTranHoa', 'SoTranThua', 'SoBanThang', 'SoBanThua', 'DiemSo', 'HieuSo'],  // Lấy các thuộc tính từ BangXepHang
                order: [['DiemSo', 'DESC']]  // Sắp xếp theo điểm số giảm dần
            });
    
            // Kiểm tra nếu không tìm thấy bảng xếp hạng
            if (bangXepHang.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy bảng xếp hạng cho mùa giải này.' });
            }
    
            // Trả về kết quả bảng xếp hạng
            res.status(200).json(bangXepHang);
        } catch (error) {
            console.error('Lỗi khi truy vấn bảng xếp hạng:', error);
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = BangXepHangController;
