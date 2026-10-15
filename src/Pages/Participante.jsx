import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { service } from "../service";
import { toast } from "react-toastify";
import FormParticipante from "../Components/FormParticipante";
import Button from "../Components/Button";
import ModalConfirm from "../Components/ModalConfirm";

export default function ParticipantePage(){
    const {id} = useParams();
    const [p,setP] = useState(null);
    const [atividadesDisponiveis,setAtividadesDisponiveis] = useState([]);
    const [modalConfirm, setModalConfirm] = useState({open:false,title:"", onConfirm:null});


    useEffect(() => {
        getDetails();
    }, [id]);

    async function getDetails(){
        const res = await service.getParticipanteById(id);
        if(!res || res.code !== 200 && res.code !== 201){
            toast.error(res.text ?? "Erro ao buscar detalhes");
            return;
        }
        await getAtividadesDisponiveis(id);
        setP(res.data);
    }

    async function getAtividadesDisponiveis(id){
        const res = await service.getAtividadesDisponiveis(id);
        if(!res || res.code !== 200 && res.code !== 201){
            toast.error(res.text ?? "Erro ao buscar atividades");
            return;
        }

        setAtividadesDisponiveis(res.data);
        return;
    }

    function resetModalConfirm(){
        setModalConfirm({open:false,onConfirm:null,title:""});
    }

    async function handleCancelarInscricao(id){
        const res = await service.cancelarInscricao(id);

        if(!res || res.code !== 200 && res.code !== 201){
            toast.error(res.text ?? "Erro ao buscar detalhes");
            return;
        }

        toast.info(res.text);
        await getDetails();
        resetModalConfirm()
        return;
    }

    async function handleInscrever(idAtividade){
        const res = await service.inscreverAtividade({idAtividade:idAtividade,idParticipante:p.id});

        if(!res || res.code !== 200 && res.code !== 201){
            toast.error(res.text ?? "Erro ao buscar detalhes");
            return;
        }

        toast.info(res.text);
        await getDetails();
        resetModalConfirm()
        return;
    }

    return (
        <>
            <div className="w-full flex flex-col flex-1 bg-blue-900 items-center justify-center p-4">
                <div className="bg-white rounded max-w-11/12 w-full flex flex-col p-4 gap-4">
                    <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4">
                        <div className="w-full">
                            <FormParticipante  isAdmin={false} initialData={p} onSaved={getDetails}/>
                        </div>
                        <div className="w-full border-2 border-blue-400 rounded p-4">
                            <h2 className="font-semibold text-center text-2xl">Inscrições:</h2>
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {p?.atividade_participante.map((i)=>(
                                    <li className="w-full bg-blue-900 min-h-48 justify-between text-white p-4 rounded flex flex-col gap-4">
                                        <p className="text-center">{i.atividade.nome}</p>
                                        <p className="font-semibold text-center">{i.atividade.data} as {i.atividade.horario}</p>
                                        <Button text="Cancelar" newClass="bg-red-400" onClick={() => {
                                          setModalConfirm({open:true,onConfirm: async () => {
                                            await handleCancelarInscricao(i.id)
                                          }, title: "Cancelar Inscrição"})
                                        }}/>
                                    </li>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="w-full p-4 border-2 border-blue-400 rounded gap-4 flex flex-col">
                        <h2 className="font-semibold text-center text-2xl">Proximas Atividades:</h2>
                        <div className="grid   gap-4 w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {atividadesDisponiveis.map((a)=>(
                                <AtividadeListItem a={a}  
                                handleInscrever={() => {
                                  setModalConfirm({open:true,title:"Realizar Inscrição", onConfirm: async() => {
                                    await handleInscrever(a.id)
                                  }})
                                }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <ModalConfirm onClose={resetModalConfirm} onConfirm={modalConfirm.onConfirm} open={modalConfirm.open} title={modalConfirm.title}/>
            </div>
        </>
    )   
}

export function AtividadeListItem({a,handleInscrever}){
    return (
        <>
            <li className="w-full bg-blue-900 text-white list-none p-4 rounded min-h-32 flex flex-col justify-between gap-4">
                <h2 className="text-center text-xl font-semibold">{a.nome}</h2>
                <p className="bg-white text-blue-900 w-fit p-2 rounded font-semibold mx-auto">{a.vagas_restantes} / {a.vagas}</p>
                <p>{a.descricao}</p>
                <p>{a.data} as {a.horario}</p>
                <div className="flex flex-col gap-4">
                    <Button text="Inscrever" newClass="bg-blue-400 font-semibold" onClick={handleInscrever}/>
                </div>
            </li>
        </>
    )
}