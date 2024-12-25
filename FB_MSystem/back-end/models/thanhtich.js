const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ThanhTich = sequelize.define('ThanhTich', {
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    SoTranDaThiDau: {
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
    XepHang: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 1 },
    },
}, {
    tableName: 'THANHTICH',
    timestamps: false,
});

// Thiết lập quan hệ với các bảng khác
ThanhTich.associate = (models) => {
    // Thuộc một đội bóng
    ThanhTich.belongsTo(models.DoiBong, {
        foreignKey: 'MaDoiBong',
        as: 'DoiBong',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    // Thuộc một mùa giải
    ThanhTich.belongsTo(models.MuaGiai, {
        foreignKey: 'MaMuaGiai',
        as: 'MuaGiai',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
};

module.exports = ThanhTich;
