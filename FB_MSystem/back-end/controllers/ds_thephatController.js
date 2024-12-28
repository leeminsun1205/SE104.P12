const { DsThePhat, CauThu, VongDau, ThePhat, TranDau, LoaiThePhat, sequelize } = require('../models');

const DsThePhatController = {
    async getByVongDau(req, res) {
        try {
            const { MaVongDau } = req.params;
            const dsThePhat = await DsThePhat.findAll({
                where: { MaVongDau },
                include: [
                    { model: CauThu, as: 'CauThu' },
                    { model: VongDau, as: 'VongDau' },
                ],
            });
            res.status(200).json(dsThePhat);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách thẻ phạt theo vòng đấu.', error);
            res.status(500).json({ error: 'Lỗi khi lấy danh sách thẻ phạt theo vòng đấu.' });
        }
    },

    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;

            // Lấy tất cả các vòng đấu theo MaMuaGiai
            const vongDauData = await VongDau.findAll({
                where: { MaMuaGiai },
                attributes: ['MaVongDau'],
                raw: true,
            });

            if (!vongDauData || vongDauData.length === 0) {
                console.warn(`Không tìm thấy vòng đấu nào cho mùa giải ${MaMuaGiai}`);
                return res.status(404).json({ error: `Không tìm thấy vòng đấu cho mùa giải ${MaMuaGiai}.` });
            }

            // Trích xuất danh sách MaVongDau
            const maVongDauList = vongDauData.map(v => v.MaVongDau);

            // Lấy tất cả thẻ phạt liên quan đến danh sách MaVongDau
            const dsThePhat = await DsThePhat.findAll({
                where: { MaVongDau: maVongDauList },
                include: [
                    { model: CauThu, as: 'CauThu' },
                    { model: VongDau, as: 'VongDau' },
                ],
            });

            if (!dsThePhat || dsThePhat.length === 0) {
                console.warn(`Không tìm thấy thẻ phạt nào cho mùa giải ${MaMuaGiai}`);
                return res.status(404).json({ error: `Không tìm thấy thẻ phạt cho mùa giải ${MaMuaGiai}.` });
            }

            res.status(200).json(dsThePhat);
        } catch (error) {
            console.error(`Lỗi khi lấy danh sách thẻ phạt theo mùa giải: ${error.message}`, error);
            res.status(500).json({ error: 'Lỗi khi lấy danh sách thẻ phạt theo mùa giải.' });
        }
    },

    async update(req, res) {
        try {

            // Lấy danh sách các loại thẻ phạt
            const loaiThePhat = await LoaiThePhat.findAll({
                attributes: ['MaLoaiThePhat', 'TenLoaiThePhat'],
                raw: true,
            });

            if (!loaiThePhat || loaiThePhat.length === 0) {
                console.error('Không tìm thấy loại thẻ phạt trong bảng LoaiThePhat.');
                return res.status(500).json({ error: 'Không tìm thấy loại thẻ phạt.' });
            }

            const loaiTheMap = {};
            loaiThePhat.forEach(loai => {
                if (loai.TenLoaiThePhat === 'Thẻ vàng') {
                    loaiTheMap.vang = loai.MaLoaiThePhat;
                }
                if (loai.TenLoaiThePhat === 'Thẻ đỏ') {
                    loaiTheMap.do = loai.MaLoaiThePhat;
                }
            });

            if (!loaiTheMap.vang || !loaiTheMap.do) {
                console.error('Không xác định được mã thẻ vàng hoặc thẻ đỏ.');
                return res.status(500).json({ error: 'Không xác định được mã thẻ vàng hoặc thẻ đỏ.' });
            }


            // Lấy danh sách thẻ phạt
            const thePhatData = await ThePhat.findAll({
                attributes: ['MaCauThu', 'MaTranDau'],
                raw: true,
            });

            if (!thePhatData || thePhatData.length === 0) {
                console.error('Không tìm thấy dữ liệu thẻ phạt.');
                return res.status(500).json({ error: 'Không tìm thấy dữ liệu thẻ phạt.' });
            }


            // Lấy MaVongDau từ bảng TranDau dựa trên MaTranDau
            const tranDauData = await TranDau.findAll({
                attributes: ['MaTranDau', 'MaVongDau'],
                raw: true,
            });

            if (!tranDauData || tranDauData.length === 0) {
                console.error('Không tìm thấy dữ liệu trong bảng TranDau.');
                return res.status(500).json({ error: 'Không tìm thấy dữ liệu trong bảng TranDau.' });
            }

            const tranDauMap = {};
            tranDauData.forEach(tran => {
                tranDauMap[tran.MaTranDau] = tran.MaVongDau;
            });


            // Sử dụng forEach với async/await
            await Promise.all(
                thePhatData.map(async (thePhat) => {
                    const { MaCauThu, MaTranDau } = thePhat;
                    const MaVongDau = tranDauMap[MaTranDau];

                    if (!MaVongDau) {
                        console.warn(`Không tìm thấy MaVongDau cho MaTranDau: ${MaTranDau}`);
                        return; // Bỏ qua bản ghi không hợp lệ
                    }


                    // Đếm số thẻ vàng và thẻ đỏ của cầu thủ trong vòng đấu
                    try {
                        const soThe = await ThePhat.findAll({
                            attributes: [
                                [sequelize.fn('COUNT', sequelize.col('MaLoaiThePhat')), 'TongSoThe'],
                                'MaLoaiThePhat',
                            ],
                            where: {
                                MaCauThu,
                                MaTranDau,
                                MaLoaiThePhat: [loaiTheMap.vang, loaiTheMap.do],
                            },
                            group: ['MaLoaiThePhat'],
                            raw: true,
                        });


                        let SoTheVang = 0;
                        let SoTheDo = 0;

                        soThe.forEach(record => {
                            if (record.MaLoaiThePhat === loaiTheMap.vang) {
                                SoTheVang = parseInt(record.TongSoThe, 10) || 0;
                            }
                            if (record.MaLoaiThePhat === loaiTheMap.do) {
                                SoTheDo = parseInt(record.TongSoThe, 10) || 0;
                            }
                        });


                        // Cập nhật tình trạng thi đấu
                        const TinhTrangThiDau = SoTheVang >= 2 || SoTheDo >= 1 ? 0 : 1;


                        // Kiểm tra và cập nhật DsThePhat
                        try {
                            const [dsThePhat, created] = await DsThePhat.findOrCreate({
                                where: { MaCauThu, MaVongDau },
                                defaults: { SoTheVang, SoTheDo, TinhTrangThiDau },
                            });

                            if (!created) {
                                await dsThePhat.update({ SoTheVang, SoTheDo, TinhTrangThiDau });
                            }

                        } catch (updateError) {
                            console.error(`Lỗi khi cập nhật DsThePhat cho MaCauThu=${MaCauThu}, MaVongDau=${MaVongDau}:`, updateError);
                        }
                    } catch (queryError) {
                        console.error(`Lỗi khi truy vấn số thẻ cho MaCauThu=${MaCauThu}, MaTranDau=${MaTranDau}:`, queryError);
                    }
                })
            );

            res.status(200).json({ message: 'Cập nhật danh sách thẻ phạt thành công!' });
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật thông tin danh sách thẻ phạt.' });
        }
    },
};

module.exports = DsThePhatController;
