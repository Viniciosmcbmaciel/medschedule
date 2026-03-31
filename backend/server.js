const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// 👇 aqui ficou simples
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API online");
});

app.use("/api", require("./routes/auth"));
app.use("/api/consultas", require("./routes/consultas"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});