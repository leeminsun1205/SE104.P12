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

// Thiết lập quan hệ với các bảng khác
BangXepHang.associate = (models) => {
    // Một bảng xếp hạng thuộc về một mùa giải
    BangXepHang.belongsTo(models.MuaGiai, {
        foreignKey: 'MaMuaGiai',
        as: 'MuaGiai',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    // Một bảng xếp hạng thuộc về một vòng đấu
    BangXepHang.belongsTo(models.VongDau, {
        foreignKey: 'MaVongDau',
        as: 'VongDau',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    // Một bảng xếp hạng thuộc về một đội bóng
    BangXepHang.belongsTo(models.DoiBong, {
        foreignKey: 'MaDoiBong',
        as: 'DoiBong',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
};

module.exports = BangXepHang;
