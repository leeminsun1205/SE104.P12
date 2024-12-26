const { TranDau } = require('../models');
const { BangXepHang, MgDbCt, ThamSo } = require('../models');
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
            const tranDau = await TranDau.findByPk(id);
            if (!tranDau) {
                return res.status(404).json({ error: 'Không tìm thấy trận đấu.' });
            }
    
            console.log('TinhTrang hiện tại:', tranDau.TinhTrang);
            console.log('TinhTrang muốn cập nhật:', updates.TinhTrang);
    
            if (tranDau.TinhTrang === false && updates.TinhTrang === true) {
                tranDau.BanThangDoiNha = 0;
                tranDau.BanThangDoiKhach = 0;
                tranDau.TinhTrang = true;
                await tranDau.save(); // Lưu thay đổi vào cơ sở dữ liệu
                console.log('Trận đấu đã bắt đầu!');
            }
            
            if (updates.TinhTrang === false && tranDau.TinhTrang === true) {
                const doiNha = await BangXepHang.findOne({ where: { MaDoiBong: tranDau.MaDoiBongNha, MaMuaGiai: tranDau.MaMuaGiai } });
                const doiKhach = await BangXepHang.findOne({ where: { MaDoiBong: tranDau.MaDoiBongKhach, MaMuaGiai: tranDau.MaMuaGiai } });
    
                if (!doiNha || !doiKhach) {
                    return res.status(404).json({ error: 'Không tìm thấy đội bóng trong bảng xếp hạng.' });
                }
    
                if (tranDau.BanThangDoiKhach > tranDau.BanThangDoiNha) {
                    doiKhach.SoTranThang += 1;
                    doiKhach.DiemSo += ThamSo.DiemThang;
                    doiNha.SoTranThua += 1;
                    doiNha.DiemSo += ThamSo.DiemThua;
                } else if (tranDau.BanThangDoiKhach < tranDau.BanThangDoiNha) {
                    doiNha.SoTranThang += 1;
                    doiNha.DiemSo += ThamSo.DiemThang;
                    doiKhach.SoTranThua += 1;
                    doiKhach.DiemSo += ThamSo.DiemThua;
                } else {
                    doiNha.SoTranHoa += 1;
                    doiKhach.SoTranHoa += 1;
                    doiNha.DiemSo += ThamSo.DiemHoa;
                    doiKhach.DiemSo += ThamSo.DiemHoa;
                }
    
                doiNha.SoTran += 1;
                doiKhach.SoTran += 1;
    
                doiNha.SoBanThang += tranDau.BanThangDoiNha;
                doiNha.SoBanThua += tranDau.BanThangDoiKhach;
                doiKhach.SoBanThang += tranDau.BanThangDoiKhach;
                doiKhach.SoBanThua += tranDau.BanThangDoiNha;
    
                doiNha.HieuSo = doiNha.SoBanThang - doiNha.SoBanThua;
                doiKhach.HieuSo = doiKhach.SoBanThang - doiKhach.SoBanThua;
    
                await doiNha.save();
                await doiKhach.save();
    
                console.log('Kết thúc trận đấu, cập nhật bảng xếp hạng thành công!');
    
                tranDau.TinhTrang = false;
                await tranDau.save(); // Kết thúc trận đấu
                console.log('Cập nhật TinhTrang về false thành công!');
            }
    
            res.status(200).json(tranDau);
        } catch (error) {
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
