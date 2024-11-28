const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Banthang = sequelize.define('Banthang', {
    MaBanThang: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    MaTranDau: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'Trandau', // Tên bảng ngoại (nếu có)
            key: 'MaTranDau',
        },
    },
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'DoiBong', // Tên bảng ngoại (nếu có)
            key: 'MaDoiBong',
        },
    },
    MaCauThu: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'Cauthu', // Tên bảng ngoại (nếu có)
            key: 'MaCauThu',
        },
    },
    MaLoaiBanThang: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'LoaiBanThang', // Tên bảng ngoại (nếu có)
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

module.exports = Banthang;
