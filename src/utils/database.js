const Pool = require('pg').Pool;
const env = require('dotenv').config()

const pool = new Pool({
    user:'cypher',
    host: '18.214.151.123',
    database:'cypher',
    password: 'cypher123',
    port:5432
})

// const pool = new Pool({
//     user:process.env.USER,
//     host: process.env.HOST,
//     database:process.env.DATABASE,
//     password: process.env.PASSWORD,
//     port:process.env.PORT
// })

module.exports = pool;