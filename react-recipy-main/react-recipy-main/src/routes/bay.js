const express = require('express');
const route = express.Router();
const bayServer = require('../controls/bay')

route.post('/', bayServer.AddToList)
route.get('/:UserId', bayServer.GetMyList)
route.post('/delete/:Id', bayServer.Delete)

module.exports = route;