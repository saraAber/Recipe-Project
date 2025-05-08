const { DataTypes } = require('sequelize');
const sequelize = require('../dbSql');
const Recipe = require('./recipe');
const Bay = require('./bay');


const User = sequelize.define('user', {
    Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    Password: {
        type: DataTypes.TEXT,
        allowNull: false,
        
    }, 
    Name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    UserName: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    Phone: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    Email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    Tz: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },  
});



module.exports = User;