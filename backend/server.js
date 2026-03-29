const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Origens permitidas
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://127.0.0.1:5500",
    "http://localhost:5500"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Permite requests sem origin (ex: testes internos, Postman)
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Origem não permitida pelo CORS: " + origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Teste da API
app.get("/", (req, res) => {
    res.send("API online");
});

// Rotas
app.use("/api", require("./routes/auth"));
app.use("/api/consultas", require("./routes/consultas"));

// Porta Railway / local
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});