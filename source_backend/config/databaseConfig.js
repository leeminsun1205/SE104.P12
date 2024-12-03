require('dotenv').config();

module.exports = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
        max: 5,          // Số kết nối tối đa
        min: 0,          // Số kết nối tối thiểu
        acquire: 30000,  // Thời gian tối đa (ms) để lấy kết nối
        idle: 10000,     // Thời gian chờ tối đa khi không sử dụng
    },
};
