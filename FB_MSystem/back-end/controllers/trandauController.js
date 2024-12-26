const { TranDau } = require('../models');
const { BangXepHang, MgDbCt } = require('../models');
const TranDauController = {
    async getAll(req, res) {
        try {
            const tranDaus = await TranDau.findAll();
            res.status(200).json(tranDaus);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách trận đấu.' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const tranDau = await TranDau.findByPk(id);
            if (!tranDau) return res.status(404).json({ error: 'Không tìm thấy trận đấu.' });
            res.status(200).json(tranDau);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thông tin trận đấu.' });
        }
    },

    async create(req, res) {
        try {
            const { MaTranDau, MaVongDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang } = req.body;
            const tranDau = await TranDau.create({
                MaTranDau, MaVongDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang,
            });
            res.status(201).json(tranDau);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi thêm trận đấu mới.' });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const now = new Date();
            const tranDau = await TranDau.findByPk(id);
            if (!tranDau) {
                return res.status(404).json({ error: 'Không tìm thấy trận đấu.' });
            }

            const playing = updates.TinhTrang || tranDau.TinhTrang;
            if (playing === true) {
                tranDau.BanThangDoiNha = 0;
                tranDau.BanThangDoiKhach = 0;
                await tranDau.save(); // Lưu thay đổi vào cơ sở dữ liệu
            }
            
    
            // Nếu trận đấu đã kết thúc và thời gian trận đấu nhỏ hơn thời gian hiện tại
            if (!playing && new Date(tranDau.GioThiDau) < now) {
                const doiNha = await MgDbCt.findOne({ where: { MaDoiBong: tranDau.MaDoiBongNha, MaMuaGiai: tranDau.MaMuaGiai } });
                const doiKhach = await MgDbCt.findOne({ where: { MaDoiBong: tranDau.MaDoiBongKhach, MaMuaGiai: tranDau.MaMuaGiai } });
    
                // Nếu không tìm thấy đội trong bảng xếp hạng, trả về lỗi
                if (!doiNha || !doiKhach) {
                    return res.status(404).json({ error: 'Không tìm thấy đội bóng trong bảng xếp hạng.' });
                }
    
                // Cập nhật kết quả trận đấu
                if (tranDau.BanThangDoiKhach > tranDau.BanThangDoiNha) {
                    // Đội khách thắng
                    doiKhach.SoTranThang += 1;
                    doiKhach.DiemSo += 3;
    
                    doiNha.SoTranThua += 1;
                } else if (tranDau.BanThangDoiKhach < tranDau.BanThangDoiNha) {
                    // Đội nhà thắng
                    doiNha.SoTranThang += 1;
                    doiNha.DiemSo += 3;
    
                    doiKhach.SoTranThua += 1;
                } else {
                    // Hai đội hòa
                    doiNha.SoTranHoa += 1;
                    doiKhach.SoTranHoa += 1;
    
                    doiNha.DiemSo += 1;
                    doiKhach.DiemSo += 1;
                }
    
                // Cập nhật số trận
                doiNha.SoTran += 1;
                doiKhach.SoTran += 1;
    
                // Cập nhật số bàn thắng và số bàn thua
                doiNha.SoBanThang += tranDau.BanThangDoiNha;
                doiNha.SoBanThua += tranDau.BanThangDoiKhach;
    
                doiKhach.SoBanThang += tranDau.BanThangDoiKhach;
                doiKhach.SoBanThua += tranDau.BanThangDoiNha;
    
                // Cập nhật hiệu số bàn thắng
                doiNha.HieuSo = doiNha.SoBanThang - doiNha.SoBanThua;
                doiKhach.HieuSo = doiKhach.SoBanThang - doiKhach.SoBanThua;
    
                // Lưu lại thay đổi vào cơ sở dữ liệu
                await doiNha.save();
                await doiKhach.save();
            }
    
            // Cập nhật các thông tin khác của trận đấu (nếu có)
            await tranDau.update(updates);
    
            res.status(200).json(tranDau);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const tranDau = await TranDau.findByPk(id);
            if (!tranDau) return res.status(404).json({ error: 'Không tìm thấy trận đấu.' });
            await tranDau.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa trận đấu.' });
        }
    },
};

module.exports = TranDauController;
