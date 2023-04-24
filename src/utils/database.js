const Pool = require('pg').Pool;
const env = require('dotenv').config()

// Development - Cypher
// const pool = new Pool({
//     user:'cypher',
//     host: '18.214.151.123',
//     database:'cypher',
//     password: 'cypher123',
//     port:5432
// })

// Production - Exim
const pool = new Pool({
    user:'apiuser',
    host: '18.214.151.123',
    database:'exim_portal_db',
    password: 'api123',
    port:5432,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    idleTimeoutMillis: 2000000,
    connectionTimeoutMillis: 2000000
})

// const pool = new Pool({
//     user:process.env.USER,
//     host: process.env.HOST,
//     database:process.env.DATABASE,
//     password: process.env.PASSWORD,
//     port:process.env.PORT
// })

module.exports = pool;