import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Image from "next/legacy/image";
import dynamic from "next/dynamic";
import checkMemberStore from "@/global/check_member_store";
import { useSelector } from "react-redux";
import { getMemberState } from "@/store/member/member_slice";
import { useRouter } from "next/router";

// DashBoard 컴포넌트를 dynamic import하도록 설정.
const DashBoard = dynamic(() => import("../dashboard"), {
    ssr: false
});

// 회원 목록 공통 API(페이징 처리 및 검색 기능)
const getMemberListUrl = "/api/admin/members" 

const Members = () => {
    // 검색 카테고리
    const searchCategories = {
        이메일 : "email",
        이름 : "name",
        권한 : "auth_role",
        소셜로그인 : "social_login_type"
    };

    const [ members, setMembers ] = useState([]); 
    const [ currentMemberPage, setCurrentMemberPage ] = useState(0);
    const [ lastMemberPage, setLastMemberPage ] = useState(0);
    const [ selectSearchCategoryValue, setSelectSearchCategoryValue] = useState("");
    const [ selectSearchCategory, setSelectSearchCategory] = useState("");
    const [ keyword, setKeyword ] = useState("");
    const [ toggle, setToggle] = useState(false);
    const getMember = useSelector(getMemberState);
    const router = useRouter();
    const { replace } = router;

    useEffect(() => {
        checkMemberStore({
            member: getMember, 
            replace, 
            authPageCategory: "관리자"
        });
        callMemberListAPI(getMemberListUrl);
    }, []);

    // 회원 목록 각 페이지 클릭할 때
    const onMemberListBySelectedPage = async (page) => callMemberListAPI(`${getMemberListUrl}?page=${page}`, false);

    // 이전 페이지
    const onMemberListByPrevPage = () => callMemberListAPI(`${getMemberListUrl}?page=${currentMemberPage-1}`, false);

    // 다음 페이지
    const onMemberListByNextPage = () => callMemberListAPI(`${getMemberListUrl}?page=${currentMemberPage+1}`, false);

    // 검색 카테고리 선택창 열고 닫을 때 
    const onClickSelectCategory = () => {
        setToggle((current) => !current);
    }

    // 검색 카테고리 고를 때
    const onSelectSelectSearch = (category) => {
        setSelectSearchCategory(category);
        setSelectSearchCategoryValue(searchCategories[category]);
        setToggle((current) => !current);
    }

    // 회원 목록 검색
    const onSearch = async (event) => { 
        callMemberListAPI(`${getMemberListUrl}?category=${selectSearchCategoryValue}&keyword=${event.target.value}`, true);
        setKeyword(event.target.value);
    }

    // Enter 키를 누르면 회원 목록 검색 이벤트 발생
    const onSearchByEnterKeyPress = (e) => {
        if(e.code === 'Enter'){
            onSearch(e);
        }
    }

    // 공통 부분
    // 검색 키워드가 있는지 확인하고 있으면 url query에 추가
    // 회원 목록 조회 API 호출(페이징, 검색)
    const callMemberListAPI = async (url, isSeacrhEvent) => {
        let callApiUrl = url;

        if(keyword !== "" && selectSearchCategoryValue !== "" && !isSeacrhEvent){
            callApiUrl += `&category=${selectSearchCategoryValue}&keyword=${keyword}`;
        }

        const res = await axios.get(callApiUrl);
        const { result, currentPage, lastPage} = res.data;

        setMembers(result);
        setCurrentMemberPage(currentPage);
        setLastMemberPage(lastPage);
    }  

    return (
        <div className="grid grid-cols-1 2xl:grid-cols-2 xl:gap-4 my-4">
            <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">회원 목록</h3>
                    </div>

                    <div className="flex">
                        <div>
                            <div className="relative mt-1 mr-4">
                                <button 
                                    onClick={onClickSelectCategory}
                                    type="button" 
                                    className="relative w-40 h-11 cursor-default rounded-md bg-white pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6" 
                                    aria-haspopup="listbox" 
                                    aria-expanded="true" 
                                    aria-labelledby="listbox-label"
                                >
                                    <div className="flex items-center">
                                        <div className="ml-3 block truncate">{selectSearchCategory === "" ? "검색" : selectSearchCategory}</div>
                                    </div>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </button>
                            
                                {
                                    toggle ? (
                                    <ul 
                                        className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" 
                                        tabIndex="-1" 
                                        role="listbox" 
                                        aria-labelledby="listbox-label" 
                                        aria-activedescendant="listbox-option-3"
                                    >
                                        {/* <li 
                                            click="onSelectSelectSearchCategory(category)"
                                            className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9" 
                                            id="listbox-option-0" 
                                            role="option"
                                        >
                                            <div className="flex items-center">
                                                <span className="font-normal ml-3 block truncate">카테고리</span>
                                            </div>        
                                        </li> */}

                                        {Object.keys(searchCategories).map(category => (
                                            <li 
                                                key={category}
                                                onClick={() => onSelectSelectSearch(category)}
                                                className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9" 
                                                id="listbox-option-0" 
                                                role="option"
                                            >
                                                <div className="flex items-center">
                                                    <span className="font-normal ml-3 block truncate">{category}</span>
                                                </div>        
                                            </li>
                                        ))}
                                     </ul>
                                    ) : <></>
                                }
                            </div>
                        </div>
                        <div>
                            <label htmlFor="topbar-search" className="sr-only">검색</label>
                            <div className="mt-1 relative lg:w-64">
                                <div 
                                    onClick={() => onSearchByEnterKeyPress}
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                                >
                                    <svg 
                                        className="w-5 h-5 text-gray-500 cursor-default" 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20" 
                                        xmlns="http://www.w3.org/2000/svg"
                                        >
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <input 
                                    onKeyDown={onSearchByEnterKeyPress}
                                    type="text" 
                                    id="topbar-search" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full pl-10 p-2.5" 
                                    placeholder="검색"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col mt-8">
                    <div className="overflow-x-auto rounded-lg">
                        <div className="align-middle inline-block min-w-full">
                            <div className="shadow overflow-hidden sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="p-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                #
                                            </th>
                                            <th scope="col" className="p-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                이름
                                            </th>
                                            <th scope="col" className="p-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                이메일
                                            </th>
                                            <th scope="col" className="p-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                권한
                                            </th>
                                            <th scope="col" className="p-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                소셜로그인
                                            </th>
                                            <th scope="col" className="p-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                생성날짜
                                            </th>
                                            <th scope="col" className="p-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                최근 수정일
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {
                                            members.map((member) => (
                                                <tr key={member["member_id"]}>
                                                    <td className="p-4 text-center whitespace-nowrap text-sm font-normal text-gray-900">
                                                        {member["member_id"]}
                                                    </td>
                                                        <Link href={`/member/${member["member_id"]}`} key={member["member_id"]} prefetch={false}>
                                                            <td className="p-6 text-center whitespace-nowrap text-sm font-normal text-gray-500 cursor-default">
                                                                <div className="flex items-center justify-center">
                                                                    <div className="flex-shrink-0 mr-2">
                                                                        <Image
                                                                            width="40px"
                                                                            height="40px"
                                                                            className="rounded-full"
                                                                            src={member.profile_url !== null ? member.profile_url : "/icons/default-user-profile.png"}
                                                                        /> 
                                                                    </div>
                                                                    <span className="cursor-default">
                                                                        {member["name"]}
                                                                    </span>
                                                                </div>         
                                                            </td>
                                                        </Link>
                                                    
                                                    <td className="p-4 text-center whitespace-nowrap text-sm font-semibold text-gray-900">
                                                        {member["email"]}
                                                    </td>
                                                    <td className="p-4 text-center whitespace-nowrap text-sm font-semibold text-gray-900">
                                                        {member["auth_role"]}
                                                    </td>
                                                    <td className="p-4 text-center whitespace-nowrap text-sm font-semibold text-gray-900">
                                                        {member["social_login_type"]}
                                                    </td>
                                                    <td className="p-4 text-center whitespace-nowrap text-sm font-semibold text-gray-900">
                                                        {dayjs(member["created_at"]).format('YYYY-MM-DD HH:mm:ss')}
                                                    </td>
                                                    <td className="p-4 text-center whitespace-nowrap text-sm font-semibold text-gray-900">
                                                        {member["last_modified_at"] !== null ? dayjs(member["last_modified_at"]).format('YYYY-MM-DD HH:mm:ss') : '-'}
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-8 flex justify-end">
                                
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    { 
                                        currentMemberPage === 1 ? 
                                            <></> : 
                                            <div 
                                                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                                onClick={() => onMemberListByPrevPage()}
                                            >
                                                    <span className="sr-only">Previous</span>
                                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                                    </svg>
                                            </div>
                                    }
                                    {
                                        [...Array(lastMemberPage)].map((x, index) => (
                                            <div 
                                                key={index}
                                                className={
                                                    currentMemberPage === index+1 ?
                                                    'relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-default' : 
                                                    'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-default'
                                                }
                                                onClick={() => onMemberListBySelectedPage(index+1)}
                                            >
                                                {index+1}
                                            </div>)
                                        )
                                    }
                                    {
                                        currentMemberPage === lastMemberPage ? 
                                        <></> : 
                                        <div 
                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-default"
                                            onClick={() => onMemberListByNextPage()}
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    }
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Members.getLayout = (page) => {
    return( 
        <DashBoard>
            {page}
        </DashBoard>
    );
}

export default Members;