const apiUrl = "http://localhost:3000";

async function criarParticipante(form){
    const res = await fetch(apiUrl + "/participante", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify({data:form})
    });

    return await res.json();
}

async function criarAtividade(form){
    const res = await fetch(apiUrl + "/atividade", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify({data:form})
    });

    return await res.json();
}

async function loginAdmin(form){
    const res = await fetch(apiUrl + "/auth/login", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify({data:form})
    });

    return await res.json();
}

async function loginParticipante(form){
    const res = await fetch(apiUrl + "/participante/login", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify({data:form})
    });

    return await res.json();
}

async function editarParticipante(form){
    const res = await fetch(apiUrl + "/participante/"+form.id, {
        method: "PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify({data:form})
    });

    return await res.json();
}

async function editarAtividade(form){
    const res = await fetch(apiUrl + "/atividade/"+form.id, {
        method: "PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify({data:form})
    });

    return await res.json();
}

async function editarParticipanteAdmin(form){
    const res = await fetch(apiUrl + "/participante/admin/"+form.id, {
        method: "PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify({data:form})
    });

    return await res.json();
}

async function excluirAtividade(id){
    const res = await fetch(apiUrl + "/atividade/"+id, {
        method: "DELETE",
        headers:{
            "Content-Type": "application/json"
        },
    });

    return await res.json();
}

async function excluirParticipante(id){
    const res = await fetch(apiUrl + "/participante/"+id, {
        method: "DELETE",
        headers:{
            "Content-Type": "application/json"
        },
    });

    return await res.json();
}


async function getAtividades(){
    const res = await fetch(apiUrl + "/atividade");
    return await res.json();
}

async function getParticipantes(){
    const res = await fetch(apiUrl + "/participante");
    return await res.json();
}


export const service = {
    criarParticipante,
    editarParticipante,
    editarParticipanteAdmin,
    loginAdmin,
    loginParticipante,
    getAtividades,
    getParticipantes,
    excluirAtividade,
    criarAtividade,
    editarAtividade,
    excluirParticipante
}