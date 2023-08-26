import { useEffect, useState } from "react";
import { Combobox } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import apiKey from "@/global/twelve_data/api_key";

const PortfolioAssetInput = ({count, index, handleInputAssetCount, handleRegisterAsset, handleRegisterAssetRatio, selectAssetParam = {}, assetRatioParam }) => {
    // 선택된 자산
    const [ selectAsset, setSelectAsset ] = useState({});
    // 선택된 자산 비율
    const [ ratio, setRatio ] = useState(0);
    // 검색된 자산 목록
    const [ searchedAssetList, setSearchAssetList ] = useState([]);

    useEffect(() => {
        setSelectAsset(Object.keys(selectAssetParam).length > 0 ? selectAssetParam : {});
        setRatio(assetRatioParam > 0 ? assetRatioParam : 0);
    }, []);

    useEffect(() => {
        setSelectAsset((current) => {
            return {
                ...current,
                asset_ratio: ratio 
            }
        })
    }, [ratio]);

    // 비율 입력 시 비율값 변경
    const onChangeRatio = (event) => {
        if(event.target.value === ""){
            setRatio(0);
            return;
        }

        setRatio(parseFloat(event.target.value));
        handleRegisterAssetRatio(parseFloat(event.target.value), index);
    }; 
    const onChangeInputAsset = async (event) => {
        const keyword = event.target.value;
        
        const res =  await axios.get(
            `https://api.twelvedata.com/symbol_search?outputsize=30&country=United States&symbol=${keyword}`,
            {
                headers: {
                    Authorization: `apikey ${apiKey}`
                }
            }
        );

        const {data} = res.data;
        const value = data.map((asset) => {
            return {
                asset_name: asset.instrument_name,
                asset_code: asset.symbol
            }
        });
        setSearchAssetList(value);
    }

    const onRemoveInputAsset = () => {
        let inputAssetCount = count;

        if(inputAssetCount <= 1){
            alert("등록하고자 자산이 1개 이상 있어야 합니다.");
            return;
        }

        --inputAssetCount;
        handleInputAssetCount(inputAssetCount);
    }

    const onChangeSelectAsset = (value) => {
        setSelectAsset(value);
        handleRegisterAsset(value, index);
    }

    return (
        <div className="flex">
            <div className="w-3/5 mt-5 mr-10">
                <label htmlFor="asset" className="block text-sm font-medium leading-6 text-gray-900">자산 {index}</label>
                <div className="mt-2">
                    <Combobox value={selectAsset} onChange={(value) => onChangeSelectAsset(value)}>
                        <Combobox.Input 
                            id="asset" 
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                            onChange={(event) => onChangeInputAsset(event)}
                            displayValue={(asset) => Object.keys(asset).length === 0 ? "" : `${asset.asset_code ?? ""}${asset.asset_name !== undefined ? `(${asset.asset_name})` : ''}`}
                        />
                        <Combobox.Options className="border rounded-lg max-h-56 overflow-auto"> 
                            {
                                searchedAssetList.map(searchedAsset => {
                                    return <Combobox.Option key={searchedAsset.mic_code} value={searchedAsset} className="px-2 ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black">
                                        {searchedAsset.asset_code}({searchedAsset.asset_name})
                                    </Combobox.Option>
                                })
                            }
                        </Combobox.Options>
                    </Combobox>
                </div>
            </div>

            <div className="w-1/4 mt-5 mr-10">
                <label 
                    htmlFor="ratio" 
                    className="block text-sm font-medium leading-6 text-gray-900"
                >비율(%)</label>
                <div className="mt-2">
                    <input 
                        type="text" 
                        name="ratio" 
                        id="ratio" 
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                        value={ratio} 
                        onChange={onChangeRatio}
                    />
                </div>
            </div>

            <div className="w-5 mt-5 flex items-center">
                <FontAwesomeIcon icon={faXmark} className="h-8" onClick={onRemoveInputAsset}/>
            </div>
        </div>
        
    );
}

export default PortfolioAssetInput;