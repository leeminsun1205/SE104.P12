const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CauThu = sequelize.define('CauThu', {
    MaCauThu: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    TenCauThu: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    NgaySinh: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    QuocTich: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    LoaiCauThu: {
        type: DataTypes.BOOLEAN, // 1: Trong nước, 0: Ngoài nước
        allowNull: false,
    },
    ViTri: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    ChieuCao: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0 },
    },
    CanNang: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0 },
    },
    SoAo: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        validate: { min: 1, max: 99 },
    },
    TieuSu: {
        type: DataTypes.STRING(1000),
        allowNull: true,
    },
    AnhCauThu: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
}, {
    tableName: 'CAUTHU',
    timestamps: false, 
});

// // Thiết lập quan hệ với các bảng khác
// CauThu.associate = (models) => {
//     // Một cầu thủ có thể nhận nhiều thẻ phạt
//     CauThu.hasMany(models.ThePhat, {
//         foreignKey: 'MaCauThu',
//         as: 'ThePhat',
//         onDelete: 'CASCADE',
//         onUpdate: 'CASCADE',
//     });

//     // Một cầu thủ có thể là vua phá lưới nhiều mùa giải
//     CauThu.hasMany(models.VuaPhaLuoi, {
//         foreignKey: 'MaCauThu',
//         as: 'VuaPhaLuoi',
//         onDelete: 'CASCADE',
//         onUpdate: 'CASCADE',
//     });

//     // Một cầu thủ có thể thuộc nhiều đội bóng qua bảng trung gian MG_DB_CT
//     CauThu.belongsToMany(models.DoiBong, {
//         through: models.MgDbCt,
//         foreignKey: 'MaCauThu',
//         otherKey: 'MaDoiBong',
//         as: 'DoiBong',
//     });

    

//     // Một cầu thủ có thể ghi nhiều bàn thắng (không dùng CASCADE để giữ lịch sử)
//     CauThu.hasMany(models.BanThang, {
//         foreignKey: 'MaCauThu',
//         as: 'BanThang',
//     });
// };

module.exports = CauThu;
