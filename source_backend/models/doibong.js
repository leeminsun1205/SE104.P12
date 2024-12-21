const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DoiBong = sequelize.define('DoiBong', {
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    TenDoiBong: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    ThanhPhoTrucThuoc: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    MaSan: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'SanThiDau', // Tên bảng tham chiếu
            key: 'MaSan',
        },
    },
    TenHLV: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    ThongTin: {
        type: DataTypes.STRING(1000),
        allowNull: true, 
    },
    Logo: {
        type: DataTypes.STRING(200),
        allowNull: true, 
    },
}, {
    tableName: 'DOIBONG',
    timestamps: false, 
});

// Thiết lập quan hệ với các bảng khác
DoiBong.associate = (models) => {
    // Một đội bóng có thể thuộc nhiều biên nhận
    DoiBong.hasMany(models.BienNhan, {
        foreignKey: 'MaDoiBong',
        as: 'BienNhan',
    });

    // Một đội bóng có thể tham gia nhiều mùa giải
    DoiBong.belongsToMany(models.MuaGiai, {
        through: models.MgDbCt, // Bảng trung gian
        foreignKey: 'MaDoiBong',
        otherKey: 'MaMuaGiai',
        as: 'MuaGiai',
    });

    // Một đội bóng có thể tham gia nhiều trận đấu
    DoiBong.hasMany(models.TranDau, {
        foreignKey: 'MaDoiBongNha',
        as: 'TranDauNha',
    });

    DoiBong.hasMany(models.TranDau, {
        foreignKey: 'MaDoiBongKhach',
        as: 'TranDauKhach',
    });

    // Một đội bóng có thể có nhiều cầu thủ
    DoiBong.hasMany(models.CauThu, {
        foreignKey: 'MaDoiBong',
        as: 'CauThu',
    });

    // Một đội bóng có thể có nhiều thành tích
    DoiBong.hasMany(models.ThanhTich, {
        foreignKey: 'MaDoiBong',
        as: 'ThanhTich',
    });
};

module.exports = DoiBong;
