<<<<<<< Updated upstream
const { BangXepHang, DoiBong, MgDbCt } = require('../models');
=======
const { BangXepHang, DoiBong, VongDau, MgDbCt } = require('../models');
>>>>>>> Stashed changes

const BangXepHangController = {
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const bangXepHang = await BangXepHang.findAll({
                where: { MaMuaGiai },
                include: [
                    {
<<<<<<< Updated upstream
                        model: DoiBong, 
                        as: 'DoiBong',  // Đảm bảo alias khớp với alias trong định nghĩa BangXepHang
                        attributes: ['TenDoiBong'],  // Chỉ lấy thuộc tính TenDoiBong của DoiBong
                    },
                    {
                        model: MgDbCt, 
                        as: 'MgDbCt',  // Alias MgDbCt trong BangXepHang
                        attributes: []  // Không lấy thêm thuộc tính nào từ MgDbCt
=======
                        model: MgDbCt, // Model has to be defined correctly
                        as: 'MgDbCt',   // Ensure alias is correct
                        include: [
                            { model: DoiBong, as: 'DoiNha', attributes: ['TenDoiBong'] },
                            { model: DoiBong, as: 'DoiKhach', attributes: ['TenDoiBong'] }
                        ]
>>>>>>> Stashed changes
                    }
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

<<<<<<< Updated upstream
    // async getByVongDau(req, res) {
    //     try {
    //         const { MaVongDau } = req.params;
    //         const bangXepHang = await BangXepHang.findAll({
    //             where: { MaVongDau },
    //             include: [
    //                 { model: DoiBong, as: 'DoiBong' },
    //                 {
    //                     model: MgDbCt,  // Model has to be defined correctly
    //                     as: 'MgDbCt',   // Ensure alias is correct
    //                     include: [
    //                         { model: DoiBong, as: 'DoiNha', attributes: ['TenDoiBong'] },
    //                         { model: DoiBong, as: 'DoiKhach', attributes: ['TenDoiBong'] }
    //                     ]
    //                 }
    //             ],
    //             order: [['DiemSo', 'DESC']]
    //         });
=======
    async getByVongDau(req, res) {
        try {
            const { MaVongDau } = req.params;
            const bangXepHang = await BangXepHang.findAll({
                where: { MaVongDau },
                include: [
                    { model: DoiBong, as: 'DoiBong' },
                    {
                        model: MgDbCt,  // Model has to be defined correctly
                        as: 'MgDbCt',   // Ensure alias is correct
                        include: [
                            { model: DoiBong, as: 'DoiNha', attributes: ['TenDoiBong'] },
                            { model: DoiBong, as: 'DoiKhach', attributes: ['TenDoiBong'] }
                        ]
                    }
                ],
                order: [['DiemSo', 'DESC']]
            });
>>>>>>> Stashed changes

    //         if (bangXepHang.length === 0) {
    //             return res.status(404).json({ message: 'Không tìm thấy bảng xếp hạng cho vòng đấu này.' });
    //         }

    //         res.status(200).json(bangXepHang);
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // },
};

module.exports = BangXepHangController;
