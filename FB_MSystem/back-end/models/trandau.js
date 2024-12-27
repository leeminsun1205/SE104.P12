const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TranDau = sequelize.define('TranDau', {
    MaTranDau: {
        type: DataTypes.CHAR(20),
        primaryKey: true,
        allowNull: false,
    },
    MaVongDau: {
        type: DataTypes.CHAR(15),
        allowNull: false,
    },
    MaDoiBongNha: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
    MaDoiBongKhach: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
    MaSan: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
    NgayThiDau: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    GioThiDau: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    BanThangDoiNha: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    BanThangDoiKhach: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    TinhTrang: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
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
};

module.exports = TranDau;