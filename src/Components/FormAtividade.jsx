import { useEffect, useState } from "react";
import { service } from "../service";
import { toast } from "react-toastify";
import Button from "./Button";

export default function FormAtividade({ initialData = null,onSaved}){
    const [form,setForm] = useState({id:"",nome:"",descricao:"",horario:"13:30",vagas:0,data:""});

    function handleInputChange(e){
        const name = e.target.name;
        const value = e.target.value;

        setForm((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    async function handleSave(e){
        e.preventDefault();

        let res = null;
        if(form.nome.length < 3){
            toast.error("O nome deve conter no minimo 3 caracteres")
            return;
        }

        if(!initialData){
            res = await service.criarAtividade(form);
        }else{
            res = await service.editarAtividade(form);
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
        setForm({id:"",nome:"",descricao:"",horario:"13:30",vagas:0,data:""});
    }

    useEffect(() => {
        if(initialData){
            setForm({
                id: initialData.id,
                data: initialData.dataInput ?? "",
                descricao: initialData.descricao ?? "",
                horario: initialData.horario ?? "",
                nome: initialData.nome ?? "",
                vagas: initialData.vagas ?? 0
            })
        }
    },[initialData])

    return(
        <>
            <form className="flex flex-col gap-4 justify-between max-w-100 border-2 border-blue-400 rounded p-4">
                <h2 className="font-semibold text-xl">Atividade:</h2>
                <section className="flex gap-4 flex-wrap justify-between">
                    <label htmlFor="nome">Nome:</label>
                    <InputForm name={"nome"} type={"text"} value={form.nome} onChange={handleInputChange} />
                </section>
                <section className="flex gap-4 flex-wrap justify-between">
                    <label htmlFor="descricao">Descricao:</label>
                    <InputForm name={"descricao"} type={"text"} value={form.descricao} onChange={handleInputChange} />
                </section>
                <section className="flex gap-4 flex-wrap justify-between">
                    <label htmlFor="vagas">Data:</label>
                    <InputForm name={"data"} type={"date"} value={form.data} onChange={handleInputChange}/>
                </section>
                <section className="flex gap-4 flex-wrap justify-between">
                    <label htmlFor="horario">horario:</label>
                    <InputForm name={"horario"} type={"text"} value={form.horario} onChange={handleInputChange}/>
                </section>
                <section className="flex gap-4 flex-wrap justify-between">
                    <label htmlFor="vagas">vagas:</label>
                    <InputForm name={"vagas"} type={"number"} value={form.vagas} onChange={handleInputChange}/>
                </section>

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