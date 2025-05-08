const express = require('express');
const cors = require('cors');
const api = require('./src/routes/api')
const sequelize=require('./src/dbConnects')
const app = express();
app.use(express.json());

app.use(cors())
app.use('/api', api)

const port = 8080;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})