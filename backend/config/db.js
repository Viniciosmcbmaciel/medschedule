const mysql = require("mysql2");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error("DATABASE_URL não definida");
}

const db = mysql.createPool(databaseUrl);

db.getConnection((err, connection) => {
    if (err) {
        console.error("ERRO AO CONECTAR NO MYSQL:", err);
    } else {
        console.log("MYSQL CONECTADO COM SUCESSO");
        connection.release();
    }
});

module.exports = db;