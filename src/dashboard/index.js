import { useState } from "react";
import { setMemberState, getMemberState } from "@/store/member/member_slice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import BASE_URL from "@/global/base_url";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from 'next/legacy/image';

const navItem = [
  {
    url : "/"
  },
  {
    url : "/members"
  }
]

const DashBoard = ({children}) => {
    const [dropDown, setDropDown] = useState(false);
    
    const router = useRouter();
    const { replace } = router;
    
    const getMember = useSelector(getMemberState);
    const dispatch = useDispatch();
    const onDropDown = () => setDropDown((current) => !current);

    const handleLogout = async () => {
      const res = await axios.post(`${BASE_URL}/api/member/logout`, {
          id: getMember.id
      });
  
      const data = res.data;

      if(data["success"]){
          dispatch(setMemberState({}));
          replace("/member/login");
      }
    }

    return (
        <div className="w-full relative flex ct-docs-disable-sidebar-content overflow-x-hidden">
          <nav className="block py-4 px-6 top-0 bottom-0 w-64 bg-white shadow-xl left-0 absolute flex-row flex-nowrap md:z-10 z-9999 transition-all duration-300 ease-in-out transform md:translate-x-0 -translate-x-full">
            <button className="md:hidden flex items-center justify-center cursor-pointer text-blueGray-700 w-6 h-10 border-l-0 border-r border-t border-b border-solid border-blueGray-100 text-xl leading-none bg-white rounded-r border border-solid border-transparent absolute top-1/2 -right-24-px focus:outline-none z-9998"><i className="fas fa-ellipsis-v"></i></button>
            <div className="flex-col min-h-full px-0 flex flex-wrap items-center justify-between w-full mx-auto overflow-y-auto overflow-x-hidden">
                <div className="flex bg-white flex-col items-stretch opacity-100 relative mt-4 overflow-y-auto overflow-x-hidden h-auto z-40 items-center flex-1 rounded w-full">
                  {/*
                    <a text="Notus Design System PRO" image="data:image/png;base64,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" link="[object Object]" className="md:flex items-center flex-col text-center md:pb-2 text-blueGray-700 mr-0 inline-flex whitespace-nowrap text-sm uppercase font-bold p-4 px-0"><img src="data:image/png;base64,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" alt="..." className="max-w-full rounded">
                      <span>Notus Design System PRO</span>
                    </a>
                  */}
                  <div className="md:flex-col md:min-w-full flex flex-col list-none">
                    <div>
                      <hr className="my-4 md:min-w-full"/>
                        <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">홈</h6>
                        <Link href={navItem[0].url} prefetch={false}>
                          <div className="text-xs uppercase py-3 font-bold block text-blueGray-800 hover:text-blueGray-500"><i className="fab fa-angular mr-2 text-sm text-blueGray-400"></i>대시보드</div>
                        </Link>
                    </div>
                    {
                      getMember.authRole === "관리자" ? (
                        <div>
                          <hr className="my-4 md:min-w-full"/>
                          <h6 className="md:min-w-full text-blueGray-500 text-sm uppercase font-bold block pt-1 pb-4 no-underline">회원</h6>
                          <Link href={navItem[1].url} prefetch={false}>
                            <div className="text-xs uppercase py-3 font-bold block text-blueGray-800 hover:text-blueGray-500 cursor-default"><i className="fas fa-newspaper mr-2 text-sm text-blueGray-400"></i>회원 목록</div>
                          </Link>
                          {/* <a href="#" className="text-xs uppercase py-3 font-bold block text-blueGray-800 hover:text-blueGray-500"><i className="fas fa-user-circle mr-2 text-sm text-blueGray-400"></i>Page 2 for Section 3</a>
                          <a href="#" className="text-xs uppercase py-3 font-bold block text-blueGray-800 hover:text-blueGray-500"><i className="fas fa-paint-brush mr-2 text-sm text-blueGray-400"></i>Page 3 for Section 3</a> */}
                        </div>
                          
                      ) : <></>
                    }
                  </div>
                </div>
            </div>
          </nav>
          <div className="relative md:ml-64 bg-blueGray-100 w-full">
            <nav className="absolute top-0 left-0 w-full z-10 bg-white lg:flex-row lg:flex-nowrap lg:justify-start flex items-center py-1 px-4 lg:bg-transparent">
              <div className="w-full mx-aut0 items-center flex justify-between lg:flex-nowrap flex-wrap lg:px-6 px-4">
                <a href="#" className="text-blueGray-800 lg:text-white text-sm uppercase inline-block font-semibold my-3">Settings Page</a><button className="ml-auto cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-blueGray-400 rounded bg-transparent block outline-none focus:outline-none text-blueGray-300 lg:hidden" type="button"><i className="fas fa-bars"></i></button>
                <div className="items-center justify-end w-full lg:flex lg:w-auto flex-grow duration-300 transition-all ease-in-out lg:h-auto-important hidden">
                    {/* <form className="flex flex-row flex-wrap items-center ml-auto mr-3 mt-3">
                      <div className="mb-3 pt-0">
                        <input placeholder="Search here" type="text" className="border-transparent shadow px-3 py-2 text-sm  w-full placeholder-blueGray-200 text-blueGray-700 relative bg-white rounded-md outline-none focus:ring focus:ring-lightBlue-500 focus:ring-1 focus:border-lightBlue-500 border border-solid transition duration-200 "/>
                      </div>
                    </form> */}
                    <a className="text-blueGray-500 block" href="#">
                      <div className="items-center flex">
                        <span 
                          onClick={onDropDown}
                          className="w-12 h-12 text-sm text-white bg-blueGray-300 inline-flex items-center justify-center rounded-full">
                          <Image
                            alt="..."
                            width="42px"
                            height="42px" 
                            className="rounded-full align-middle border-none shadow p-2" 
                            src={(getMember.profile === null || getMember.profile === undefined) ? "/icons/default-user-profile.png" : getMember.profile}
                          />
                        </span>
                      </div>
                    </a>
                    {
                      dropDown ? (
                          <div className="relative inline-block text-left">
                              <div className="absolute right-0 z-10 mt-7 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                                  {/* <div className="py-1" role="none">
                                      
                                      <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1" id="menu-item-0">Edit</a>
                                      <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1" id="menu-item-1">Duplicate</a>
                                  </div>
                                  <div className="py-1" role="none">
                                      <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1" id="menu-item-2">Archive</a>
                                      <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1" id="menu-item-3">Move</a>
                                  </div>
                                  <div className="py-1" role="none">
                                      <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1" id="menu-item-4">Share</a>
                                      <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1" id="menu-item-5">Add to favorites</a>
                                  </div> */}
                                  <Link href={`/profile/${getMember.id}`} prefetch={false}>
                                    <div className="py-1" role="none">
                                        <div 
                                            className="text-gray-700 block px-4 py-2 text-sm cursor-default"
                                            role="menuitem" 
                                            tabIndex="-1" 
                                            id="menu-item-6">MY 프로필</div>
                                    </div>
                                  </Link>
                                  <div onClick={handleLogout} className="py-1" role="none">
                                      <div 
                                          className="text-gray-700 block px-4 py-2 text-sm cursor-default"
                                          role="menuitem" 
                                          tabIndex="-1" 
                                          id="menu-item-6">로그아웃</div>
                                  </div>
                              </div>
                          </div>
                        ) : <></>
                    } 
                </div>
              </div>
            </nav>
            <div className="relative pt-20 pb-20 bg-lightBlue-500">
                {children}
                <div className="px-4 md:px-6 mx-auto w-full">
                  <div>
                      {/* <div className="flex flex-wrap">
                        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                            <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-6 xl:mb-0 shadow-lg">
                              <div className="flex-auto p-4">
                                  <div className="flex flex-wrap">
                                    <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                                        <h5 className="text-blueGray-400 uppercase font-bold text-xs">Traffic</h5>
                                        <span className="font-bold text-xl">350,897</span>
                                    </div>
                                    <div className="relative w-auto pl-4 flex-initial">
                                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-red-500"><i className="far fa-chart-bar"></i></div>
                                    </div>
                                  </div>
                                  <p className="text-sm text-blueGray-500 mt-4"><span className="text-emerald-500 mr-2"><i className="fas fa-arrow-up"></i> 3.48%</span><span className="whitespace-nowrap">Since last month</span></p>
                              </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                            <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-6 xl:mb-0 shadow-lg">
                              <div className="flex-auto p-4">
                                  <div className="flex flex-wrap">
                                    <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                                        <h5 className="text-blueGray-400 uppercase font-bold text-xs">NEW USERS</h5>
                                        <span className="font-bold text-xl">2,356</span>
                                    </div>
                                    <div className="relative w-auto pl-4 flex-initial">
                                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-orange-500"><i className="fas fa-chart-pie"></i></div>
                                    </div>
                                  </div>
                                  <p className="text-sm text-blueGray-500 mt-4"><span className="text-red-500 mr-2"><i className="fas fa-arrow-down"></i> 3.48%</span><span className="whitespace-nowrap">Since last week</span></p>
                              </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                            <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-6 xl:mb-0 shadow-lg">
                              <div className="flex-auto p-4">
                                  <div className="flex flex-wrap">
                                    <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                                        <h5 className="text-blueGray-400 uppercase font-bold text-xs">SALES</h5>
                                        <span className="font-bold text-xl">924</span>
                                    </div>
                                    <div className="relative w-auto pl-4 flex-initial">
                                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-pink-500"><i className="fas fa-users"></i></div>
                                    </div>
                                  </div>
                                  <p className="text-sm text-blueGray-500 mt-4"><span className="text-orange-500 mr-2"><i className="fas fa-arrow-down"></i> 1.10%</span><span className="whitespace-nowrap">Since yesterday</span></p>
                              </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                            <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-6 xl:mb-0 shadow-lg">
                              <div className="flex-auto p-4">
                                  <div className="flex flex-wrap">
                                    <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                                        <h5 className="text-blueGray-400 uppercase font-bold text-xs">PERFORMANCE</h5>
                                        <span className="font-bold text-xl">49,65%</span>
                                    </div>
                                    <div className="relative w-auto pl-4 flex-initial">
                                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-lightBlue-500"><i className="fas fa-percent"></i></div>
                                    </div>
                                  </div>
                                  <p className="text-sm text-blueGray-500 mt-4"><span className="text-emerald-500 mr-2"><i className="fas fa-arrow-up"></i> 12%</span><span className="whitespace-nowrap">Since last month</span></p>
                              </div>
                            </div>
                        </div>
                      </div> */}
                  </div>
                </div>
            </div>
            <div className="px-4 md:px-6 mx-auto w-full -mt-24">
                {/* <div className="flex flex-wrap">
                  <div className="w-full xl:w-8/12 px-4">
                      <div className="relative flex flex-col min-w-0 break-words w-full mb-8 shadow-lg rounded-lg bg-blueGray-800">
                        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                            <div className="flex flex-wrap items-center">
                              <div className="relative w-full max-w-full flex-grow flex-1">
                                  <h6 className="uppercase mb-1 text-xs font-semibold text-blueGray-200">Overview</h6>
                                  <h2 className="text-xl font-semibold text-white">Sales value</h2>
                              </div>
                            </div>
                        </div>
                        <div className="p-4 flex-auto">
                            <div className="relative h-350-px">
                              <canvas id="line-chart" width="496" height="291" style={{
                                  display: "block",
                                  boxSizing: "border-box", 
                                  height: "350px",
                                  width: "595.5px"}}></canvas>
                            </div>
                        </div>
                      </div>
                  </div>
                  <div className="w-full xl:w-4/12 px-4">
                      <div className="relative flex flex-col min-w-0 break-words w-full mb-8 shadow-lg rounded-lg bg-white">
                        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                            <div className="flex flex-wrap items-center">
                              <div className="relative w-full max-w-full flex-grow flex-1">
                                  <h6 className="uppercase mb-1 text-xs font-semibold text-blueGray-500">Performance</h6>
                                  <h2 className="text-xl font-semibold text-blueGray-800">Total orders</h2>
                              </div>
                            </div>
                        </div>
                        <div className="p-4 flex-auto">
                            <div className="relative h-350-px">
                              <canvas width="221" height="291" style={{
                                  display: "block",
                                  boxSizing: "border-box",
                                  height: "350px",
                                  width: "265.7px"}} id="bar-chart"></canvas>
                            </div>
                        </div>
                      </div>
                  </div>
                </div> */}
                {/* <div className="flex flex-wrap">
                  <div className="w-full xl:w-8/12 px-4">
                      <div className="relative flex flex-col min-w-0 break-words w-full mb-8 shadow-lg rounded-lg bg-white text-blueGray-700">
                        <div className="px-6 py-4 border-0">
                            <div className="flex flex-wrap items-center">
                              <div className="relative w-full max-w-full flex-grow flex-1">
                                  <h3 className="font-bold text-lg text-blueGray-700">Page visits</h3>
                              </div>
                            </div>
                        </div>
                        <div className="block w-full overflow-x-auto">
                            <table className="items-center w-full bg-transparent border-collapse">
                              <thead>
                                  <tr>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200">Page name</th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200">Visitors</th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200">Unique Users</th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200">Bounce Rate</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center"><span className="ml-3 font-bold NaN">/argon/</span></div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center">4,569</div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center">340</div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center"><i className="fas fa-arrow-up mr-2 text-emerald-500"></i>46,53%</div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center"><span className="ml-3 font-bold NaN">/argon/index.html</span></div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center">3,985</div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center">319</div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center"><i className="fas fa-arrow-down mr-2 text-orange-500"></i>46,53%</div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center"><span className="ml-3 font-bold NaN">/argon/charts.html</span></div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center">3,513</div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center">294</div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center"><i className="fas fa-arrow-down mr-2 text-orange-500"></i>36,49%</div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center"><span className="ml-3 font-bold NaN">/argon/tables.html</span></div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center">2,050</div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center">147</div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center"><i className="fas fa-arrow-up mr-2 text-emerald-500"></i>50,87%</div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center"><span className="ml-3 font-bold NaN">/argon/profile.html</span></div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center">1,795</div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center">190</div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center"><i className="fas fa-arrow-up mr-2 text-red-500"></i>46,53%</div>
                                    </td>
                                  </tr>
                              </tbody>
                            </table>
                        </div>
                      </div>
                  </div>
                  <div className="w-full xl:w-4/12 px-4">
                      <div className="relative flex flex-col min-w-0 break-words w-full mb-8 shadow-lg rounded-lg bg-white text-blueGray-700">
                        <div className="px-6 py-4 border-0">
                            <div className="flex flex-wrap items-center">
                              <div className="relative w-full max-w-full flex-grow flex-1">
                                  <h3 className="font-bold text-lg text-blueGray-700">Social traffic</h3>
                              </div>
                            </div>
                        </div>
                        <div className="block w-full overflow-x-auto">
                            <table className="items-center w-full bg-transparent border-collapse">
                              <thead>
                                  <tr>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200">Referral</th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200">Visitors</th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200"></th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center"><span className="ml-3 font-bold NaN">Facebook</span></div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center">1,480</div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 min-w-140-px">
                                        <div className="flex items-center">
                                          <span className="mr-2">60%</span>
                                          <div className="relative w-full">
                                              <div className="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                                                <div 
                                                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500" style={{width: "60%"}}></div>
                                              </div>
                                          </div>
                                        </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center"><span className="ml-3 font-bold NaN">Facebook</span></div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center">5,480</div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 min-w-140-px">
                                        <div className="flex items-center">
                                          <span className="mr-2">70%</span>
                                          <div className="relative w-full">
                                              <div className="overflow-hidden h-2 text-xs flex rounded bg-emerald-200">
                                                <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500" style={{width:"70%"}}></div>
                                              </div>
                                          </div>
                                        </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center"><span className="ml-3 font-bold NaN">Google</span></div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center">4,807</div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 min-w-140-px">
                                        <div className="flex items-center">
                                          <span className="mr-2">80%</span>
                                          <div className="relative w-full">
                                              <div className="overflow-hidden h-2 text-xs flex rounded bg-indigo-200">
                                                <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500" style={{width: "80%"}}></div>
                                              </div>
                                          </div>
                                        </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center"><span className="ml-3 font-bold NaN">Instagram</span></div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center">3,678</div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 min-w-140-px">
                                        <div className="flex items-center">
                                          <span className="mr-2">75%</span>
                                          <div className="relative w-full">
                                              <div className="overflow-hidden h-2 text-xs flex rounded bg-lightBlue-200">
                                                <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-lightBlue-500" style={{width: "75%"}}></div>
                                              </div>
                                          </div>
                                        </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center"><span className="ml-3 font-bold NaN">Twitter</span></div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex items-center">2,645	</div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 min-w-140-px">
                                        <div className="flex items-center">
                                          <span className="mr-2">30%</span>
                                          <div className="relative w-full">
                                              <div className="overflow-hidden h-2 text-xs flex rounded bg-amber-200">
                                                <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500" style={{width: "30%"}}></div>
                                              </div>
                                          </div>
                                        </div>
                                    </td>
                                  </tr>
                              </tbody>
                            </table>
                        </div>
                      </div>
                  </div>
                </div> */}
                <footer className="block py-4">
                  <div className="container mx-auto px-4">
                      <hr className="mb-4 border-b-1 border-blueGray-200" />
                      <div className="flex flex-wrap items-center md:justify-between justify-center">
                        <div className="w-full md:w-4/12 px-4">
                            <div className="text-center mb-2 md:text-left md:mb-0 text-sm text-blueGray-500 font-semibold py-1">Copyright © 2023</div>
                        </div>
                        {/* <div className="w-full md:w-8/12 px-4">
                            <ul className="flex flex-wrap list-none md:justify-end  justify-center">
                              <li><a href="https://www.creative-tim.com?ref=npr-footeradmin" target="_blank" className="text-blueGray-700 hover:text-blueGray-900 text-sm font-semibold block py-1 px-3">Creative Tim</a></li>
                              <li><a href="https://www.creative-tim.com/presentation?ref=npr-footeradmin" target="_blank" className="text-blueGray-700 hover:text-blueGray-900 text-sm font-semibold block py-1 px-3">About Us</a></li>
                              <li><a href="https://www.creative-tim.com/blog/?ref=npr-footeradmin" target="_blank" className="text-blueGray-700 hover:text-blueGray-900 text-sm font-semibold block py-1 px-3">Blog</a></li>
                              <li><a href="https://www.creative-tim.com/license?ref=npr-footeradmin" target="_blank" className="text-blueGray-700 hover:text-blueGray-900 text-sm font-semibold block py-1 px-3">Licenses</a></li>
                            </ul>
                        </div> */}
                      </div>
                  </div>
                </footer>
            </div>
          </div>
      </div>
    );
}



export default DashBoard;