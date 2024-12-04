const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Biennhan = sequelize.define('Biennhan', {
    MaLePhi: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: "DoiBong",
            key: "MaDoiBong",
        }
    },
    SoTien: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    NgayBatDau: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    NgayHetHan: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    NgayThanhToan: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    TinhTrang: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    tableName: 'BIENNHAN',
    timestamps: false,
});

module.exports = Biennhan;