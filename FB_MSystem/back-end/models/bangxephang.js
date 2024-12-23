const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BangXepHang = sequelize.define('BangXepHang', {
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'MuaGiai',
            key: 'MaMuaGiai',
        },
    },
    MaVongDau: {
        type: DataTypes.CHAR(15),
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'VongDau',
            key: 'MaVongDau',
        },
    },
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'DoiBong',
            key: 'MaDoiBong',
        },
    },
    SoTran: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    SoTranThang: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    SoTranHoa: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    SoTranThua: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    SoBanThang: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    SoBanThua: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    DiemSo: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    HieuSo: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
}, {
    tableName: 'BANGXEPHANG',
    timestamps: false,
});

module.exports = BangXepHang;
