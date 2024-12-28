const { DangNhap }= require('../models');

const DangNhapController = {
    async getAll(req, res) {
        try {
            const dangNhaps = await DangNhap.findAll();
            res.status(200).json(dangNhaps);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách đăng nhập.' });
        }
    },

    async getById(req, res) {
        try {
            const { MaNguoiDung } = req.params;
            const dangNhap = await DangNhap.findByPk(MaNguoiDung);
            if (!dangNhap) {
                return res.status(404).json({ error: 'Không tìm thấy thông tin đăng nhập.' });
            }
            res.status(200).json(dangNhap);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thông tin đăng nhập.' });
        }
    },

    async create(req, res) {
        try {
            const { MaNguoiDung, TenDangNhap, MatKhau } = req.body;

            if (!TenDangNhap || !MatKhau) {
                return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin đăng nhập.' });
            }

            const newDangNhap = await DangNhap.create({
                MaNguoiDung,
                TenDangNhap,
                MatKhau,
            });
            res.status(201).json(newDangNhap);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi khi tạo thông tin đăng nhập.' });
        }
    },

    async login(req, res) {
        try {
            const { TenDangNhap, MatKhau } = req.body;

            if (!TenDangNhap || !MatKhau) {
                return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ tên đăng nhập và mật khẩu.' });
            }

            const user = await DangNhap.findOne({
                where: { TenDangNhap, MatKhau },
            });

            if (user) {
                // Đăng nhập thành công
                res.status(200).json({ message: 'Đăng nhập thành công!' });
            } else {
                // Đăng nhập thất bại
                res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
            }
        } catch (error) {
            console.error('Lỗi khi đăng nhập:', error);
            res.status(500).json({ error: 'Lỗi khi xử lý đăng nhập.' });
        }
    },
    async register(req, res) {
        try {
            const { TenDangNhap, MatKhau } = req.body;

            if (!TenDangNhap || !MatKhau) {
                return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ email và mật khẩu.' });
            }

            // Kiểm tra xem TenDangNhap (email) đã tồn tại chưa
            const existingUser = await DangNhap.findOne({ where: { TenDangNhap } });
            if (existingUser) {
                return res.status(409).json({ error: 'Email này đã được đăng ký.' });
            }

            // Tạo người dùng mới
            const newUser = await DangNhap.create({
                TenDangNhap,
                MatKhau, // Lưu ý: Nên mã hóa mật khẩu trước khi lưu
            });

            res.status(201).json({ message: 'Đăng ký thành công!' });
        } catch (error) {
            console.error('Lỗi khi đăng ký:', error);
            res.status(500).json({ error: 'Lỗi khi xử lý đăng ký.' });
        }
    },
};

module.exports = DangNhapController;