function agendar() {
    const paciente = document.getElementById("paciente").value;
    const medico = document.getElementById("medico").value;
    const data = document.getElementById("data").value;
    const horario = document.getElementById("horario").value;
    const url = editandoId 
        ? `http://localhost:3000/api/consultas/${editandoId}` 
        : "http://localhost:3000/api/consultas";

    const method = editandoId ? "PUT" : "POST";

    fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paciente, medico, data, horario })
})
    .then(res => res.json())
    .then(data => {
        alert(data.mensagem);
        carregarConsultas(); // 🔥 atualiza lista
    })
    .catch(err => console.error(err));
}

function carregarConsultas() {
    fetch("http://localhost:3000/api/consultas")
    .then(res => res.json())
    .then(dados => {
        const tabela = document.getElementById("lista");
        tabela.innerHTML = "";

        dados.forEach(c => {
            tabela.innerHTML += `
<tr>
    <td>${c.paciente}</td>
    <td>${c.medico}</td>
    <td>${c.data.split("T")[0]}</td>
    <td>${c.horario}</td>
    <td>
        <button class="btn-edit" onclick="editar(${c.id})">Editar</button>
        <button class="btn-delete" onclick="excluir(${c.id})">Excluir</button>
    </td>
</tr>
`;
        });
    })
    .catch(err => console.error(err));
}

function excluir(id) {
    fetch(`http://localhost:3000/api/consultas/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        alert("Excluído com sucesso");
        carregarConsultas();
    });
}

let editandoId = null;

function editar(id) {
    editandoId = id;

    fetch("http://localhost:3000/api/consultas")
    .then(res => res.json())
    .then(dados => {
        const consulta = dados.find(c => c.id == id);

        document.getElementById("paciente").value = consulta.paciente;
        document.getElementById("medico").value = consulta.medico;
        document.getElementById("data").value = consulta.data.split("T")[0];
        document.getElementById("horario").value = consulta.horario;
    });
}

// 🔥 carrega ao abrir a página
window.onload = carregarConsultas;