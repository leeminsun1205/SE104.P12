const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TranDau = sequelize.define('TranDau', {
    MaTranDau: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    MaVongDau: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'VongDau',
            key: 'MaVongDau',
        },
    },
    MaDoiBongNha: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'DoiBong',
            key: 'MaDoiBong',
        },
    },
    MaDoiBongKhach: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'DoiBong',
            key: 'MaDoiBong',
        },
    },
    MaSan: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'SanThiDau',
            key: 'MaSan',
        },
    },
    NgayThiDau: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    GioThiDau: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    BanThangDoiNha: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0 },
    },
    BanThangDoiKhach: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0 },
    },
}, {
    tableName: 'TRANDAU',
    timestamps: false,
});

// Thiết lập quan hệ với các bảng khác
TranDau.associate = (models) => {
    // Một trận đấu thuộc một vòng đấu
    TranDau.belongsTo(models.VongDau, {
        foreignKey: 'MaVongDau',
        as: 'VongDau',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    // Một trận đấu có đội nhà
    TranDau.belongsTo(models.DoiBong, {
        foreignKey: 'MaDoiBongNha',
        as: 'DoiBongNha',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    // Một trận đấu có đội khách
    TranDau.belongsTo(models.DoiBong, {
        foreignKey: 'MaDoiBongKhach',
        as: 'DoiBongKhach',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    // Một trận đấu được tổ chức tại một sân
    TranDau.belongsTo(models.SanThiDau, {
        foreignKey: 'MaSan',
        as: 'SanThiDau',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    });

    // Một trận đấu có thể có nhiều bàn thắng
    TranDau.hasMany(models.BanThang, {
        foreignKey: 'MaTranDau',
        as: 'BanThang',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
};

module.exports = TranDau;
