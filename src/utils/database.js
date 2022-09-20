const Pool = require('pg').Pool;

// const pool = new Pool({
//     user:'postgres',
//     host: 'localhost',
//     database:'TestDB',
//     password: 'admin',
//     port:5432
// })

const pool = new Pool({
    user:'eximread',
    host: '18.214.151.123',
    database:'exim_portal_db',
    password: 'readonly@123',
    port:5432
})

module.exports = pool;