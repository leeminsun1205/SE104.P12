const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const {autoCreateCode} = require('../utils/autoCreateCode')

const BanThang = sequelize.define('BanThang', {
    MaBanThang: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    MaTranDau: {
        type: DataTypes.CHAR(20),
        allowNull: false,
    },
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
    MaCauThu: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
    MaLoaiBanThang: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
    ThoiDiem: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
}, {
    tableName: 'BANTHANG',
    timestamps: false,
    hooks: {
        beforeValidate: async (record) => {
            if (!record.MaBanThang) {
                record.MaBanThang = await autoCreateCode(BanThang, 'BT', 'MaBanThang', 7);
            }
        },
    },
});

// Thiết lập quan hệ với các bảng khác
BanThang.associate = (models) => {
    // Một bàn thắng thuộc một trận đấu
    BanThang.belongsTo(models.TranDau, {
        foreignKey: 'MaTranDau',
        as: 'TranDau',
        onDelete: 'CASCADE',
    });

    // Một bàn thắng thuộc một đội bóng
    BanThang.belongsTo(models.DoiBong, {
        foreignKey: 'MaDoiBong',
        as: 'DoiBong',
        onDelete: 'CASCADE',
    });

    // Một bàn thắng được ghi bởi một cầu thủ
    BanThang.belongsTo(models.CauThu, {
        foreignKey: 'MaCauThu',
        as: 'CauThu',
        onDelete: 'CASCADE',
    });

    // Một bàn thắng có loại bàn thắng
    BanThang.belongsTo(models.LoaiBanThang, {
        foreignKey: 'MaLoaiBanThang',
        as: 'LoaiBanThang',
        onDelete: 'CASCADE',
    });
};

module.exports = BanThang;
