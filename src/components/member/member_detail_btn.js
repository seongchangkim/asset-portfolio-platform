const MemberDetailBtn = ({onClick = null, btnText, isEditing = true}) => {
    return (
        <button 
            role="button" 
            aria-label="Save form" 
            className={
                isEditing ?
                "focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 bg-indigo-700 focus:outline-none transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-6 py-2 text-sm mr-4"  : 
                "bg-gray-200 focus:outline-none transition duration-150 ease-in-out hover:bg-gray-300 rounded text-indigo-600 px-6 py-2 text-sm mr-4 focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
            }
            onClick={() => onClick()}
        >{btnText}</button>
    );
}

export default MemberDetailBtn;