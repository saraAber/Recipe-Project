const { DataTypes } = require('sequelize');
const sequelize = require('../dbSql');
const Recipe = require('./recipe');


const Category = sequelize.define('category', {
  Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  }
});


module.exports = Category;
