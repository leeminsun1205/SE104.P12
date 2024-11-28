const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bangxephang = sequelize.define('Bangxephang', {
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'Muagia', // Tên bảng mùa giải, nếu có
            key: 'MaMuaGiai',
        },
    },
    MaVongDau: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'VongDau', // Tên bảng vòng đấu, nếu có
            key: 'MaVongDau',
        },
    },
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'DoiBong', // Tên bảng đội bóng, nếu có
            key: 'MaDoiBong',
        },
    },
    SoTran: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    SoTranThang: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    SoTranHoa: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    SoTranThua: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    SoBanThang: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    SoBanThua: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    HieuSo: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    Diem: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
}, {
    tableName: 'BANGXEPHANG',
    timestamps: false,
});

module.exports = Bangxephang;
