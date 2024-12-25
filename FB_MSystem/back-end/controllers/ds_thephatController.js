const { DsThePhat, CauThu, VongDau, ThePhat, TranDau, LoaiThePhat, sequelize  } = require('../models');

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
            const dsThePhat = await DsThePhat.findAll({
                where: { MaMuaGiai },
                include: [
                    { model: CauThu, as: 'CauThu' },
                ],
            });
            res.status(200).json(dsThePhat);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách thẻ phạt theo mùa giải.' });
        }
    },

    async update(req, res) {
        try {
            console.log('=== Bắt đầu cập nhật danh sách thẻ phạt ===');

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

            console.log('=== Loại thẻ phạt đã ánh xạ:', loaiTheMap);

            // Lấy danh sách thẻ phạt
            const thePhatData = await ThePhat.findAll({
                attributes: ['MaCauThu', 'MaTranDau'],
                raw: true,
            });

            if (!thePhatData || thePhatData.length === 0) {
                console.error('Không tìm thấy dữ liệu thẻ phạt.');
                return res.status(500).json({ error: 'Không tìm thấy dữ liệu thẻ phạt.' });
            }

            console.log(`=== Đã tìm thấy ${thePhatData.length} bản ghi trong bảng ThePhat.`);

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

            console.log(`=== Đã ánh xạ ${tranDauData.length} bản ghi từ bảng TranDau.`);

            // Sử dụng forEach với async/await
            await Promise.all(
                thePhatData.map(async (thePhat) => {
                    const { MaCauThu, MaTranDau } = thePhat;
                    const MaVongDau = tranDauMap[MaTranDau];
            
                    if (!MaVongDau) {
                        console.warn(`Không tìm thấy MaVongDau cho MaTranDau: ${MaTranDau}`);
                        return; // Bỏ qua bản ghi không hợp lệ
                    }
            
                    console.log(`=== Đang xử lý: MaCauThu=${MaCauThu}, MaTranDau=${MaTranDau}, MaVongDau=${MaVongDau}`);
            
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
            
                        console.log(`Truy vấn số thẻ cho MaCauThu=${MaCauThu}, MaTranDau=${MaTranDau}:`, soThe);
            
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
            
                        console.log(`Số thẻ tính toán cho MaCauThu=${MaCauThu}: SoTheVang=${SoTheVang}, SoTheDo=${SoTheDo}`);
            
                        // Cập nhật tình trạng thi đấu
                        const TinhTrangThiDau = SoTheVang >= 2 || SoTheDo >= 1 ? 0 : 1;
            
                        console.log(`TinhTrangThiDau cho MaCauThu=${MaCauThu}, MaVongDau=${MaVongDau}: ${TinhTrangThiDau}`);
            
                        // Kiểm tra và cập nhật DsThePhat
                        try {
                            const [dsThePhat, created] = await DsThePhat.findOrCreate({
                                where: { MaCauThu, MaVongDau },
                                defaults: { SoTheVang, SoTheDo, TinhTrangThiDau },
                            });
            
                            if (!created) {
                                await dsThePhat.update({ SoTheVang, SoTheDo, TinhTrangThiDau });
                            }
            
                            console.log(`Cập nhật thành công DsThePhat cho MaCauThu=${MaCauThu}, MaVongDau=${MaVongDau}`);
                        } catch (updateError) {
                            console.error(`Lỗi khi cập nhật DsThePhat cho MaCauThu=${MaCauThu}, MaVongDau=${MaVongDau}:`, updateError);
                        }
                    } catch (queryError) {
                        console.error(`Lỗi khi truy vấn số thẻ cho MaCauThu=${MaCauThu}, MaTranDau=${MaTranDau}:`, queryError);
                    }
                })
            );

            console.log('=== Cập nhật danh sách thẻ phạt hoàn tất ===');
            res.status(200).json({ message: 'Cập nhật danh sách thẻ phạt thành công!' });
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật thông tin danh sách thẻ phạt.' });
        }
    },
};

module.exports = DsThePhatController;
