const { DataTypes } = require('sequelize');
const sequelize = require('../dbSql');

const Instructions = sequelize.define('Instructions', {
    Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
  
});

module.exports = Instructions;