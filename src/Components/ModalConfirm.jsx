import Button from "./Button";
import Modal from "./Modal";

export default function ModalConfirm({open, onClose, title,onConfirm}){
    if(!open) return null;
    return(
        <>
            <Modal open={open} onClose={onClose}>
                <div className="flex flex-col justify-between gap-4 ">
                     <h2 className="text-xl font-semibold text-center">{title}</h2>
                     <div className="flex gap-4 justify-between">
                        <Button text="Cancelar" newClass="bg-red-400" onClick={onClose}/>
                        <Button text="Confirmar" onClick={onConfirm}/>
                     </div>
                </div>
            </Modal>
        </>
    )
}