const API = "medschedule-production-b719.up.railway.app";

function login() {
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");

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
        const data = await res.json();
        if (!res.ok) throw new Error(data.erro || "Erro no login");
        return data;
    })
    .then((data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("nome", data.nome);
        window.location.href = "dashboard.html";
    })
    .catch((err) => alert(err.message));
}

function cadastrar() {
    const nomeInput = document.getElementById("nome");
    const emailCadastroInput = document.getElementById("emailCadastro");
    const senhaCadastroInput = document.getElementById("senhaCadastro");

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
        const data = await res.json();
        if (!res.ok) throw new Error(data.erro || "Erro no cadastro");
        return data;
    })
    .then((data) => {
        alert(data.mensagem);
        nomeInput.value = "";
        emailCadastroInput.value = "";
        senhaCadastroInput.value = "";
    })
    .catch((err) => alert(err.message));
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

function carregarConsultas() {
    const lista = document.getElementById("lista");
    if (!lista) return;

    fetch(API + "/api/consultas", {
        headers: {
            Authorization: localStorage.getItem("token")
        }
    })
    .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.erro || "Erro ao carregar consultas");
        return data;
    })
    .then((dados) => {
        lista.innerHTML = "";

        dados.forEach((c) => {
            const dataFormatada = new Date(c.data).toISOString().split("T")[0];

            lista.innerHTML += `
                <tr>
                    <td>${c.paciente}</td>
                    <td>${c.medico}</td>
                    <td>${dataFormatada}</td>
                    <td>${c.horario}</td>
                    <td><button onclick="excluir(${c.id})">X</button></td>
                </tr>
            `;
        });
    })
    .catch((err) => alert(err.message));
}

function agendar() {
    const pacienteInput = document.getElementById("paciente");
    const medicoInput = document.getElementById("medico");
    const dataInput = document.getElementById("data");
    const horarioInput = document.getElementById("horario");

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
        const data = await res.json();
        if (!res.ok) throw new Error(data.erro || data.mensagem || "Erro ao salvar");
        return data;
    })
    .then(() => {
        pacienteInput.value = "";
        medicoInput.value = "";
        dataInput.value = "";
        horarioInput.value = "";
        carregarConsultas();
    })
    .catch((err) => alert(err.message));
}

function excluir(id) {
    fetch(API + "/api/consultas/" + id, {
        method: "DELETE",
        headers: {
            Authorization: localStorage.getItem("token")
        }
    })
    .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.erro || "Erro ao excluir");
        return data;
    })
    .then(() => carregarConsultas())
    .catch((err) => alert(err.message));
}

window.onload = () => {
    if (window.location.pathname.includes("dashboard.html")) {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "login.html";
            return;
        }

        const usuarioNome = document.getElementById("usuarioNome");
        if (usuarioNome) {
            usuarioNome.innerText = "Usuário: " + (localStorage.getItem("nome") || "Usuário");
        }

        carregarConsultas();
    }
};