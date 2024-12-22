require('dotenv').config(); // Load biến môi trường 
const { Sequelize } = require('sequelize');

// Cấu hình và khởi tạo kết nối cơ sở dữ liệu
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
        max: 5,          // Số kết nối tối đa
        min: 0,          // Số kết nối tối thiểu
        acquire: 30000,  // Thời gian tối đa cố gắng để kết nối (ms)
        idle: 10000,     // Thời gian tối đa một kết nối rảnh trước khi bị đóng (ms)
    },
    logging: false, 
});

// Tự động kiểm tra kết nối khi khởi động
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối cơ sở dữ liệu thành công!');
    } catch (error) {
        console.error('Không thể kết nối với cơ sở dữ liệu:', error);
        process.exit(1); // Thoát nếu không thể kết nối
    }
})();

// Lắng nghe tín hiệu thoát (SIGINT) để đóng kết nối an toàn
process.on('SIGINT', async () => {
    try {
        await sequelize.close();
        console.log('Đã đóng kết nối cơ sở dữ liệu.');
        process.exit(0);
    } catch (err) {
        console.error('Lỗi khi đóng kết nối cơ sở dữ liệu:', err);
        process.exit(1);
    }
});

module.exports = sequelize;
