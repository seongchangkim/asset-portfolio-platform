import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMemberState } from "@/store/member/member_slice";
import { getAssetPortfolioState, setAssetPortfolioState } from "@/store/asset_portfolio/asset_portfolio_slice";
import PortfolioAssetInput from "@/components/asset_portfolio/portfolio_asset_input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import BASE_URL from "@/global/base_url";
import { useRouter } from "next/router";

const AssetPortfolioCreatePage = () => {

    // 회원 상태 저장소 가져오기
    const getMember = useSelector(getMemberState);
    // 자산 포트폴리오 상태 저장소 가져오기 
    const getAssetPortfolio = useSelector(getAssetPortfolioState);
    const { assets, portfolio } = getAssetPortfolio;
    const dispatch = useDispatch();

    const router = useRouter();
    const { back } = router;

    // 수정 페이지인지 생성 페이지인지 체크하는 변수
    const [ funcKind, setFuncKind ] = useState("");
    // 등록된 자산 입력값 갯수
    const [ inputAssetCount, setInputAssetCount ] = useState(1); 
    const [ name, setName ] = useState("");
    const [ totalAmount, setTotalAmount ] = useState(0); 
    const [ registeredAsset, setRegistedAsset ] = useState([{}]);
    const [ registeredAssetRatio, setRegisteredAssetRatio ] = useState([0]);

    useEffect(() => {
        if(router.isReady){
            const { func_kind } = router.query;
                    
            if(func_kind === "update"){
                
                const { total_amount, name } = portfolio;

                setTotalAmount(total_amount);
                setName(name);

                let count = 0;
                
                const initAssets = registeredAsset;
                const initAssetRatios = registeredAssetRatio;

                assets.forEach(asset => {
                    initAssets.push(asset);
                    initAssetRatios.push(asset.asset_ratio);
                    count++;
                });

                const filteringAssets = initAssets.filter(asset => Object.keys(asset).length > 0);
                const filteringAssetRatios = initAssetRatios.filter(ratio => ratio > 0);

                setRegistedAsset(filteringAssets);
                setRegisteredAssetRatio(filteringAssetRatios);

                setInputAssetCount(count);
                setFuncKind("update");
            }else{
                setFuncKind("create");
            }
        }
    }, [router.isReady]);

    const onChangeName = (event) => {
        setName(event.target.value);
    }

    const onChangeTotalAmount = (event) => {
        if(event.target.value === ""){
            setTotalAmount(0);
            return;
        }
        
        setTotalAmount(parseInt(event.target.value));
    }

    // 등록하고자 자산 입력폼의 갯수 등록 함수
    const increaseInputAssetCount = () => {
        // 등록하고자 자산이 10개 이상이면 알림창을 띄우면서 생성하지 않도록 구현. 
        if(inputAssetCount >= 10){
            alert("등록하고자 자산을 10개까지 등록할 수 있습니다.");
            return;
        }

        updateInputAssetCount(inputAssetCount, "increase");
    };
    
    // 등록하고자 자산 입력폼의 갯수 감소 함수
    // 자식 컴포넌트에서 부모 컴포넌트까지 상태값을 전달하는 것을 통해 갯수를 감소하는 것을 감지.
    const handleInputAssetCount = (count) => {
        updateInputAssetCount(count, "handle");
    };

    // 등록하고자 자산 입력폼의 갯수 증가/감소시킨 공통 함수
    const updateInputAssetCount = (count, status) => {
        const assets = registeredAsset;
        const ratios = registeredAssetRatio;

        if(status === "increase"){
            assets.push({});
            ratios.push(0);
        }else{
            assets.pop();
            ratios.pop();
        }

        setInputAssetCount(status === "increase" ? (current) => ++current : count);
        setRegistedAsset(assets);
        setRegisteredAssetRatio(ratios);
    }

    const handleRegisterAsset = (asset, index) => {
        const assets = registeredAsset;
        assets[index-1] = asset;
        setRegistedAsset(assets);
    }

    const handleRegisterAssetRatio = (ratio, index) => {
        const ratios = registeredAssetRatio;
        ratios[index-1] = ratio;
        setRegisteredAssetRatio(ratios);
    }

    // 자산 포트폴리오 생성 또는 감소 API 호출함으로써 response 값을 넘김
    const createOrUpdateCallRestApi = async (url, params) => {
        if(funcKind === "create"){
            const res = await axios.post(url, params);

            return res.data;
        }else{
            const res = await axios.put(url, params);

            return res.data;
        }
    }

    // 자산 포트폴리오 생성 또는 감소
    const onProcessingAssetPortfolio = async () => {
        let totalRatio = 0;
        
        registeredAssetRatio.forEach((ratio) => totalRatio += ratio);

        if(totalRatio > 100){
            alert("등록된 자산들의 비율 합이 100퍼센트를 초과할 수 없습니다.");
            return;
        }
        
        const assetsParam = [];

        for(let i = 0; i < registeredAsset.length; i++){
            assetsParam.push({
                asset_name : registeredAsset[i].asset_name,
                asset_code : registeredAsset[i].asset_code,
                asset_ratio : registeredAssetRatio[i]
            });
        }

        const params = {
            portfolio : {
                total_amount: totalAmount,
                name,
                member_id: getMember.id
            },
            assets : assetsParam
        };

        let url = "";
        if(funcKind === "create"){
            url = `${BASE_URL}/api/asset-portfolio`
        }else{
            url = `${BASE_URL}/api/asset-portfolio/${portfolio.asset_port_id}`;
        }
           
        const { success, portfolioInfo, assets } = await createOrUpdateCallRestApi(url, params);

        if(success){
            dispatch(setAssetPortfolioState({
                portfolio: portfolioInfo[0],
                assets
            }));
            back();
        }
    }
    
    return (
        <div className="flex justify-center items-center">
            <div className="h-4/5 w-4/5 mt-20">
                <div>
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">자산 포트폴리오 생성</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">자산 포트폴리오에 등록된 자산을 조회할 때 사용합니다.</p>
                    </div>
                    
                    <div className="my-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">자산 포트폴리오 이름</label>
                            <div className="mt-2">
                                <input 
                                    type="text" 
                                    name="name" 
                                    id="name" 
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2" 
                                    value={name}
                                    onChange={onChangeName}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label 
                                htmlFor="totalPrice" 
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >초기 금액(원)</label>
                            <div className="mt-2">
                                <input 
                                    type="text" 
                                    name="totalAmount" 
                                    id="totalAmount" 
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2" 
                                    value={totalAmount}
                                    onChange={onChangeTotalAmount}
                                />
                            </div>
                        </div> 
                    </div>

                    <div className="border-b border-gray-900/10 pb-6">
                        <span className="font-semibold ">포트폴리오 자산</span>
                    </div>

                    {
                        registeredAsset.map((asset, index) => (
                            <PortfolioAssetInput 
                                key={asset.asset_code}
                                count={inputAssetCount} 
                                index={++index} 
                                handleInputAssetCount={handleInputAssetCount} 
                                handleRegisterAsset={handleRegisterAsset} 
                                handleRegisterAssetRatio={handleRegisterAssetRatio}
                                selectAssetParam={asset}
                                assetRatioParam={asset.asset_ratio}
                            />))
                    }
                    
                    <div 
                        onClick={increaseInputAssetCount}
                        className="bg-blue-700 rounded-md mt-5 h-8 flex justify-center items-center cursor-default"
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-white mr-2"/>
                        <p className="text-white">추가</p>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    {/* <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button> */}
                    <div 
                        onClick={onProcessingAssetPortfolio} 
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {funcKind === "create" ? '생성' : '수정'}
                    </div>
                </div>
            </div>            
        </div>
    );
}

export default AssetPortfolioCreatePage;