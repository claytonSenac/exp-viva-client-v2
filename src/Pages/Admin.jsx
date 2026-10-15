import { useEffect, useState } from "react"
import { service } from "../service";
import Button from "../Components/Button";
import ModalConfirm from "../Components/ModalConfirm";
import { toast } from "react-toastify";
import Modal from "../Components/Modal";
import FormAtividade from "../Components/FormAtividade";
import FormParticipante from "../Components/FormParticipante";
import { AtividadeListItem } from "./Participante";

export default function AdminPage(){

    const [atividades, setAtividades] = useState([]);
    const [participantes, setParticipantes] = useState([]);

    const [modalConfirm, setModalConfirm] = useState({open:false,title:"", onConfirm:null});

    const [modalAtividade, setModalAtividade] = useState({open:false,initialData:null});
    const [detailsAtividade, setDetailsAtividade] = useState({open:false,a:null});
    const [modalParticipante, setModalParticipante] = useState({open:false,initialData:null,isAdmin: false});

    const [listAtividades, setListAtividades] = useState([]);
    const [filterAtividades, setFilterAtividades] = useState({showMore:false, filter:""});
    const [filterParticipante, setFilterParticipante] = useState({showMore:false, filter:""});
    const [listParticipantes, setListParticipantes] = useState([]);

    const [nextEvents, setNextEvents] = useState([]);
    const [saude,setSaude] = useState(null);

    async function loadData(){
        const [atividades,participantes,proximasAtividades,saude] = await Promise.all([
            service.getAtividades(),
            service.getParticipantes(),
            service.getNextAtividades(),
            service.getSaude()
        ]);

        setAtividades(atividades.data);
        setParticipantes(participantes.data);
        setNextEvents(proximasAtividades.data);
        setSaude(saude.data)
    };

    useEffect(() => {
        loadData();
    },[]);

    useEffect(() => {
        const filter = filterAtividades.filter.toLowerCase().trim();
        const mapped = atividades.filter(
            a=> a.nome.toLowerCase().trim().includes(filter) ||
            a.descricao.toLowerCase().trim().includes(filter) ||
            a.data.toLowerCase().trim().includes(filter) || 
            a.horario.toLowerCase().trim().includes(filter) 
        );
        setListAtividades(mapped)
    },[atividades,filterAtividades.filter]);

    useEffect(() => {
        const filter = filterParticipante.filter.toLowerCase().trim();
        const mapped = participantes.filter(
            a=> a.nome.toLowerCase().trim().includes(filter) ||
            a.email.toLowerCase().trim().includes(filter)
        );
        setListParticipantes(mapped)
    },[participantes,filterParticipante.filter]);

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

    async function handleRedefinirSenha(a){
        if(!a) return null;

        const res = await service.redefinirSenha(a.id);

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
        setModalAtividade({open:true,initialData:null});
    }

    function handleNewParticipante(){
        setModalParticipante({open:true,initialData:null,isAdmin: false});
    }



    return (<>
        <div className="w-full flex flex-col flex-1 bg-blue-900 items-center justify-center p-4 gap-4">
            <h1 className="text-center text-2xl font-semibold text-white m-4">Dashboard</h1>
            <div className="bg-white  max-w-11/12 w-full  grid grid-cols-1  rounded">
                <div className="bg-white w-full min-h-50 rounded">
                    <h2 className="text-2xl text-center font-semibold">Proximos Eventos:</h2>
                    <div className="w-full  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2 gap-4">
                        {nextEvents.map((a)=>(
                            <li className="w-full bg-blue-900 text-white list-none p-4 rounded min-h-32 flex flex-col justify-between gap-4">
                                <h2 className="text-center text-xl font-semibold">{a.nome}</h2>
                                <p className="text-white text-center">Vagas restantes / Total de vagas</p>
                                <p className="bg-white text-blue-900 w-fit p-2 rounded font-semibold mx-auto">{a.vagas_restantes} / {a.vagas}</p>
                                <p className="font-bold text-center">{a.data} as {a.horario}</p>
                            </li>
                        ))}
                    </div>
                </div>
                <div className="w-full min-h-50  bg-red  grid grid-cols-1 md:grid-cols-2 rounded-2xl">
                        
                    <div className=" text-black flex flex-col gap-4  font-semibold text-2xl items-center rounded-2xl p-4">
                        <h2>Total de Cadastros:</h2>
                        <div className="flex gap-4">
                            <h2 className="rounded bg-blue-900 text-white flex items-center p-4 h-24">Atividades: {saude?.atividades ?? '-'}</h2>
                            <h2 className="rounded bg-blue-900 text-white flex items-center p-4 h-24">Participantes: {saude?.participantes ?? '-'}</h2>
                        </div>
                    </div>
                    <div className="w-full h-full p-4 flex flex-col gap-4">
                        <h2 className="text-2xl text-center font-semibold">Atividade com menor aderencia:</h2>
                            <li className=" bg-blue-900 text-white list-none p-4 rounded flex  justify-around items-center gap-4 h-24">
                                <div>
                                    <p>Atividade:</p>
                                    <h2 className="text-center text-xl font-semibold">{saude?.atividade_menor_aprovacao.nome}</h2>
                                </div>
                                <div>
                                    <p>Vagas Preenchidas / Total de vagas:</p>
                                    <p className="bg-white text-blue-900 w-fit p-2 rounded font-semibold mx-auto">{saude?.atividade_menor_aprovacao.vagas - saude?.atividade_menor_aprovacao.vagas_restantes} / {saude?.atividade_menor_aprovacao.vagas}</p>
                                </div>
                            </li>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded max-w-11/12 w-full flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 w-full p-4 gap-4 h-full items-start">
                    <div className="flex flex-col gap-4 p-4 border-2 border-blue-400 rounded-2xl">
                        <div className="flex justify-between items-center flex-wrap">
                            <h2 className="font-semibold text-xl">Atividades</h2>
                            <Button newClass="bg-blue-900" text={filterAtividades.showMore ? "Ver Menos" : "Ver Mais"} onClick={() => {
                                setFilterAtividades((prev)=>({
                                    ...prev,
                                    showMore: !prev.showMore
                                }))
                            }}/>
                            <Button onClick={handleNewAtividade} text="Novo"/>
                        </div>
                        <input className="w-full border-2 rounded border-blue-400 px-4" placeholder="Filtre por nome, descrição,data e horario" type="text" value={filterAtividades.filter} onChange={(e) => {
                          setFilterAtividades((prev)=>({
                            ...prev,
                            filter: e.target.value
                          }))
                        }} />
                        <div className="grid w-full grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {listAtividades.slice(0, filterAtividades.showMore ? listAtividades.length : 3).map((a)=>(
                                <AtividadeItem a={a}  
                                handleDelete={() => {
                                  setModalConfirm({open:true,title:"Deseja Realmente excluir?", onConfirm:() => {
                                    handleDeleteAtividade(a)
                                  }})
                                }}
                                handleEdit={() => {
                                  setModalAtividade({open:true,initialData:a})
                                }}
                                handleDetails={() => {
                                  setDetailsAtividade({open:true,a:a})
                                }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 p-4 border-2 border-blue-400 rounded-2xl">
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold text-xl">Participantes</h2>
                              <Button newClass="bg-blue-900" text={filterParticipante.showMore ? "Ver Menos" : "Ver Mais"} onClick={() => {
                                setFilterParticipante((prev)=>({
                                    ...prev,
                                    showMore: !prev.showMore
                                }))
                            }}/>
                            <Button onClick={handleNewParticipante} text="Novo"/>
                        </div>
                        <input className="w-full border-2 rounded border-blue-400 px-4" placeholder="Filtre por nome, descrição,data e horario" type="text" value={filterParticipante.filter} onChange={(e) => {
                          setFilterParticipante((prev)=>({
                            ...prev,
                            filter: e.target.value
                          }))
                        }} />
                        <div className="grid w-full grid-cols-1 xl:grid-cols-2  gap-4">
                            {listParticipantes.slice(0, filterParticipante.showMore ? listParticipantes.length : 2).map((a)=>(
                                <ParticipanteItem a={a}  
                                    handleDelete={() => {
                                        setModalConfirm({open:true,title:"Deseja Realmente excluir?", onConfirm:() => {
                                        handleDeleteParticipante(a)
                                        }})
                                    }}
                                    handleEdit={() => {
                                        setModalParticipante({open:true,initialData:a,isAdmin:true})
                                    }}
                                    handleRedefinirSenha={() => {
                                      setModalConfirm({open:true, title: "Deseja redefinir a senha?", onConfirm:() => {
                                        handleRedefinirSenha(a)
                                      }})
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
            <DetailsAtividade open={detailsAtividade.open} a={detailsAtividade.a} onClose={async () => {
              setDetailsAtividade({open:false, a:null});
              await loadData()
            }} />
        </div>
    </>)
}

export function AtividadeItem({a,handleDelete,handleEdit,handleDetails}){
    return (
        <>
            <li className="bg-blue-900 text-white list-none p-4 rounded  flex flex-col justify-between gap-4">
                <h2 className="text-center text-xl font-semibold">{a.nome}</h2>
                <p className="text-white text-center">Vagas / Total vagas:</p>
                <p className="bg-white text-blue-900 w-fit p-2 rounded font-semibold mx-auto">{a.vagas_restantes} / {a.vagas}</p>
                <p>{a.descricao}</p>
                <p className="text-center font-semibold">{a.data} as {a.horario}</p>
                <div className="flex flex-col gap-4">
                    <Button text="Editar" newClass="bg-yellow-400 font-semibold" onClick={handleEdit}/>
                    <Button text="Detalhes" newClass="font-semibold" onClick={handleDetails}/>
                    <Button text="Excluir" newClass="bg-red-400 font-semibold" onClick={handleDelete}/>
                </div>
            </li>
        </>
    )
}


function ParticipanteItem({a,handleDelete,handleEdit,handleRedefinirSenha}){
    return (
        <>
            <li className="bg-blue-900 text-white list-none p-4 rounded  flex flex-col justify-between gap-4">
                <h2 className="text-center text-xl font-semibold">{a.nome}</h2>
                <p><strong>Nome:</strong> {a.nome}</p>
                <p><strong>Email: </strong>{a.email}</p>
                <div className="flex flex-col gap-4">
                    <Button text="Editar" newClass="bg-yellow-400 font-semibold" onClick={handleEdit}/>
                    <Button text="Redefinir Senha" newClass="font-semibold text-white bg-black " onClick={handleRedefinirSenha}/>
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

function DetailsAtividade({open,a,onClose}){
    if(!a || !open) return null;
    const [modalConfirm, setModalConfirm] = useState({open:false,title:"", onConfirm:null});

    async function handleCancelarInscricao(id){
        const res = await service.cancelarInscricao(id);

        if(!res || res.code !== 200 && res.code !== 201){
            toast.error(res.text ?? "Erro ao buscar detalhes");
            return;
        }

        toast.info(res.text);
         onClose();
        setModalConfirm({open:false,title:"", onConfirm:null});
        return;
    }

    return(<>
        <Modal open={true} onClose={onClose} title={"Detalhes da Atividade"} newClass="z-40">
            <div className="w-full p-4 flex flex-col gap-4">
                <h2><span className="font-bold">Nome: </span>{a.nome}</h2>
                <p className="wrap-break-word">{a.descricao}</p>
                <h2><strong>Vagas:</strong> {a.vagas_restantes} / {a.vagas}</h2>
                <h2><strong>Horario: </strong>{a.horario}</h2>
                <div className="p-4 border-2 border-blue-400 rounded bg-gray-200 flex flex-col gap-4">
                    <h3 className="font-semibold">Inscrições:</h3>
                    <div className="flex flex-col gap-4 ">
                        {a.atividade_participante.map((i)=>(
                            <li className="list-none flex bg-white p-2 items-center rounded justify-between">
                                <h2>{i.participante.nome}</h2>
                                <Button  text="Cancelar" onClick={async () => {
                                   setModalConfirm({open:true, title: "Cancelar Inscricao", onConfirm: () => {
                                         handleCancelarInscricao(i.id)
                                    }})
                                }} newClass="bg-red-400"/>
                            </li>
                        ))}
                    </div>
                </div>
            </div>
            <ModalConfirm onClose={() => {
              setModalConfirm({open:false, onConfirm:() => {
                
              }, title:""})
            }} onConfirm={modalConfirm.onConfirm} open={modalConfirm.open} title={modalConfirm.title}/>
        </Modal>
    </>)
}