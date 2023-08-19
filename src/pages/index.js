// react hook
import { useEffect, lazy, Suspense } from 'react';
// axios 
import axios from 'axios';
// next 라우터
import { useRouter } from "next/navigation";

// 서버 root url
import BASE_URL from '@/global/base_url';
// 로딩 페이지 컴포넌트 가져오기
import Loading from '@/components/util/loading';

// redux
import { setMemberState, getMemberState } from "@/store/member/member_slice";
import { useSelector, useDispatch } from "react-redux";
import { setAssetPortfolioState } from '@/store/asset_portfolio/asset_portfolio_slice';

// 회원 상태 저장소 존재 여부 함수 모듈 가져오기
import checkMemberStore from '@/global/check_member_store';

// 포트폴리오 상세보기 컴포넌트 lazy loading 하기
const AssetPortfolioDetail = lazy(() => import('@/components/asset_portfolio/asset_portfolio_detail'));
// 대시보드 컴포넌트 lazy loading 하기
const DashBoard = lazy(() => import('../dashboard'));

export default function Home() {
  // 라우터
  const router = useRouter();
  const { replace } = router;

  const getMember = useSelector(getMemberState);
  const dispatch = useDispatch();
  
  // 로그인 체크
  const memberAuth = async () => {

    if(getMember.socialLoginType === "NONE"){
      checkAuth(`${BASE_URL}/api/member/auth`);   
    }else if(getMember.socialLoginType !== "NONE" && getMember.socialLoginType !== undefined){
      checkAuth(`${BASE_URL}/api/member/social-login/auth/${getMember.socialLoginType}/${getMember.id}`);    
    } 
  }

  const checkAuth = async (url) => {
    await axios.get(url).then(res => {
      // 토큰이 유효하지 않으면
      if(!res.data.isValidateToken){
        dispatch(setMemberState({}));
        dispatch(setAssetPortfolioState({}));
        replace("member/login");
      }
    }); 
  }

  useEffect(() => {
    console.log(getMember);
    // 회원 상태 저장소 존재 여부 함수 호출
    // 회원 상태 저장소 빈 객체이면 로그인 페이지로 이동함.
    checkMemberStore({
      member: getMember, 
      replace, 
      authPageCategory : "회원"
    });
    memberAuth();
  },[]);

  return (  
    <Suspense fallback={<Loading content="로딩 중입니다.."/>}>
      <DashBoard>
        <AssetPortfolioDetail />
      </DashBoard>
    </Suspense>
  );
}
