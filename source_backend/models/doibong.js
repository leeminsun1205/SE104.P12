const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DoiBong = sequelize.define('DoiBong', {
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
        references: {
            model: 'SanThiDau',
            key: 'MaSan',
        },
    },
    HLV: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    ThongTin: {
        type: DataTypes.STRING(1000),
        allowNull: true,
    },
    Logo: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
}, {
    tableName: 'DOIBONG',
    timestamps: false,
});

module.exports = DoiBong;