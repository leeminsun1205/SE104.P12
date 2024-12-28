const { BangXepHang, ThamSo, TranDau, DoiBong, SanThiDau, VongDau, BanThang, ThePhat, Sequelize } = require('../models');
const { Op } = Sequelize;

const TranDauController = {
    async getAll(req, res) {
        try {
            const tranDaus = await TranDau.findAll({
                include: [
                    {
                        model: VongDau,
                        as: 'VongDau',
                        attributes: ['MaMuaGiai', 'MaVongDau'],
                    },
                    {
                        model: DoiBong,
                        as: 'DoiBongNha',
                        attributes: ['MaDoiBong', 'TenDoiBong'],
                    },
                    {
                        model: DoiBong,
                        as: 'DoiBongKhach',
                        attributes: ['MaDoiBong', 'TenDoiBong'],
                    },
                    {
                        model: SanThiDau,
                        as: 'SanThiDau',
                        attributes: ['TenSan'],
                    },
                ],
                attributes: { exclude: ['MaVongDau', 'MaDoiBongNha', 'MaDoiBongKhach', 'MaSan'] }
            });

            const results = tranDaus.map((tranDau) => {
                const maVongDau = tranDau.VongDau ? tranDau.VongDau.MaVongDau : null;
                const tenVongDau = maVongDau ? maVongDau.split('VD').pop() : null;

                return {
                    ...tranDau.get(),
                    TenVongDau: tenVongDau,
                };
            });

            res.status(200).json({ tranDau: results });
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách trận đấu.', details: error.message });
        }
    },

    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const tranDaus = await TranDau.findAll({
                include: [
                    {
                        model: VongDau,
                        as: 'VongDau',
                        attributes: ['MaMuaGiai', 'MaVongDau'],
                        where: { MaMuaGiai: MaMuaGiai },
                    },
                    {
                        model: DoiBong,
                        as: 'DoiBongNha',
                        attributes: ['MaDoiBong', 'TenDoiBong'],
                    },
                    {
                        model: DoiBong,
                        as: 'DoiBongKhach',
                        attributes: ['MaDoiBong', 'TenDoiBong'],
                    },
                    {
                        model: SanThiDau,
                        as: 'SanThiDau',
                        attributes: ['TenSan'],
                    },
                ],
                attributes: { exclude: ['MaVongDau', 'MaDoiBongNha', 'MaDoiBongKhach', 'MaSan'] }
            });
            if (tranDaus.length === 0) {
                return res.status(404).json({ error: 'Không tìm thấy trận đấu nào cho mùa giải này.' });
            }
            const results = tranDaus.map((tranDau) => {
                const maVongDau = tranDau.VongDau ? tranDau.VongDau.MaVongDau : null;
                const tenVongDau = maVongDau ? maVongDau.split('VD').pop() : null;

                return {
                    ...tranDau.get(),
                    TenVongDau: tenVongDau,
                };
            });
            res.status(200).json({ tranDau: results });
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách trận đấu theo mùa giải.', details: error.message });
        }
    },

    async getById(req, res) {
        try {
            const { MaTranDau } = req.params;
            const tranDau = await TranDau.findByPk(MaTranDau, {
                include: [
                    {
                        model: VongDau,
                        as: 'VongDau',
                        attributes: ['MaMuaGiai', 'MaVongDau'],
                    },
                    {
                        model: DoiBong,
                        as: 'DoiBongNha',
                        attributes: ['MaDoiBong', 'TenDoiBong'],
                    },
                    {
                        model: DoiBong,
                        as: 'DoiBongKhach',
                        attributes: ['MaDoiBong', 'TenDoiBong'],
                    },
                    {
                        model: SanThiDau,
                        as: 'SanThiDau',
                        attributes: ['TenSan'],
                    },
                ],
                attributes: { exclude: ['MaVongDau', 'MaDoiBongNha', 'MaDoiBongKhach', 'MaSan'] }
            });

            if (!tranDau) {
                return res.status(404).json({ error: 'Không tìm thấy trận đấu.' });
            }

            const maVongDau = tranDau.VongDau ? tranDau.VongDau.MaVongDau : null;
            const tenVongDau = maVongDau ? maVongDau.split('VD').pop() : null;

            const result = {
                ...tranDau.get(),
                TenVongDau: tenVongDau,
            };

            res.status(200).json({ tranDau: result });
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thông tin trận đấu.', details: error.message });
        }
    },

    async getByDoiBong(req, res) {
        try {
            const { MaDoiBong } = req.params;
            const tranDaus = await TranDau.findAll({
                where: {
                    [Op.or]: [
                        { MaDoiBongNha: MaDoiBong },
                        { MaDoiBongKhach: MaDoiBong }
                    ]
                },
                include: [
                    {
                        model: VongDau,
                        as: 'VongDau',
                        attributes: ['MaMuaGiai', 'MaVongDau'],
                    },
                    {
                        model: DoiBong,
                        as: 'DoiBongNha',
                        attributes: ['MaDoiBong', 'TenDoiBong'],
                    },
                    {
                        model: DoiBong,
                        as: 'DoiBongKhach',
                        attributes: ['MaDoiBong', 'TenDoiBong'],
                    },
                    {
                        model: SanThiDau,
                        as: 'SanThiDau',
                        attributes: ['TenSan'],
                    },
                ],
                attributes: { exclude: ['MaVongDau', 'MaDoiBongNha', 'MaDoiBongKhach', 'MaSan'] }
            });

            if (tranDaus.length === 0) {
                return res.status(404).json({ error: 'Không tìm thấy trận đấu nào cho đội bóng này.' });
            }

            const results = tranDaus.map((tranDau) => {
                const maVongDau = tranDau.VongDau ? tranDau.VongDau.MaVongDau : null;
                const tenVongDau = maVongDau ? maVongDau.split('VD').pop() : null;

                return {
                    ...tranDau.get(),
                    TenVongDau: tenVongDau,
                };
            });

            res.status(200).json({ tranDau: results });
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách trận đấu theo đội bóng.', details: error.message });
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
            const tranDau = await TranDau.findByPk(id, {
                include: {
                    model: VongDau,
                    as: 'VongDau',
                    attributes: ['MaMuaGiai'],
                },
            });

            if (!tranDau) {
                return res.status(404).json({ error: 'Không tìm thấy trận đấu.' });
            }


            if (tranDau.TinhTrang === false && updates.TinhTrang === true) {
                tranDau.BanThangDoiNha = 0;
                tranDau.BanThangDoiKhach = 0;
                tranDau.TinhTrang = true;
                await tranDau.save();
            }


            if (updates.TinhTrang === false && tranDau.TinhTrang === true) {
                const maMuaGiai = tranDau.VongDau.MaMuaGiai;

                const thamSo = await ThamSo.findOne();
                if (!thamSo) {
                    return res.status(500).json({ error: 'Không tìm thấy thông tin điểm số trong bảng ThamSo.' });
                }

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


                tranDau.TinhTrang = false;
                await tranDau.save();
            }
            await tranDau.update(updates);

            // Retrieve the updated tranDau with associations for formatting
            const updatedTranDau = await TranDau.findByPk(id, {
                include: [
                    {
                        model: VongDau,
                        as: 'VongDau',
                        attributes: ['MaMuaGiai', 'MaVongDau'],
                    },
                    {
                        model: DoiBong,
                        as: 'DoiBongNha',
                        attributes: ['MaDoiBong', 'TenDoiBong'],
                    },
                    {
                        model: DoiBong,
                        as: 'DoiBongKhach',
                        attributes: ['MaDoiBong', 'TenDoiBong'],
                    },
                    {
                        model: SanThiDau,
                        as: 'SanThiDau',
                        attributes: ['TenSan'],
                    },
                ],
                attributes: { exclude: ['MaVongDau', 'MaDoiBongNha', 'MaDoiBongKhach', 'MaSan'] }
            });

            const maVongDau = updatedTranDau.VongDau ? updatedTranDau.VongDau.MaVongDau : null;
            const tenVongDau = maVongDau ? maVongDau.split('VD').pop() : null;

            const result = {
                ...updatedTranDau.get(),
                TenVongDau: tenVongDau,
            };
            res.status(200).json({ tranDau: result });
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

            const banThangCount = await BanThang.count({ where: { MaTranDau: id } });
            if (banThangCount > 0) {
                return res.status(400).json({ error: 'Không thể xóa trận đấu vì có bàn thắng liên quan.' });
            }

            const thePhatCount = await ThePhat.count({ where: { MaTranDau: id } });
            if (thePhatCount > 0) {
                return res.status(400).json({ error: 'Không thể xóa trận đấu vì có thẻ phạt liên quan.' });
            }

            await tranDau.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa trận đấu.' });
        }
    },
};

module.exports = TranDauController;