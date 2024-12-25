const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DsThePhat = sequelize.define('DsThePhat', {
    MaCauThu: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    MaVongDau: {
        type: DataTypes.CHAR(15),
        primaryKey: true,
        allowNull: false,
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
    tableName: 'DS_THEPHAT',
    timestamps: false,
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
