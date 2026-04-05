const mysql = require("mysql2");

const db = mysql.createPool(process.env.DATABASE_URL);

console.log("Conectando com DATABASE_URL");

module.exports = db;