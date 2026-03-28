const express = require("express");
const router = express.Router();
const db = require("../config/db");
const autenticar = require("../middleware/auth");

router.get("/", autenticar, (req, res) => {
    db.query(
        "SELECT * FROM consultas WHERE usuario_id = ? ORDER BY id DESC",
        [req.usuario.id],
        (err, result) => {
            if (err) return res.status(500).json({ erro: "Erro ao listar consultas" });
            res.json(result);
        }
    );
});

router.post("/", autenticar, (req, res) => {
    const { paciente, medico, data, horario } = req.body;

    db.query(
        "INSERT INTO consultas (paciente, medico, data, horario, usuario_id) VALUES (?, ?, ?, ?, ?)",
        [paciente, medico, data, horario, req.usuario.id],
        (err) => {
            if (err) return res.status(500).json({ erro: "Erro ao salvar consulta" });
            res.json({ mensagem: "Consulta salva!" });
        }
    );
});

router.delete("/:id", autenticar, (req, res) => {
    db.query(
        "DELETE FROM consultas WHERE id = ? AND usuario_id = ?",
        [req.params.id, req.usuario.id],
        (err) => {
            if (err) return res.status(500).json({ erro: "Erro ao excluir" });
            res.json({ mensagem: "Excluído" });
        }
    );
});

module.exports = router;