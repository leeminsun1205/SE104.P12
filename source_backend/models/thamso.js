const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ThamSo = sequelize.define('ThamSo', {
    SucChuaToiThieu: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    TieuChuanToiThieu: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    TuoiToiThieu: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    TuoiToiDa: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    SoLuongCauThuToiThieu: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    SoLuongCauThuToiDa: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    SoCauThuNgoaiToiDa: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    LePhi: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ThoiDiemGhiBanToiDa: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    DiemThang: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    DiemHoa: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    DiemThua: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
}, {
    tableName: 'THAMSO',
    timestamps: false,
});

module.exports = ThamSo;
