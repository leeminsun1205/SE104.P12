const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MgDbCt = sequelize.define('MgDbCt', {
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    MaCauThu: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
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
    MgDbCt.associate = (models) => {
        MgDbCt.belongsTo(models.BangXepHang, {
            foreignKey: 'MaDoiBong',  // Chìa khóa ngoại trong MgDbCt
            as: 'BangXepHang',
        });
    };
};

module.exports = MgDbCt;
