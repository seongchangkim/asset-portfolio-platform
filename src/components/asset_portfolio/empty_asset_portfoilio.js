import Link from "next/link"
import Image from "next/legacy/image";

const EmptyAssetPortfolio = ({memberName}) => {
    return (
        <div className="py-40 px-10">
            <div className="flex justify-center">
                <Image
                    src="/icons/asset-portfolio.png"
                    width="80px"
                    height="80px"
                />
            </div>
            
            <p className="text-lg text-center font-medium mt-4">{memberName}님, 자산 포트폴리오가 존재하지 않습니다. 지금 자산 포트폴리오를 생성하겠습니까?</p>
            <Link href="/asset-portfolio/create">
                <p className="text-center text-xs text-blue-500">
                    자산 포트폴리오 생성하러 가기 -{">"}
                </p>
            </Link>
        </div>
    )
}

export default EmptyAssetPortfolio;