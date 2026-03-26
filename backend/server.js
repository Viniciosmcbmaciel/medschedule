const express = require("express");
const cors = require("cors");
const db = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

// TESTE
app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});

// 🔥 SALVAR CONSULTA
app.post("/api/consultas", (req, res) => {
    const { paciente, medico, data, horario } = req.body;

    const sql = "INSERT INTO consultas (paciente, medico, data, horario) VALUES (?, ?, ?, ?)";

    db.query(sql, [paciente, medico, data, horario], (err) => {
        if (err) {
            console.error("Erro ao salvar:", err);
            return res.status(500).json({ mensagem: "Erro ao salvar" });
        }

        res.json({ mensagem: "Consulta agendada com sucesso" });
    });
});

// 🔥 LISTAR CONSULTAS
app.get("/api/consultas", (req, res) => {
    db.query("SELECT * FROM consultas", (err, results) => {
        if (err) {
            console.error("Erro ao buscar:", err);
            return res.status(500).json({ mensagem: "Erro ao buscar" });
        }

        res.json(results);
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});

app.delete("/api/consultas/:id", (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM consultas WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ erro: err });

        res.json({ mensagem: "Excluído com sucesso" });
    });
});

app.put("/api/consultas/:id", (req, res) => {
    const id = req.params.id;
    const { paciente, medico, data, horario } = req.body;

    const sql = "UPDATE consultas SET paciente=?, medico=?, data=?, horario=? WHERE id=?";

    db.query(sql, [paciente, medico, data, horario, id], (err) => {
        if (err) return res.status(500).json({ erro: err });

        res.json({ mensagem: "Atualizado com sucesso" });
    });
});

app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    db.query("SELECT * FROM usuarios WHERE email=? AND senha=?", [email, senha], (err, result) => {
        if (result.length > 0) {
            res.json({ sucesso: true });
        } else {
            res.json({ sucesso: false });
        }
    });
});