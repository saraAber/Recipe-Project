const express = require('express');
const route = express.Router();

const recipe = require('../controls/recipe');

route.get('/', recipe.GetAllRecipe);
route.get('/:Id', recipe.GetRecipe);
route.post('/', recipe.AddRecipy);
route.post('/edit', recipe.EditRecipy);
route.post('/delete/:Id', recipe.Delete);


module.exports = route;