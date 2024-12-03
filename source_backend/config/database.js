const { Sequelize } = require('sequelize');
const dbConfig = require('./databaseConfig');

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    logging: false, 
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối cơ sở dữ liệu thành công!');
    } catch (error) {
        console.error('Không thể kết nối với cơ sở dữ liệu:', error);
        process.exit(1); 
    }
})();

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
