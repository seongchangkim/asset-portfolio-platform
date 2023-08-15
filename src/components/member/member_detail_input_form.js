const MemberDetailInputForm = ({label, id, inputType, value, onChange = null, isDisabled = false}) => {

    const onChangeValue = (event) => {
        onChange(event.target.value);
    }
    return (
        <div className="xl:w-1/3 lg:w-1/2 md:w-1/2 flex flex-col mb-6 mr-48">
            <label htmlFor={id} className="pb-2 text-sm font-bold text-gray-800">{label}</label>
            <input 
                tabIndex="0" 
                type={inputType} 
                id={id} 
                name={id} 
                required 
                className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm bg-transparent rounded text-sm focus:outline-none focus:border-indigo-700 placeholder-gray-500 text-gray-600 dark:text-gray-400" 
                placeholder="" 
                value={value}
                onChange={onChangeValue}
                disabled={isDisabled}
            />
        </div>
    );
}

export default MemberDetailInputForm; 