const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VongDau = sequelize.define('VongDau', {
    MaVongDau: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'MuaGiai',
            key: 'MaMuaGiai',
        },
    },
    LuotDau: {
        type: DataTypes.BOOLEAN, // 0: Lượt đi, 1: Lượt về
        allowNull: false,
    },
    SoThuTu: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
            min: 1,
        },
    },
    NgayBatDau: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    NgayKetThuc: {
        type: DataTypes.DATE,
        allowNull: false,
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

    // Một vòng đấu có nhiều trận đấu
    VongDau.hasMany(models.TranDau, {
        foreignKey: 'MaVongDau',
        as: 'TranDau',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
};

module.exports = VongDau;
