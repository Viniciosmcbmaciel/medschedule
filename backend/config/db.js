const mysql = require("mysql2");

const db = mysql.createPool(process.env.DATABASE_URL);

db.getConnection((err, connection) => {
    if (err) {
        console.error("ERRO AO CONECTAR NO MYSQL:", err);
    } else {
        console.log("MYSQL CONECTADO COM SUCESSO");
        connection.release();
    }
});

module.exports = db;