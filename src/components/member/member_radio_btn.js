const MemberRadioBtn = ({value, onChange, stateValue}) => {

    const onChangeValue = (event) => {
        onChange(event.target.value);
    }

    return (
        <div className="flex item-center gap-x-1 mr-2">
            <input 
                tabIndex="0" 
                type="radio" 
                id="authRole" 
                name="authRole" 
                required 
                className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm bg-transparent rounded text-sm focus:outline-none focus:border-indigo-700 placeholder-gray-500 text-gray-600 dark:text-gray-400" 
                value={value}
                checked={stateValue === value}
                onChange={onChangeValue}
            />
            <div className="text-base font-medium text-gray-900">{value}</div>
        </div>
    );
}

export default MemberRadioBtn;