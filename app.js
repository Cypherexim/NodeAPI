const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes/routes');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/user', routes);
app.listen(8080);