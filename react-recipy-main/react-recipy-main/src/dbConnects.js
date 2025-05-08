const Bay = require("./model/bay");
const Category = require("./model/category");
const Ingridents = require("./model/ingridents");
const Instructions = require("./model/instructions");
const Recipe = require("./model/recipe");
const User = require("./model/user");


const sequelize = require('./dbSql');
sequelize.sync();
Category.hasMany(Recipe, { foreignKey: "Categoryid" });
User.hasMany(Recipe, { foreignKey: "UserId" });
User.hasMany(Bay, { foreignKey: "UserId" });
Recipe.hasMany(Instructions, { foreignKey: 'RecipeId' });
Recipe.hasMany(Ingridents, { foreignKey: 'RecipeId' });

module.exports = sequelize