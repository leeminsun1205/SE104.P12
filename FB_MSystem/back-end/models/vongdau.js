const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VongDau = sequelize.define('VongDau', {
    MaVongDau: {
        type: DataTypes.CHAR(15),
        primaryKey: true,
        allowNull: false,
    },
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
    LuotDau: {
        type: DataTypes.BOOLEAN, // 0: Lượt đi, 1: Lượt về
        allowNull: false,
    },
    NgayBatDau: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    NgayKetThuc: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isAfterField(value) {
                if (value <= this.NgayBatDau) {
                    throw new Error('Ngày kết thúc phải lớn hơn ngày bắt đầu.');
                }
            },
        },
    },
}, {
    tableName: 'VONGDAU',
    timestamps: false,
});

// Thiết lập quan hệ với các bảng khác
VongDau.associate = (models) => {
    // Một vòng đấu thuộc một mùa giải
    VongDau.belongsTo(models.MuaGiai, {
        foreignKey: 'MaMuaGiai',
        as: 'MuaGiai',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
};

module.exports = VongDau;
