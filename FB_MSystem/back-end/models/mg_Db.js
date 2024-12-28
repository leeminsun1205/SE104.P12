const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MgDb = sequelize.define('MgDb', {
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
}, {
    tableName: 'MG_DB',
    timestamps: false,
});

// Không cần thiết lập quan hệ ở đây vì `MuaGiai`, `DoiBong`, và `CauThu` đã thiết lập quan hệ qua bảng này.
MgDb.associate = (models) => {
    MgDb.belongsTo(models.MuaGiai, {
        foreignKey: 'MaMuaGiai',
        as: 'MuaGiai', // Alias cho mùa giải
    });
    // MgDb.belongsTo(models.DbCt, {
    //     foreignKey: 'MaDoiBong',
    //     as: 'DbCt', // Alias cho mùa giải
    // });
    // MgDb.hasMany(models.DbCt, 
    //     { as: 'DbCt', foreignKey: 'MaDoiBong' }); 
    MgDb.belongsTo(models.DoiBong, {
        foreignKey: 'MaDoiBong',
        as: 'DoiBong', // Alias cho đội bóng
    });
    MgDb.hasMany(models.DbCt, { // Một đội bóng trong mùa giải có nhiều cầu thủ
        foreignKey: 'MaDoiBong',
        as: 'DbCt',
    });
};

module.exports = MgDb;
