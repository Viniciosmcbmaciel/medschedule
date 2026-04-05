const API = "https://medschedule-production-b719.up.railway.app";

// LOGIN
function login() {
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");

    if (!emailInput || !senhaInput) return;

    fetch(API + "/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: emailInput.value,
            senha: senhaInput.value
        })
    })
    .then(async (res) => {
        const texto = await res.text();

        try {
            const data = JSON.parse(texto);

            if (!res.ok) {
                throw new Error(data.erro || "Erro no login");
            }

            return data;
        } catch {
            throw new Error("Resposta inválida do servidor: " + texto);
        }
    })
    .then((data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("nome", data.nome || "Usuário");
        window.location.href = "dashboard.html";
    })
    .catch((err) => {
        alert(err.message);
        console.error("Erro no login:", err);
    });
}

// CADASTRO
function cadastrar() {
    const nomeInput = document.getElementById("nome");
    const emailCadastroInput = document.getElementById("emailCadastro");
    const senhaCadastroInput = document.getElementById("senhaCadastro");

    if (!nomeInput || !emailCadastroInput || !senhaCadastroInput) return;

    fetch(API + "/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: nomeInput.value,
            email: emailCadastroInput.value,
            senha: senhaCadastroInput.value
        })
    })
    .then(async (res) => {
        const texto = await res.text();

        try {
            const data = JSON.parse(texto);

            if (!res.ok) {
                throw new Error(data.erro || "Erro ao cadastrar");
            }

            return data;
        } catch {
            throw new Error("Resposta inválida do servidor: " + texto);
        }
    })
    .then((data) => {
        alert(data.mensagem || "Usuário cadastrado com sucesso");

        nomeInput.value = "";
        emailCadastroInput.value = "";
        senhaCadastroInput.value = "";
    })
    .catch((err) => {
        alert(err.message);
        console.error("Erro no cadastro:", err);
    });
}

// LOGOUT
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

// LISTAR CONSULTAS
function carregarConsultas() {
    const lista = document.getElementById("lista");
    if (!lista) return;

    fetch(API + "/api/consultas", {
        headers: {
            Authorization: localStorage.getItem("token")
        }
    })
    .then(async (res) => {
        const texto = await res.text();

        try {
            const data = JSON.parse(texto);

            if (!res.ok) {
                throw new Error(data.erro || "Erro ao carregar consultas");
            }

            return data;
        } catch {
            throw new Error("Resposta inválida do servidor: " + texto);
        }
    })
    .then((dados) => {
        lista.innerHTML = "";

        if (!Array.isArray(dados)) return;

        dados.forEach((c) => {
            const dataFormatada = c.data
                ? new Date(c.data).toISOString().split("T")[0]
                : "";

            lista.innerHTML += `
                <tr>
                    <td>${c.paciente}</td>
                    <td>${c.medico}</td>
                    <td>${dataFormatada}</td>
                    <td>${c.horario}</td>
                    <td>
                        <button onclick="excluir(${c.id})">X</button>
                    </td>
                </tr>
            `;
        });
    })
    .catch((err) => {
        alert(err.message);
        console.error("Erro ao carregar consultas:", err);
    });
}

// SALVAR CONSULTA
function agendar() {
    const pacienteInput = document.getElementById("paciente");
    const medicoInput = document.getElementById("medico");
    const dataInput = document.getElementById("data");
    const horarioInput = document.getElementById("horario");

    if (!pacienteInput || !medicoInput || !dataInput || !horarioInput) return;

    fetch(API + "/api/consultas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token")
        },
        body: JSON.stringify({
            paciente: pacienteInput.value,
            medico: medicoInput.value,
            data: dataInput.value,
            horario: horarioInput.value
        })
    })
    .then(async (res) => {
        const texto = await res.text();

        try {
            const data = JSON.parse(texto);

            if (!res.ok) {
                throw new Error(data.erro || data.mensagem || "Erro ao salvar consulta");
            }

            return data;
        } catch {
            throw new Error("Resposta inválida do servidor: " + texto);
        }
    })
    .then((data) => {
        alert(data.mensagem || "Consulta salva com sucesso");

        pacienteInput.value = "";
        medicoInput.value = "";
        dataInput.value = "";
        horarioInput.value = "";

        carregarConsultas();
    })
    .catch((err) => {
        alert(err.message);
        console.error("Erro ao salvar consulta:", err);
    });
}

// EXCLUIR CONSULTA
function excluir(id) {
    fetch(API + "/api/consultas/" + id, {
        method: "DELETE",
        headers: {
            Authorization: localStorage.getItem("token")
        }
    })
    .then(async (res) => {
        const texto = await res.text();

        try {
            const data = JSON.parse(texto);

            if (!res.ok) {
                throw new Error(data.erro || data.mensagem || "Erro ao excluir consulta");
            }

            return data;
        } catch {
            throw new Error("Resposta inválida do servidor: " + texto);
        }
    })
    .then((data) => {
        alert(data.mensagem || "Consulta excluída com sucesso");
        carregarConsultas();
    })
    .catch((err) => {
        alert(err.message);
        console.error("Erro ao excluir consulta:", err);
    });
}

// INICIAR DASHBOARD
window.onload = () => {
    const caminho = window.location.pathname;

    if (caminho.includes("dashboard.html")) {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "index.html";
            return;
        }

        const usuarioNome = document.getElementById("usuarioNome");
        if (usuarioNome) {
            usuarioNome.innerText = "Usuário: " + (localStorage.getItem("nome") || "Usuário");
        }

        carregarConsultas();
    }
};