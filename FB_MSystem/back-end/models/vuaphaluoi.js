const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VuaPhaLuoi = sequelize.define('VuaPhaLuoi', {
    MaCauThu: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        primaryKey: true,
    },
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        primaryKey: true,
    },
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
    SoTran: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    SoBanThang: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
}, {
    tableName: 'VUAPHALUOI',
    timestamps: false,
});

// Thiết lập quan hệ với các bảng khác
VuaPhaLuoi.associate = (models) => {
    // Thuộc về một cầu thủ
    VuaPhaLuoi.belongsTo(models.CauThu, {
        foreignKey: 'MaCauThu',
        as: 'CauThu',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    // Thuộc về một mùa giải
    VuaPhaLuoi.belongsTo(models.MuaGiai, {
        foreignKey: 'MaMuaGiai',
        as: 'MuaGiai',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    // Thuộc về một đội bóng
    VuaPhaLuoi.belongsTo(models.DoiBong, {
        foreignKey: 'MaDoiBong',
        as: 'DoiBong',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
};

module.exports = VuaPhaLuoi;
