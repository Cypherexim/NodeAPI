const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes/routes');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));
// app.use((req,res,next) =>{
//     res.setHeader('Access-Control-Allow-Origin','*');
//     res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
//     res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
//     next();
// })
app.use(cors());
app.use('/user', routes);
app.listen(8080);