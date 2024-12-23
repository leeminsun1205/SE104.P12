const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MgDbCt = sequelize.define('MgDbCt', {
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'MuaGiai',
            key: 'MaMuaGiai',
        },
    },
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'DoiBong',
            key: 'MaDoiBong',
        },
    },
    MaCauThu: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'CauThu',
            key: 'MaCauThu',
        },
    },
}, {
    tableName: 'MG_DB_CT',
    timestamps: false,
});

// Không cần thiết lập quan hệ ở đây vì `MuaGiai`, `DoiBong`, và `CauThu` đã thiết lập quan hệ qua bảng này.
MgDbCt.associate = (models) => {
    MgDbCt.belongsTo(models.MuaGiai, {
        foreignKey: 'MaMuaGiai',
        as: 'MuaGiai', // Alias cho mùa giải
    });
    MgDbCt.belongsTo(models.DoiBong, {
        foreignKey: 'MaDoiBong',
        as: 'DoiBong', // Alias cho đội bóng
    });
    MgDbCt.belongsTo(models.CauThu, {
        foreignKey: 'MaCauThu',
        as: 'CauThu', // Alias cho cầu thủ
    });
};

module.exports = MgDbCt;
