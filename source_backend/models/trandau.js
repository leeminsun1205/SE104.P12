const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TranDau = sequelize.define('TranDau', {
    MaTranDau: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    MaVongDau: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'VongDau', 
            key: 'MaVongDau',
        },
    },
    MaDoiBongNha: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'DoiBong', 
            key: 'MaDoiBong',
        },
    },
    MaDoiBongKhach: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'DoiBong', 
            key: 'MaDoiBong',
        },
    },
    NgayThiDau: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    GioThiDau: {
        type: DataTypes.TIME,
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
    BanThangDoiNha: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    BanThangDoiKhach: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
}, {
    tableName: 'TranDau',
    timestamps: false,
});

module.exports = TranDau;
