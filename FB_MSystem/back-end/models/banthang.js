const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BanThang = sequelize.define('BanThang', {
    MaBanThang: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    MaTranDau: {
        type: DataTypes.CHAR(20),
        allowNull: false,
        references: {
            model: 'TranDau',
            key: 'MaTranDau',
        },
    },
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'DoiBong',
            key: 'MaDoiBong',
        },
    },
    MaCauThu: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'CauThu',
            key: 'MaCauThu',
        },
    },
    MaLoaiBanThang: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'LoaiBanThang',
            key: 'MaLoaiBanThang',
        },
    },
    ThoiDiem: {
        type: DataTypes.TIME,
        allowNull: false,
    },
}, {
    tableName: 'BANTHANG',
    timestamps: false,
});

// Thiết lập quan hệ với các bảng khác
BanThang.associate = (models) => {
    // Một bàn thắng thuộc một trận đấu
    BanThang.belongsTo(models.TranDau, {
        foreignKey: 'MaTranDau',
        as: 'TranDau',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    // Một bàn thắng thuộc một đội bóng
    BanThang.belongsTo(models.DoiBong, {
        foreignKey: 'MaDoiBong',
        as: 'DoiBong',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    // Một bàn thắng được ghi bởi một cầu thủ
    BanThang.belongsTo(models.CauThu, {
        foreignKey: 'MaCauThu',
        as: 'CauThu',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    // Một bàn thắng có loại bàn thắng
    BanThang.belongsTo(models.LoaiBanThang, {
        foreignKey: 'MaLoaiBanThang',
        as: 'LoaiBanThang',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
};

module.exports = BanThang;
