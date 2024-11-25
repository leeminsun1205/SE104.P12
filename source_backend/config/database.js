const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('SE104', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;