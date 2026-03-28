const jwt = require("jsonwebtoken");

function autenticar(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ erro: "Token não enviado" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ erro: "Token inválido" });
        }

        req.usuario = decoded;
        next();
    });
}

module.exports = autenticar;