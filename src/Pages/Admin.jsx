import { useEffect, useState } from "react"
import { service } from "../service";
import Button from "../Components/Button";
import ModalConfirm from "../Components/ModalConfirm";
import { toast } from "react-toastify";
import Modal from "../Components/Modal";
import FormAtividade from "../Components/FormAtividade";
import FormParticipante from "../Components/FormParticipante";

export default function AdminPage(){

    const [atividades, setAtividades] = useState([]);
    const [participantes, setParticipantes] = useState([]);

    const [modalConfirm, setModalConfirm] = useState({open:false,title:"", onConfirm:null});

    const [modalAtividade, setModalAtividade] = useState({open:false,initialData:null});
    const [modalParticipante, setModalParticipante] = useState({open:false,initialData:null,isAdmin: false});

    async function loadData(){
        const [atividades,participantes] = await Promise.all([
            service.getAtividades(),
            service.getParticipantes()
        ]);

        setAtividades(atividades.data);
        setParticipantes(participantes.data);
    };

    useEffect(() => {
        loadData();
    },[]);

    async function handleDeleteAtividade(a){
        if(!a) return null;

        const res = await service.excluirAtividade(a.id);

        if(!res || res.code !== 200 && res.code !== 201){
            toast.error(res.text ?? "Erro ao excluir");
            resetModalConfirm()
            return;
        }

        toast.success(res.text);
        await loadData();
        resetModalConfirm()
        return;
    }

    async function handleDeleteParticipante(a){
        if(!a) return null;

        const res = await service.excluirParticipante(a.id);

        if(!res || res.code !== 200 && res.code !== 201){
            toast.error(res.text ?? "Erro ao excluir");
            resetModalConfirm()
            return;
        }

        toast.success(res.text);
        await loadData();
        resetModalConfirm()
        return;
    }

    function resetModalConfirm(){
        setModalConfirm({open:false,onConfirm:null,title:""});
    }

    function handleNewAtividade(){
        setModalAtividade({open:true,initialData:null})
    }

    function handleNewParticipante(){
        setModalParticipante({open:true,initialData:null,isAdmin: false})
    }

    return (<>
        <div className="w-full flex flex-col flex-1 bg-blue-900 items-center justify-center p-4">
            <div className="bg-white rounded max-w-11/12 w-full flex flex-col">
                <h1>Painel Admin</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 w-full p-4 gap-4">
                    <div className="flex flex-col gap-4 p-4 border-2 border-blue-400 rounded-2xl">
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold text-xl">Atividades</h2>
                            <Button onClick={handleNewAtividade} text="Novo"/>
                        </div>
                        <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {atividades.map((a)=>(
                                <AtividadeItem a={a}  
                                handleDelete={() => {
                                  setModalConfirm({open:true,title:"Deseja Realmente excluir?", onConfirm:() => {
                                    handleDeleteAtividade(a)
                                  }})
                                }}
                                handleEdit={() => {
                                  setModalAtividade({open:true,initialData:a})
                                }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 p-4 border-2 border-blue-400 rounded-2xl">
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold text-xl">Participantes</h2>
                            <Button onClick={handleNewParticipante} text="Novo"/>
                        </div>
                        <div className="grid w-full grid-cols-1 md:grid-cols-2  gap-4">
                            {participantes.map((a)=>(
                                <ParticipanteItem a={a}  
                                    handleDelete={() => {
                                        setModalConfirm({open:true,title:"Deseja Realmente excluir?", onConfirm:() => {
                                        handleDeleteParticipante(a)
                                        }})
                                    }}
                                    handleEdit={() => {
                                        setModalParticipante({open:true,initialData:a,isAdmin:true})
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <ModalAtividade initialData={modalAtividade.initialData} open={modalAtividade.open} 
                onSaved={() => {
                loadData();
                setModalAtividade({open:false,initialData:null})
                }} 
                onClose={() => {
                setModalAtividade({open:false,initialData:null})
                }}
            />

            <ModalParticipante  initialData={modalParticipante.initialData} open={modalParticipante.open} isAdmin={modalParticipante.isAdmin} 
                onSaved={() => {
                loadData();
                setModalParticipante({open:false,initialData:null,isAdmin:false})
                }} 
                onClose={() => {
                setModalParticipante({open:false,initialData:null,isAdmin:false})
                }}
            />


            <ModalConfirm onClose={() => {
                    setModalConfirm({open:false,title:"", onConfirm:null});
                }}
                onConfirm={modalConfirm.onConfirm}
                title={modalConfirm.title}
                open={modalConfirm.open}
            />
        </div>
    </>)
}

function AtividadeItem({a,handleDelete,handleEdit}){
    return (
        <>
            <li className="bg-blue-900 text-white list-none p-4 rounded  flex flex-col justify-between gap-4">
                <h2 className="text-center text-xl font-semibold">{a.nome}</h2>
                <p className="bg-white text-blue-900 w-fit p-2 rounded font-semibold mx-auto">{a.vagas_restantes} / {a.vagas}</p>
                <p>{a.descricao}</p>
                <p>{a.data} as {a.horario}</p>
                <div className="flex flex-col gap-4">
                    <Button text="Editar" newClass="bg-yellow-400 font-semibold" onClick={handleEdit}/>
                    <Button text="Detalhes" newClass="font-semibold" onClick={() => {
                      alert("Em desenvolvimento MODULO D")
                    }}/>
                    <Button text="Excluir" newClass="bg-red-400 font-semibold" onClick={handleDelete}/>
                </div>
            </li>
        </>
    )
}


function ParticipanteItem({a,handleDelete,handleEdit}){
    return (
        <>
            <li className="bg-blue-900 text-white list-none p-4 rounded  flex flex-col justify-between gap-4">
                <h2 className="text-center text-xl font-semibold">{a.nome}</h2>
                <p>Email: {a.email}</p>
                <div className="flex flex-col gap-4">
                    <Button text="Editar" newClass="bg-yellow-400 font-semibold" onClick={handleEdit}/>
                    <Button text="Redefinir Senha" newClass="font-semibold text-white bg-black " onClick={() => {
                      alert("Em desenvolvimento MODULO D")
                    }}/>
                    <Button text="Excluir" newClass="bg-red-400 font-semibold" onClick={handleDelete}/>
                </div>
            </li>
        </>
    )
}

function ModalAtividade({open,initialData,onSaved,onClose}){
    return (
        <>
            <Modal open={open} title={initialData ? "Editar Atividade" : "Nova Atividade"} onClose={onClose}>
                <FormAtividade onSaved={onSaved} initialData={initialData}/>
            </Modal>
        </>
    )
}

function ModalParticipante({open,initialData,onSaved,onClose,isAdmin}){
    return (
        <>
            <Modal open={open} title={initialData ? "Editar Participante" : "Novo Participante"} onClose={onClose}>
                <FormParticipante isAdmin={isAdmin} onSaved={onSaved} initialData={initialData}/>
            </Modal>
        </>
    )
}