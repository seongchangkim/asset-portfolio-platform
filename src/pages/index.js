// react hook
import { useEffect } from 'react';
// axios 
import axios from 'axios';
// next 라우터
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

// 서버 root url
import BASE_URL from '@/global/base_url';

// redux
import { setMemberState } from "@/store/member/member_slice";
import { useDispatch } from "react-redux";
import { setAssetPortfolioState } from '@/store/asset_portfolio/asset_portfolio_slice';

// 포트폴리오 상세보기 컴포넌트 lazy loading 하기
const AssetPortfolioDetail = dynamic(() => import('@/components/asset_portfolio/asset_portfolio_detail'),{
  ssr: false
});
// 대시보드 컴포넌트 lazy loading 하기
const DashBoard = dynamic(() => import('../dashboard'), {
  ssr: false
});

export default function Home() {
  // 라우터
  const router = useRouter();
  const { replace } = router;

  const dispatch = useDispatch();
  
  // 로그인 체크
  const memberAuth = async () => {
    const res = await axios.get(`${BASE_URL}/api/member/auth`);

    // 토큰이 유효하지 않으면
    if(!res.data.isValidateToken){
      dispatch(setMemberState({}));
      dispatch(setAssetPortfolioState({}));
      replace("member/login");
    } 
  }

  useEffect(() => {
    memberAuth();
  },[]);

  return (  
    <DashBoard>
      <AssetPortfolioDetail />
    </DashBoard>
  );
}
