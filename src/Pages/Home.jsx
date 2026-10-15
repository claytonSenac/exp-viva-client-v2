import { useNavigate } from "react-router-dom";
import FormParticipante from "../Components/FormParticipante";

export default function Home(){
    const nav = useNavigate();

    return(
        <>
            <div className="w-full flex flex-1 flex-col bg-blue-900 items-center justify-center">
                <div className="bg-white md:rounded-2xl rounded-none max-w-7xl w-full grid grid-cols-1 md:grid-cols-[1fr_2fr]   justify-center">
                    <div className="w-full flex flex-col items-center justify-center gap-4 bg-blue-400 sm:rounded-tl-2xl sm:rounded-bl-2 rounded-bl-2xl p-4 rounded-none shadow">
                        <h1 className="font-semibold text-2xl text-white">Seja um participante:</h1>
                        <FormParticipante isAdmin={false} initialData={null} onSaved={(e) => {
                          nav("/participante/" + e.id);
                        }}/>
                    </div>
                    <div className="p-2 hidden md:flex  flex-col justify-center items-center">
                        <img className="min-h-32" src="./imagens_Coronel_Fabriciano_01.png" alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}