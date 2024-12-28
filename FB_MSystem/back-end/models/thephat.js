const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const {autoCreateCode} = require('../utils/autoCreateCode')
const ThePhat = sequelize.define('ThePhat', {
    MaThePhat: {
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
    MaCauThu: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'CauThu',
            key: 'MaCauThu',
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
    MaLoaiThePhat: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'LoaiThePhat',
            key: 'MaLoaiThePhat',
        },
    },
    ThoiGian: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    LyDo: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    tableName: 'THEPHAT',
    timestamps: false,
    hooks: {
        beforeValidate: async (record) => {
            if (!record.MaThePhat) {
                record.MaThePhat = await autoCreateCode(ThePhat, 'TP', 'MaThePhat', 7);
            }
        },
    },
});

// Thiết lập quan hệ với các bảng khác
ThePhat.associate = (models) => {
    // Thuộc một trận đấu
    ThePhat.belongsTo(models.TranDau, {
        foreignKey: 'MaTranDau',
        as: 'TranDau',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    // Thuộc một cầu thủ
    ThePhat.belongsTo(models.CauThu, {
        foreignKey: 'MaCauThu',
        as: 'CauThu',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    // Thuộc một đội bóng
    ThePhat.belongsTo(models.DoiBong, {
        foreignKey: 'MaDoiBong',
        as: 'DoiBong',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    // Thuộc một loại thẻ phạt
    ThePhat.belongsTo(models.LoaiThePhat, {
        foreignKey: 'MaLoaiThePhat',
        as: 'LoaiThePhat',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
};

module.exports = ThePhat;
