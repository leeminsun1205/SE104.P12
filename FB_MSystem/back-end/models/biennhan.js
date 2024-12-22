const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');
const { autoCreateCode } = require('../utils/autoCreateCode');

const BienNhan = sequelize.define('BienNhan', {
    MaLePhi: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'DoiBong', // Tên bảng tham chiếu
            key: 'MaDoiBong',
        },
    },
    SoTien: {
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
        validate: {
            isAfterField(value) {
                if (value <= this.NgayBatDau) {
                    throw new Error('Ngày hết hạn phải lớn hơn ngày bắt đầu.');
                }
            },
        },
    },
    NgayThanhToan: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isAfterField(value) {
                if (value && value < this.NgayBatDau) {
                    throw new Error('Ngày thanh toán không được nhỏ hơn ngày bắt đầu.');
                }
            },
        },
    },
    TinhTrang: {
        type: DataTypes.BOOLEAN, // true: chưa thanh toán, false: đã thanh toán
        allowNull: false,
    },
}, {
    tableName: 'BIENNHAN',
    timestamps: false,
    hooks: {
        beforeValidate: async (record) => {
            if (!record.MaLePhi) {
                record.MaLePhi = await autoCreateCode(BienNhan, 'BN', 'MaLePhi', 4);
            }
        },
    },
    
});
BienNhan.associate = (models) => {
    BienNhan.belongsTo(models.DoiBong, {
        foreignKey: 'MaDoiBong',
        as: 'DoiBong',
    });
}
module.exports = BienNhan;
