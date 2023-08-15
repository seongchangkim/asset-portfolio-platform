import { getAssetPortfolioState, setAssetPortfolioState } from "@/store/asset_portfolio/asset_portfolio_slice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import apiKey from "@/global/twelve_data/api_key";
import axios from "axios";
import chartColors from "./chart/colors";
import { Line } from "react-chartjs-2";
import Delay from "../util/delay";
import EmptyAssetPortfolio from "./empty_asset_portfoilio";
import Loading from "../util/loading";
import Link from "next/link";
import BASE_URL from "@/global/base_url";
import dayjs from "dayjs";

const AssetPortfolioDetail = () => {
    // 자산 포트폴리오 상태 저장소 가져오기
    const getAssetPortfolio = useSelector(getAssetPortfolioState);
    const { portfolio, assets } = getAssetPortfolio;
    const dispatch = useDispatch();

    // 자산 포트폴리오 선형 그래프를 위한 변수 
    const [ lineChartData, setLineChartData ] = useState({}); 
    
    // 자산 포트폴리오에 등록된 자산 목록
    const [ assetRatioInfo, setAssetRatioInfo ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    // 선형 그래프의 설정값
    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: portfolio !== undefined ? portfolio.name : "",
            },
        },
    };

    const onDeleteAssetPortfolio = async () => {
        const res = await axios.delete(`${BASE_URL}/api/asset-portfolio/${portfolio.asset_port_id}`);
        const { success, errorMessage } = res.data;

        if(success){
            dispatch(setAssetPortfolioState({}));
            alert("해당 자산 포트폴리오를 삭제되었습니다");
            location.reload();
        }else{
            alert(errorMessage);
        }

    }

    const getAssetMarketCond = async () => {
        const datasets = [];
        const labels = [];
        const assetRatio = [];
        const color = [];
        let lastMrkCond = 0;

        for(let i = 0; i< assets.length; i++){
            color.push(chartColors[i]);
            assetRatio.push(assets[i].asset_ratio);

            console.log(apiKey);
            await axios.get(`https://api.twelvedata.com/time_series?symbol=${assets[i].asset_code}&interval=1day&outputsize=5000&apikey=${apiKey}`).then((res) => {
                const { values } = res.data;

                const assetData = [];
                
                for(let j = values.length-1; j >= 0  ; j--){
                    const convertSecond = new Date(values[j].datetime).getTime();

                    if(convertSecond >= new Date(portfolio.created_at).getTime() || values[j].datetime === dayjs(portfolio.created_at).format("YYYY-MM-DD")){
                        console.log(values[j].datetime);
                        if(datasets.length === 0){
                            labels.push(values[j].datetime);
                        }
    
                        assetData.push(
                            assetData.length === 0 ?
                            Math.round((assets[i].asset_ratio / 100) * portfolio.total_amount) :
                            Math.round((assets[i].asset_ratio / 100) * portfolio.total_amount * (values[j].close/values[j+1].close)));

                        if(j === 0){
                            lastMrkCond = Math.round((assets[i].asset_ratio / 100) * portfolio.total_amount * (values[j].close/values[j+1].close));
                        }
                    }
                }

                datasets.push(
                    {
                        data: assetData,
                        label: assets[i].asset_code, 
                        borderColor: chartColors[i],
                        backgroundColor: chartColors[i] 
                    }
                );
            });

            setAssetRatioInfo((current) => [
                ...current,
                {
                    color: chartColors[i],
                    asset: assets[i].asset_code,
                    assetName: assets[i].asset_name,
                    ratio: assets[i].asset_ratio,
                    lastMrkCond
                }
            ]);
        }
    
        setLineChartData((current) => {
            return {
                ...current,
                labels,
                datasets
            };
        });
        setLoading((current) => !current);
    }

    useEffect(() => {
        if(Object.keys(getAssetPortfolio).length !== 0 
            && getAssetPortfolio.portfolio !== undefined){
            console.log("get api");
            getAssetMarketCond();
        }else{
            setLoading((current) => !current);
        }
       
    }, []);

    return loading ? (
        <Loading content="자산 포트폴리오 정보를 가져오는 중입니다.."/>
    ) : ( 
            Object.keys(getAssetPortfolio).length === 0 || getAssetPortfolio.portfolio === undefined ? <EmptyAssetPortfolio /> : (
                <div className="grid grid-cols-4 grid-rows-8">
                    <div className="row-span-1 col-span-4 flex justify-end bg-white border rounded-md mx-10">
                        <div 
                            onClick={onDeleteAssetPortfolio}
                            className="bg-red-400 mr-5 text-white rounded-md p-2 m-2 w-20 flex justify-center cursor-default"
                        >
                            삭제
                        </div>
                        <Link href="/asset-portfolio/update">
                            <div className="bg-blue-500 text-white rounded-md p-2 m-2 w-20 flex justify-center cursor-default">
                                수정
                            </div>
                        </Link>
                    </div>

                    <div className="row-span-5 col-span-4 flex justify-center bg-white border rounded-md mt-10 mx-10">
                        <Delay>
                            <Line data={lineChartData} options={lineChartOptions}/>
                        </Delay>
                    </div>

                    <div className="row-span-2 col-span-4 bg-white border rounded-md my-10 mx-10">
                        <div className="m-4 font-bold">
                            자산 목록
                        </div>
                        <Delay>
                            {
                                assetRatioInfo.map((asRatioInfo) => {
                                        // 수익인지 손해인지 체크할 때 쓰는 변수 
                                        const ratioCondition = asRatioInfo.lastMrkCond === 0 ? 0 : (
                                            asRatioInfo.lastMrkCond - (
                                                portfolio.total_amount * (asRatioInfo.ratio / 100)
                                            )
                                        ) / portfolio.total_amount;

                                        // 해당 자산 포트폴리오에 있는 각 자산의 수익률이 얼마나 나오는 
                                        const howGainerPercent = asRatioInfo.lastMrkCond === 0 ? 0 : Math.round(
                                            (
                                                (
                                                    asRatioInfo.lastMrkCond - (
                                                        portfolio.total_amount * (asRatioInfo.ratio / 100)
                                                    )
                                                ) / portfolio.total_amount
                                            ) * 1000) / 1000 * 100;

                                        return (
                                            <div className="flex justify-between m-5" key={asRatioInfo.asset}>
                                                <div className="flex justify-start">
                                                    <div className="pr-3 mr-1" style={{backgroundColor : asRatioInfo.color}}></div>
                                                    <div className="text-sm font-semibold">{asRatioInfo.asset}({asRatioInfo.assetName})</div>
                                                </div>
                                                <div className="w-2/5 flex justify-end">
                                                    <p className="mr-1">₩ {asRatioInfo.lastMrkCond === 0 ? (portfolio.total_amount * (asRatioInfo.ratio / 100)) : asRatioInfo.lastMrkCond}</p>
                                                    <p className={ratioCondition > 0 ? 'text-red-400' : (ratioCondition === 0 ? 'text-gray-600' : 'text-blue-700')}>({
                                                        ratioCondition > 0 ? `+ ${howGainerPercent}%` : `${howGainerPercent}%`
                                                    })</p>
                                                    
                                                </div>
                                            </div>
                                        )
                                    }
                                )
                            }
                        </Delay>
                    </div>
                </div>
        )
    );  
}

export default AssetPortfolioDetail;