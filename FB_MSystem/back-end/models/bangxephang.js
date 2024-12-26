const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BangXepHang = sequelize.define('BangXepHang', {
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    SoTran: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
    },
    SoTranThang: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
    },
    SoTranHoa: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
    },
    SoTranThua: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
    },
    SoBanThang: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
    },
    SoBanThua: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
    },
    DiemSo: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
    },
    HieuSo: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    tableName: 'BANGXEPHANG',
    timestamps: false,
});

// Thiết lập quan hệ với các bảng khác
BangXepHang.associate = (models) => {
    // Liên kết với bảng DOIBONG (thông qua MaDoiBong)
    BangXepHang.belongsTo(models.DoiBong, {
        foreignKey: 'MaDoiBong',
        as: 'DoiBong',
    });

    // Liên kết với bảng MUAGIAI (thông qua MaMuaGiai)
    BangXepHang.belongsTo(models.MuaGiai, {
        foreignKey: 'MaMuaGiai',
        as: 'MuaGiai',
    });
};

module.exports = BangXepHang;
