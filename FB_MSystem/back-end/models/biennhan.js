const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { autoCreateCode } = require('../utils/autoCreateCode');

const BienNhan = sequelize.define('BienNhan', {
    MaBienNhan: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'DoiBong', 
            key: 'MaDoiBong',
        },
    },
    LePhi: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    NgayBatDau: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    NgayHetHan: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    NgayThanhToan: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null, 
    },
    TinhTrang: {
        type: DataTypes.BOOLEAN, // true: chưa thanh toán, false: đã thanh toán
        allowNull: false,
        defaultValue: false, 
    },
}, {
    tableName: 'BIENNHAN',
    timestamps: false,
    hooks: {
        beforeValidate: async (record) => {
            // Tự động tạo mã biên nhận nếu chưa có
            if (!record.MaBienNhan) {
                record.MaBienNhan = await autoCreateCode(BienNhan, 'BN', 'MaBienNhan', 4);
            }
            // Tự động đặt giá trị mặc định cho NgayThanhToan và TinhTrang
            if (record.NgayThanhToan === undefined) {
                record.NgayThanhToan = null;
            }
            if (record.TinhTrang === undefined) {
                record.TinhTrang = false;
            }
        },
    },
});

BienNhan.associate = (models) => {
    BienNhan.belongsTo(models.DoiBong, {
        foreignKey: 'MaDoiBong',
        as: 'DoiBong',
    });
};

module.exports = BienNhan;
