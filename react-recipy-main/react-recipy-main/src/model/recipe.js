const { DataTypes } = require('sequelize');
const sequelize = require('../dbSql');
const Instructions = require('./instructions');


const Recipe = sequelize.define('recipe', {
    Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Img: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    Duration: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    Difficulty: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});


module.exports = Recipe;