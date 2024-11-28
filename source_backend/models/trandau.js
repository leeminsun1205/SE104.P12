const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trandau = sequelize.define('Trandau', {
    MaTranDau: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    MaVongDau: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'VongDau', // Tên bảng ngoại (nếu có)
            key: 'MaVongDau',
        },
    },
    MaDoiBongNha: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'DoiBong', // Tên bảng ngoại (nếu có)
            key: 'MaDoiBong',
        },
    },
    MaDoiBongKhach: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'DoiBong', // Tên bảng ngoại (nếu có)
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
            model: 'San', // Tên bảng ngoại (nếu có)
            key: 'MaSan',
        },
    },
    BanThangDoiNha: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    BanThangDoiKhach: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'TRANDAU',
    timestamps: false,
});

module.exports = Trandau;
