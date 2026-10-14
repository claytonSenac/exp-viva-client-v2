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

async function getParticipanteById(id){
    const res = await fetch(apiUrl + "/participante/getById/"+id);
    return await res.json();
}

async function getAtividadesDisponiveis(id){
    const res = await fetch(apiUrl + "/atividade/disponiveis/"+id);
    return await res.json();
}


async function cancelarInscricao(id){
    const res = await fetch(apiUrl + "/inscricao/cancelar/"+id, {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
    });

    return await res.json();
}

async function inscreverAtividade({idAtividade,idParticipante}){
    const res = await fetch(apiUrl + "/inscricao/inscrever/", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({data:{idAtividade: idAtividade, idParticipante:idParticipante}})
    });

    return await res.json();
}

async function redefinirSenha(id){
    const res = await fetch(apiUrl + "/participante/redefinirSenha/"+id, {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
    });

    return await res.json();
}


export const service = {
    criarParticipante,
    editarParticipante,
    redefinirSenha,

    editarParticipanteAdmin,
    loginAdmin,
    loginParticipante,
    getAtividades,
    cancelarInscricao,
    getParticipantes,
    excluirAtividade,
    criarAtividade,
    inscreverAtividade,
    getAtividadesDisponiveis,
    editarAtividade,
    excluirParticipante,
    getParticipanteById
}