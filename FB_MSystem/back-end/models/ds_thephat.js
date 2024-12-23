const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DsThePhat = sequelize.define('DsThePhat', {
    MaCauThu: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'CauThu',
            key: 'MaCauThu',
        },
    },
    MaVongDau: {
        type: DataTypes.CHAR(15),
        allowNull: false,
        references: {
            model: 'VongDau',
            key: 'MaVongDau',
        },
    },
    SoTheVang: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    SoTheDo: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    TinhTrangThiDau: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    tableName: 'DSTHEPHAT',
    timestamps: false,
    primaryKey: ['MaCauThu', 'MaVongDau'], // Tổ hợp khóa chính
});

// Thiết lập quan hệ với các bảng khác
DsThePhat.associate = (models) => {
    // Thuộc một cầu thủ
    DsThePhat.belongsTo(models.CauThu, {
        foreignKey: 'MaCauThu',
        as: 'CauThu',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    // Thuộc một vòng đấu
    DsThePhat.belongsTo(models.VongDau, {
        foreignKey: 'MaVongDau',
        as: 'VongDau',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
};

module.exports = DsThePhat;
