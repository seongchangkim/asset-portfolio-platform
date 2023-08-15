import Link from "next/link"

const EmptyAssetPortfolio = () => {
    return (
        <div className="py-40 px-10">
            <div className="flex justify-center">
                <img
                    src="/icons/asset-portfolio.png"
                    className="mb-4 w-20 h-20"
                />
            </div>
            
            <p className="text-lg text-center font-medium">생성된 자산 포트폴리오를 존재하지 않습니다.</p>
            <Link href="/asset-portfolio/create">
                <p className="text-center text-xs text-blue-500">
                    자산 포트폴리오 생성하러 가기 -{">"}
                </p>
            </Link>
        </div>
    )
}

export default EmptyAssetPortfolio;