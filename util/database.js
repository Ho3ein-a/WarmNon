const mysql = require('mysql2');

const pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    database : 'hotnon', 
    password : ''
})

module.exports = pool.promise();