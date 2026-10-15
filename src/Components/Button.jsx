export default function Button({
    text = "Salvar",
    newClass = "",
    onClick,
    textColor = "text-white",
    hoverEffect = "hover:scale-[1.02]"
}) {
    return (
        <button
            className={`p-2 bg-blue-400 rounded font-semibold cursor-pointer ${newClass} ${textColor} transition-transform duration-200 ${hoverEffect}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
}