const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("ERRO AO CONECTAR NO MYSQL:", err);
    } else {
        console.log("MYSQL CONECTADO COM SUCESSO");
        console.log({
            host: process.env.MYSQLHOST,
            user: process.env.MYSQLUSER,
            database: process.env.MYSQLDATABASE
        });
        connection.release();
    }
});

module.exports = db;