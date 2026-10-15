import Button from "./Button";

export default function Modal({open, onClose, title,children,newClass = ''}){
    if(!open) return null;
    return(
        <>
            <div className={"w-screen h-screen fixed top-0 left-0 z-50 bg-black/40 flex items-center justify-center " + newClass}>
                <div className="bg-white min-w-72 rounded flex flex-col gap-4 justify-between p-4">
                    <div className="flex justify-between gap-4">
                        {title && (
                            <h2 className="font-semibold text-xl">{title}</h2>
                        )}
                        <Button textColor="text-white" text="Fechar" newClass="bg-red-400" onClick={onClose}/>
                    </div>
                    {children}
                </div>
            </div>
        </>
    )
}