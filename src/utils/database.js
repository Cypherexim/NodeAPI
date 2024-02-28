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
// const pool = new Pool({
//     user:'apiuser',
//     host: '18.214.151.123',
//     database:'exim_portal_db',
//     password: 'api123',
//     port:5432,
//     // keepAlive: true,
//     // keepAliveInitialDelayMillis: 10000,
//     idleTimeoutMillis: 0,
//     connectionTimeoutMillis: 0
// })


const pool = new Pool({
    user:'apiuser',
    host: '18.214.151.123',
    database:'exim_portal_db',
    password: 'api123',
    port:5432,
  min: 1,
  max: 100,
  createTimeoutMillis: 8000,
  acquireTimeoutMillis: 8000,
  idleTimeoutMillis: 8000,
  reapIntervalMillis: 1000,
  createRetryIntervalMillis: 100,
  acquireConnectionTimeout: 10000
})

// const pool = new Pool({
//     user:process.env.USER,
//     host: process.env.HOST,
//     database:process.env.DATABASE,
//     password: process.env.PASSWORD,
//     port:process.env.PORT
// })

module.exports = pool;