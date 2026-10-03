import { useNavigate } from "react-router-dom";
import FormParticipante from "../Components/FormParticipante";

export default function Home(){
    const nav = useNavigate();

    return(
        <>
            <div className="w-full flex flex-1 flex-col bg-blue-900 items-center justify-center">
                <div className="bg-white rounded max-w-8xl w-11/12 grid grid-cols-1 md:grid-cols-2 p-4">
                    <div className="w-full flex flex-col items-center justify-center">
                        <FormParticipante isAdmin={false} initialData={null} onSaved={(e) => {
                          nav("/participante/" + e.id);
                        }}/>
                    </div>
                    <div className="">
                        <img src="./imagens_Coronel_Fabriciano_01.png" alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}