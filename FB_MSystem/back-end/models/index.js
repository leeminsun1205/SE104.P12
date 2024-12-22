const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database'); // Kết nối tới database

const db = {};

// Tự động load tất cả các model
fs.readdirSync(__dirname)
  .filter((file) => file !== 'index.js' && file.endsWith('.js'))
  .forEach((file) => {
    // Vì các file model của bạn export ra một instance đã define sẵn
    // => Ta chỉ cần require và gán trực tiếp vào db.
    const model = require(path.join(__dirname, file));

    // model bây giờ chính là instance (một Sequelize model đã được define)
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
