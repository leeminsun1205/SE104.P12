const { BangXepHang, ThamSo, TranDau, VongDau } = require('../models');
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
    
            // Truy vấn TranDau kèm theo VongDau để lấy MaMuaGiai
            const tranDau = await TranDau.findByPk(id, {
                include: {
                    model: VongDau,
                    as: 'VongDau', // Alias được định nghĩa trong quan hệ
                    attributes: ['MaMuaGiai'], // Chỉ lấy cột MaMuaGiai từ VongDau
                },
            });
    
            if (!tranDau) {
                return res.status(404).json({ error: 'Không tìm thấy trận đấu.' });
            }
    
            console.log('TinhTrang hiện tại:', tranDau.TinhTrang);
            console.log('TinhTrang muốn cập nhật:', updates.TinhTrang);
    
            if (tranDau.TinhTrang === false && updates.TinhTrang === true) {
                tranDau.BanThangDoiNha = 0;
                tranDau.BanThangDoiKhach = 0;
                tranDau.TinhTrang = true;
                await tranDau.save();
                console.log('Trận đấu đã bắt đầu!');
            }
    
            console.log('tranDau.TinhTrang từ DB:', tranDau.TinhTrang);
    
            if (updates.TinhTrang === false && tranDau.TinhTrang === true) {
                // Lấy MaMuaGiai từ VongDau
                const maMuaGiai = tranDau.VongDau.MaMuaGiai;
    
                // Lấy điểm số từ bảng ThamSo
                const thamSo = await ThamSo.findOne(); // Giả sử bảng ThamSo chỉ có một bản ghi
                if (!thamSo) {
                    return res.status(500).json({ error: 'Không tìm thấy thông tin điểm số trong bảng ThamSo.' });
                }
    
                console.log('Điểm số từ ThamSo:', {
                    DiemThang: thamSo.DiemThang,
                    DiemHoa: thamSo.DiemHoa,
                    DiemThua: thamSo.DiemThua,
                });
    
                // Truy vấn đồng thời các đội bóng trong BangXepHang
                const [doiNha, doiKhach] = await Promise.all([
                    BangXepHang.findOne({
                        where: { MaDoiBong: tranDau.MaDoiBongNha, MaMuaGiai: maMuaGiai },
                    }),
                    BangXepHang.findOne({
                        where: { MaDoiBong: tranDau.MaDoiBongKhach, MaMuaGiai: maMuaGiai },
                    }),
                ]);
    
                if (!doiNha || !doiKhach) {
                    return res.status(404).json({ error: 'Không tìm thấy đội bóng trong bảng xếp hạng.' });
                }
    
                // Logic cập nhật bảng xếp hạng
                if (tranDau.BanThangDoiKhach > tranDau.BanThangDoiNha) {
                    doiKhach.SoTranThang += 1;
                    doiKhach.DiemSo += thamSo.DiemThang;
                    doiNha.SoTranThua += 1;
                    doiNha.DiemSo += thamSo.DiemThua;
                } else if (tranDau.BanThangDoiKhach < tranDau.BanThangDoiNha) {
                    doiNha.SoTranThang += 1;
                    doiNha.DiemSo += thamSo.DiemThang;
                    doiKhach.SoTranThua += 1;
                    doiKhach.DiemSo += thamSo.DiemThua;
                } else {
                    doiNha.SoTranHoa += 1;
                    doiKhach.SoTranHoa += 1;
                    doiNha.DiemSo += thamSo.DiemHoa;
                    doiKhach.DiemSo += thamSo.DiemHoa;
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
                await tranDau.save();
                console.log('Cập nhật TinhTrang về false thành công!');
            }
    
            res.status(200).json(tranDau);
        } catch (error) {
            console.error('Lỗi khi cập nhật trận đấu:', error);
            res.status(500).json({ error: error.message });
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
