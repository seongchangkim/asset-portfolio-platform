const MemberInputForm = ({ inputState, setInputState ,label, type, validation, errors }) => {
    const onChange = (event) => setInputState(event.target.value);

    return (
        <div>
            <label htmlFor={type} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
            <div className="mt-2">
                <input 
                    id={type} 
                    name={type} 
                    type={type === "email" ? "email" : (type === "password" ? "password" : "text")} 
                    className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={inputState}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}

export default MemberInputForm;