const { Sequelize } = require("sequelize");


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './recipe.sqlite'
});




module.exports = sequelize;