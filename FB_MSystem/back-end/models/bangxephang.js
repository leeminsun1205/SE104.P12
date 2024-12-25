const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BangXepHang = sequelize.define('BangXepHang', {
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    // MaVongDau: {
    //     type: DataTypes.CHAR(15),
    //     primaryKey: true,
    //     allowNull: false,
    // },
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
        validate: { min: 0 },
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

    // Liên kết với bảng VONGDAU (thông qua MaMuaGiai và MaVongDau)
    // BangXepHang.belongsTo(models.VongDau, {
    //     foreignKey: 'MaVongDau',
    //     targetKey: 'MaVongDau',
    //     as: 'VongDau',
    // });

    // Liên kết với bảng MgDbCt
    BangXepHang.hasMany(models.MgDbCt, {  // Sử dụng hasMany hoặc belongsToMany tùy theo mối quan hệ
        foreignKey: 'MaDoiBong',  // Chìa khóa ngoại liên kết giữa BangXepHang và MgDbCt
        as: 'MgDbCt',
    });
};

module.exports = BangXepHang;
