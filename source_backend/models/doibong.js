const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Doibong = sequelize.define('Doibong', {
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    TenDoiBong: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    CoQuanChuQuan: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    ThanhPhoTrucThuoc: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    MaSan: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
    HLV: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    ThongTin: {
        type: DataTypes.STRING(1000),
        allowNull: false,
    },
    Logo: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    tableName: 'DOIBONG',
    timestamps: false,
});

module.exports = Doibong;