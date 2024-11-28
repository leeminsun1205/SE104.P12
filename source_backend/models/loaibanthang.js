const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Loaibanthang = sequelize.define('Loaibanthang', {
    MaLoaiBanThang: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    TenLoaiBanThang: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    MoTa: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
}, {
    tableName: 'LOAIBANTHANG',
    timestamps: false,
});

module.exports = Loaibanthang;
