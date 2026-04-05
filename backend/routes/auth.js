const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const senhaHash = await bcrypt.hash(senha, 10);

        db.query(
            "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
            [nome, email, senhaHash],
            (err) => {
                if (err) {
                    console.error("ERRO MYSQL REGISTER:", err);
                    return res.status(500).json({ erro: err.message });
                }

                res.json({ mensagem: "Usuário cadastrado!" });
            }
        );
    } catch {
        res.status(500).json({ erro: "Erro interno no cadastro" });
    }
});

router.post("/login", (req, res) => {
    const { email, senha } = req.body;

    db.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        async (err, result) => {
            if (err) return res.status(500).json({ erro: "Erro no login" });
            if (result.length === 0) {
                return res.status(401).json({ erro: "Usuário não encontrado" });
            }

            const usuario = result[0];
            const senhaValida = await bcrypt.compare(senha, usuario.senha);

            if (!senhaValida) {
                return res.status(401).json({ erro: "Senha inválida" });
            }

            const token = jwt.sign(
                { id: usuario.id, nome: usuario.nome },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.json({ token, nome: usuario.nome });
        }
    );
});

 router.get("/teste-auth", (req, res) => {
     res.send("Rota auth caregada!");
 });

module.exports = router;