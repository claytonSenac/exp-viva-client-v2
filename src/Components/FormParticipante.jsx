import { useEffect, useState } from "react";
import { service } from "../service";
import { toast } from "react-toastify";
import Button from "./Button";

export default function FormParticipante({isAdmin = false, initialData = null,onSaved}){
    const [form,setForm] = useState({id:"",nome:"",email:"",senha:"",confirmSenha:""});
    const [showSenha,setShowSenha] = useState(false);

    function handleInputChange(e){
        const name = e.target.name;
        const value = e.target.value;
        console.log(name,value)
        setForm((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    useEffect(() => {
      if(initialData){
        setForm({
            id: initialData.id,
            nome:initialData.nome,
            email: initialData.email,
            senha: "",
            confirmSenha: ""
        })
      }
    },[initialData])

    async function handleSave(e){
        e.preventDefault();

        let res = null;
        if(form.nome.length < 3){
            toast.error("O nome deve conter no minimo 3 caracteres")
            return;
        }

        if(!initialData && !isAdmin){
            if(form.senha !== form.confirmSenha){
                toast.error("As senhas não batem");
                return;
            }

            res = await service.criarParticipante(form);
        }else if(isAdmin){
            res = await service.editarParticipanteAdmin(form);
        }else{
            let body = form;

            if(form.confirmSenha != ""){
                body.novaSenha = form.confirmSenha
            }

            res = await service.editarParticipante(body);
        }

        if(res.code !== 200 &&  res.code !== 201){
            toast.error(res.text || "Erro ao salvar");
            return;
        }

        toast.info(res.text);
        onSaved(res.data)
        resetForm();
        return;        
    }

    function resetForm(){
        setForm({id:"",nome:"",email:"",senha:"",confirmSenha:""});
    }

    return(
        <>
            <form className="flex flex-col gap-4 justify-between max-w-100 border-2 border-blue-400 rounded p-4 shadow-lg bg-white">
                <h2 className="font-semibold text-xl">Participante:</h2>
                <section className="flex gap-4 flex-wrap justify-between">
                    <label htmlFor="nome">Nome:</label>
                    <InputForm name={"nome"} type={"text"} value={form.nome} onChange={handleInputChange} />
                </section>
                <section className="flex gap-4 flex-wrap justify-between">
                    <label htmlFor="email">Email:</label>
                    <InputForm name={"email"} type={"email"} value={form.email} onChange={handleInputChange} />
                </section>
                {!isAdmin && (
                    <>
                        <section className="flex gap-4 flex-wrap justify-between">
                            <label htmlFor="senha">Senha:</label>
                            <InputForm name={"senha"} type={showSenha ? "text" : "password"} value={form.senha} onChange={handleInputChange}/>
                        </section>
                        <section className="flex gap-4 flex-wrap justify-between">
                            <label htmlFor="confirmSenha">{initialData ? "Nova Senha:" : "Confirme Senha:"}</label>
                            <InputForm name={"confirmSenha"} type={showSenha ? "text" : "password"} value={form.confirmSenha} onChange={handleInputChange} />                
                        </section>
                        
                        <p className="font-semibold cursor-pointer" onClick={
                            () => {
                            setShowSenha(!showSenha);
                            }
                        }>{showSenha ? "Ocultar Senha" : "Mostrar Senha"}</p>
                    </>
                )}

                <Button text="Salvar" onClick={handleSave} key={'1'}/>
            </form>
        </>
    )
}


export function InputForm({type,name,value,onChange,addClass= ''}){
    return(
        <>
            <input type={type} name={name} value={value} onChange={onChange} className={` border px-2 rounded ${addClass}`}/>
        </>
    )
}