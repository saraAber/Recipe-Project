const { DataTypes } = require('sequelize');
const sequelize = require('../dbSql');


const Bay = sequelize.define('bay', {
    Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Count: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    UserId: {


        type: DataTypes.NUMBER,
        allowNull: false,
    },
});



module.exports = Bay;