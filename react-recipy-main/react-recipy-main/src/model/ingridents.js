const { DataTypes } = require('sequelize');
const sequelize = require('../dbSql');


const Ingridents = sequelize.define('Ingridents', {
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
        type: DataTypes.STRING,
        allowNull: false,
    },
    Type: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = Ingridents;