const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UtXepHang = sequelize.define('UtXepHang', {
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'MuaGiai',
            key: 'MaMuaGiai',
        },
    },
    MaLoaiUT: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'LoaiUuTien',
            key: 'MaLoaiUT',
        },
    },
    MucDoUT: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 1 }, // Mức độ ưu tiên phải >= 1
    },
}, {
    tableName: 'UT_XEPHANG',
    timestamps: false,
});

// Thiết lập quan hệ với các bảng khác
UtXepHang.associate = (models) => {
    // Thuộc một mùa giải
    UtXepHang.belongsTo(models.MuaGiai, {
        foreignKey: 'MaMuaGiai',
        as: 'MuaGiai',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    // Thuộc một loại ưu tiên
    UtXepHang.belongsTo(models.LoaiUuTien, {
        foreignKey: 'MaLoaiUT',
        as: 'LoaiUuTien',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
};

module.exports = UtXepHang;
