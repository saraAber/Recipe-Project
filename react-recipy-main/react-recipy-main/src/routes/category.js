const express = require('express');
const route = express.Router();
const categoryServer = require('../controls/category')

route.get('/', categoryServer.GetAllCategory)
route.post('/', categoryServer.AddCategory)

module.exports = route;