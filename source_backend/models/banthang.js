const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BanThang = sequelize.define('BanThang', {
    MaBanThang: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    MaTranDau: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'TranDau', 
            key: 'MaTranDau',
        },
    },
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'DoiBong',
            key: 'MaDoiBong',
        },
    },
    MaCauThu: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'CauThu', 
            key: 'MaCauThu',
        },
    },
    MaLoaiBanThang: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'LoaiBanThang', 
            key: 'MaLoaiBanThang',
        },
    },
    ThoiDiem: {
        type: DataTypes.TIME,
        allowNull: false,
    },
}, {
    tableName: 'BANTHANG',
    timestamps: false,
});

module.exports = BanThang;
