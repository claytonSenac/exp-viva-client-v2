export default function Button({text = "Salvar",newClass= '',onClick}){
    return (
        <>
            <button className={"p-2 bg-blue-400 rounded  cursor-pointer "+ newClass}
                onClick={onClick}
            >{text}</button>
        </>
    )
}