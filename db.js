const mysql =require('mysql2/promise');

const db =mysql.createPool({
    host: 'localhost',
    port: 3308,
    user: 'root',
    password: '',
    database: 'ed_planner',
});

module.exports ={db};