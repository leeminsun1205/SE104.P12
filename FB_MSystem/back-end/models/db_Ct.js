const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DbCt = sequelize.define('DbCt', {
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
    tableName: 'DB_CT',
    timestamps: false,
});

// Không cần thiết lập quan hệ ở đây vì `DoiBong`, `CauThu`, và `CauThu` đã thiết lập quan hệ qua bảng này.
DbCt.associate = (models) => {
    DbCt.belongsTo(models.DoiBong, {
        foreignKey: 'MaDoiBong',
        as: 'DoiBong', // Alias cho mùa giải
    });
    // DbCt.belongsTo(models.MgDb, {
    //     foreignKey: 'MaDoiBong',
    //     as: 'MgDb', // Alias cho mùa giải
    // });
    DbCt.belongsTo(models.CauThu, {
        foreignKey: 'MaCauThu',
        as: 'CauThu', // Alias cho đội bóng
    });
    DbCt.hasMany(models.MgDb, { // Một cầu thủ trong đội bóng có thể tham gia nhiều mùa giải (lý thuyết, có thể không đúng trong thực tế)
        foreignKey: 'MaDoiBong',
        as: 'MgDb',
    });
};

module.exports = DbCt;
