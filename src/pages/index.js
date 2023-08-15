import { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '@/global/base_url';
import { useRouter } from "next/navigation";
import DashBoard from '../dashboard';
import AssetPortfolioDetail from '@/components/asset_portfolio/asset_portfolio_detail';

// redux
import { setMemberState, getMemberState } from "@/store/member/member_slice";
import { useSelector, useDispatch } from "react-redux";
import { setAssetPortfolioState } from '@/store/asset_portfolio/asset_portfolio_slice';

export default function Home() {
  // 라우터
  const router = useRouter();
  const { replace } = router;

  const getMember = useSelector(getMemberState);
  const dispatch = useDispatch();

  // 로딩 트리거
  const [loading, setLoading] = useState(true);
  
  // 로그인 체크
  const memberAuth = async () => {

    if(getMember.socialLoginType === "NONE"){
      checkAuth(`${BASE_URL}/api/member/auth`);   
    }else{
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
    memberAuth();
    setLoading(current => !current);
  },[]);

  return (
    <div>
      {loading ? (<div>loading</div>) : 
        (
          <DashBoard>
            <AssetPortfolioDetail />
          </DashBoard>
        )
      }
    </div>
    
  );
}
