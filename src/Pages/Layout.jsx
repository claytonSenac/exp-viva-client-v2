import { Outlet, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Button from "../Components/Button";
import Modal from "../Components/Modal";
import { InputForm } from "../Components/FormParticipante";
import { useState } from "react";
import { service } from "../service";

export default function Layout(){
    const [modalLogin, setModalLogin] = useState({open:false,isAdmin:false});
    const nav = useNavigate();

    function resetLoginModal(){
        setModalLogin({open:false,isAdmin:false});
    }
    
    return(
        <>
            <div className="w-full min-h-dvh flex flex-col flex-1">
                <header className="min-h-14 bg-blue-400 w-full grid grid-cols-1 sm:grid-cols-2 flex-wrap p-4">
                    <div className="p-2 flex sm:justify-start justify-center items-center w-full">
                        <img className="transition hover:scale-105 cursor-pointer  h-14" src="/imagens_Coronel_Fabriciano_02.png" onClick={() => {
                          nav("/")
                        }} alt="logo exp viva" />
                    </div>
                    <div className="flex w-full gap-4  justify-center sm:justify-end flex-wrap items-center">
                        <Button onClick={() => {
                          setModalLogin({open:true,isAdmin:true})
                        }} text="Painel Admin" newClass="bg-white font-semibold" textColor="text-blue-900"/>
                        <Button onClick={() => {
                          setModalLogin({open:true,isAdmin:false})
                        }}  text="Painel Participante" newClass="bg-blue-900 text-white font-semibold"/>
                    </div>
                </header>
                <main className="flex flex-1 w-full">
                    <Outlet/>
                </main>
                <Login  isAdmin={modalLogin.isAdmin} onClose={resetLoginModal} open={modalLogin.open}/>
                <ToastContainer/>
            </div>
        </>
    )
}

function Login({isAdmin,open,onClose}){
    const [form,setForm] = useState({email:"", senha:"",showSenha:false});
    const nav = useNavigate();

    function resetForm(){
        setForm({email:"", senha:"",showSenha:false});
    }

    function handleInputChange(e){
        const name = e.target.name;
        const value = e.target.value;
        console.log(name,value)
        setForm((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    async function handleSave(){
        let res = null;

        if(isAdmin){
            res = await service.loginAdmin(form) 
        }else{
            res = await service.loginParticipante(form);
        }

        if(res.code !== 200 && res.code !== 201 || !res){
            toast.error(res.text ?? "Erro no Login");
            return;
        }

        if(isAdmin){
            nav("/admin/"+res.data.id);
        }else{
            nav("/participante/"+res.data.id);
        }

        resetForm();
        onClose()
        return;
    }

    
    return (
        <>
            <Modal open={open} title={isAdmin  ?"Login Admin":  "Login Participante"} onClose={onClose}>
                <div className="p-4 flex flex-col gap-4 ">
                    <section className="flex gap-4 flex-wrap justify-between">
                        <label htmlFor="email">Email:</label>
                        <InputForm name={"email"} type={"email"} value={form.email} onChange={handleInputChange} />
                    </section>
                    <section className="flex gap-4 flex-wrap justify-between">
                        <label htmlFor="senha">Senha:</label>
                        <InputForm name={"senha"} type={form.showSenha ? "text" : "password"} value={form.senha} onChange={handleInputChange}/>
                    </section>
                    
                    <p className="font-semibold cursor-pointer" onClick={
                        () => {
                            setForm((prev)=>({
                                ...prev,
                                showSenha: !prev.showSenha
                            }));
                        }
                    }>{form.showSenha ? "Ocultar Senha" : "Mostrar Senha"}</p>
    
                    <Button text="Salvar" onClick={handleSave}  newClass="text-white" />
                </div>
            </Modal>
        </>
    )
}