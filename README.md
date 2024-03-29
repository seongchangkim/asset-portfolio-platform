# asset-portfolio-platform

## asset-portfolio-platform
자산 포트폴리오 플랫폼 서버와 웹 클라이언트를 구현한 웹 프로젝트이며 로그인, 로그아웃, 소셜 로그인, 회원가입, 프로필 상세보기, 프로필 수정 및 회원 탈퇴를 통해 회원이 웹 서비스를 이용할 수 있도록 구현했고 만약 관리자 회원 권한으로 로그인하면 회원 목록(페이지 처리 및 검색 기능), 회원 상세보기 그리고 회원 수정/삭제 기능을 통해 회원 관리할 수 있도록 구현했습니다. 마지막으로 웹 사이트를 통해 자산 포트폴리오에 관한 CRUD 기능을 통해 해당 회원의 자산 포트폴리오를  관리할 수 있도록 구현했습니다.  

<br>
● 제작기간 : 2023.07.09~2023.08.19[2023.07.14~2023.07.18 및 2023.08.01(6일) 제외](36일)(1인 프로젝트)

### 개발 환경
> 1. Next.js 13.4.9<br/>
> 2. JavaScript(ES6)<br/>
> 3. Node.js 18.12.1<br/>
> 4. Express.js 4.18.2<br/>
> 5. React.js 18.2.0<br/>
> 6. Tailwindcss 3.3.2<br/>
> 7. AWS EC2(ubuntu)<br/>
> 8. MySQL 8.0.33

### IDE
> 1. Visual Studio Code<br/>

## API 소개
### 1. Member API
|Url|Http Method|기능|Parameter
|:---|:---:|:---:|:---:|
|/api/member|POST|회원가입|○email(String)<br/> ○password(String)<br/> ○name(String)<br/> ○tel(String)<br/> ○social_login_type(String)
|/api/member/login|POST|로그인|○email(String)<br/> ○password(String)
|/api/member/auth|GET|로그인 여부|-
|/api/member/logout|POST|로그아웃|○id(Web: Number)
|/api/member/social-login/:socialLoginType|POST|소셜 로그인|○authCode(String)<br/> <b>또는</b><br/> ○token(String)<br/> ○email(String)<br/> ○name(String)<br/> 
|/social-login/auth/:socialLoginType/:id|GET|소셜 로그인 체크 여부|-
|/api/member/:id|POST|프로필 상세보기|-
|/api/member/:id|PATCH|프로필 수정|○profileUrl(String)<br/> ○name(String)<br/> ○tel(String)<br/>
<br/>

### 2. Admin API
|Url|Http Method|기능|Parameter
|:---|:---:|:---:|:---:|
|/api/admin/members|GET|회원 목록(페이징 처리 및 검색)|○category(String)[OPTION]<br/> ○keyword(String)[OPTION]<br/> ○page(number)<br/>
|/api/admin/member/:id|GET|회원 상세보기|-
|/api/admin/member/:id|PATCH|회원 수정|○profileUrl(String)<br/> ○email(String)<br/> ○name(String)<br/> ○tel(String)<br/> ○authRole(String)<br/>
|/api/admin/member/:id|DELETE|회원 삭제 및 회원 탈퇴|-
<br/>

### 3. ASSET-PORTFOLIO-PLATFORM API
|Url|Http Method|기능|Parameter
|:---|:---:|:---:|:---:|
|/api/asset-portfolio|POST|자산 포트폴리오 생성|○portfolio(object)<br/> ○assets(array)
|/api/asset-portfolio/:asset_port_id|PUT|자산 포트폴리오 수정|○portfolio(object)<br/> ○assets(array)
|/api/asset-portfolio/:asset_port_id|DELETE|자산 포트폴리오 삭제|-

※ 속성이 email이고 데이터 타입이 String이면 email(String)으로 작성했습니다.

## 테이블 구조
<img width="920" alt="image" src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/6eda2fa5-9553-4a3c-b47b-7daddfb9b20c" />

## 서버에서 적용했던 주요 기술
● 가계부 플랫폼과 마찬가지로 jsonwebtoken npm 모듈을 통해 JWT 토큰 부분을 설정한 다음에 JWT 토큰 인증 방식으로 회원을 인증하도록 하여 서버에 부담을 덜하도록 했습니다.

## 주요 기능 및 페이지
### 1. 로그인
<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/9723c216-2cd8-42f4-b66b-9b07683a5126"></p>
<p align="center">이메일 또는 비밀번호 불일치 시 로그인</p>

<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/0a2fae71-6b7d-4750-8a64-63f12c78d86b"></p>
<p align="center">로그인 성공</p>

<br/>
- 로그인 페이지에서 이메일과 비밀번호를 입력하여 로그인 API를 POST 방식으로 호출하여 입력한 이메일과 비밀번호 값을 들고 서버에 request해서 작동한 다음에 DB에서 이메일로 일치한 데이터를 조회하고 비밀번호를 암호화하여 DB에서 암호화된 비밀번호가 있는지 조회합니다. 만약 DB에서 이메일과 비밀번호가 둘 다 일치한 DB가 있으면 로그인 성공되어 홈 화면으로 이동합니다. 그렇지 않으면 비밀번호 또는 이메일이 일치하지 않는 알림창을 띄우도록 설정합니다.

### 2. 회원가입
<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/96073454-269b-4db7-96d0-3a5ef1953989" /></p>
<p align="center">회원가입 성공</p>

<br/>
- 로그인 페이지에서 회원가입 부분을 누르면 회원가입 페이지가 이동되는데 회원정보를 입력하여 회원가입 버튼을 클릭하면 회원가입 API를 POST 방식으로 호출하여 입력한 회원정보를 들고 서버에 request한 뒤에 해당 회원정보를 바탕으로 회원 데이터가 추가되고 서버에서 response 값을 받아서 회원가입이 성공하면 로그인 페이지로 이동합니다.

### 3. 로그아웃
<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/bc0d7742-0bc8-45f0-a784-4193b70f0e32" /></p>

<br/>
- nav 쪽에 프로필 이미지를 클릭한 뒤에 로그아웃 부분에 클릭하면 로그아웃 API를 POST 방식으로 호출하여 사용자 id를 들고 request한 다음에 DB안에 해당 회원 id를 찾아서 token를 빈 문자열으로 수정한 뒤에 x_auth 토큰에 대한 쿠키를 삭제하면서 클라이언트에게 response 값을 보냅니다. 만약 로그아웃이 성공하면 마지막으로 회원 상태 저장소를 빈 객체로 초기화시키고 로그인 페이지로 이동합니다.

### 4. 프로필 상세보기/수정 및 회원 탈퇴
<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/a9629b32-7ddf-4ab2-8c57-cf3114088fb3"></p>
<p align="center">프로필 상세보기</p>

<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/afe079aa-6f2f-4f16-881d-8c2c0531374b"></p>
<p align="center">프로필 상세보기 - 잘못된 접근</p>

<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/bd448aaf-a65e-4777-930b-55f8fc2443a6"></p>
<p align="center">프로필 수정(프로필 이미지 수정 없이)</p>

<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/fe11e100-c1f4-46e2-8469-ceac2a14a1c3"></p>
<p align="center">프로필 수정(프로필 이미지 수정 포함)</p>

<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/8facca38-71ec-4eea-a652-18a90aad84b3"></p>
<p align="center">회원 탈퇴</p>

1). 프로필 상세보기 : nav 쪽에 프로필 이미지를 클릭한 뒤에 My 프로필을 클릭하면 My 프로필 페이지에 이동하는 동안 프로필 상세보기 API를 호출하여 request해서 작동한 뒤 그리고 DB에 해당 회원을 조회한 다음에 response값으로 받아서 회원 상태 저장소 안에 있는 token 값과 response 값 안에 있는 token 값을 비교하여 일치하면 My 프로필 페이지에 렌더링하고 그렇지 않으면 잘못된 접근 알림창을 띄우고 확인 버튼을 누르면 알림창이 없어지면서 이전 페이지로 이동합니다.</br></br>
2). 프로필 수정 : My 프로필에서 수정하고자 이름, 이메일 또는 프로필 이미지를 수정하여 수정 버튼을 누르면 프로필 수정 API을 호출하여 수정하고자 회원 정보 값을 들고 request해서 작동한 뒤 DB에서 해당 회원의 id으로 조회하여 조회된 회원 데이터에 수정되고 last_modified_at 칼럼에 해당 API를 호출했던 시점으로 수정됩니다. 그리고 프로필 수정이 성공하면 프로필 수정 알림창을 띄우고 확인 버튼을 누르면 알림창이 없어지면서 리렌더링합니다.</br></br>
3). 회원 탈퇴 : My 프로필에서 회원 탈퇴 버튼을 클릭하면 회원 삭제 API를 호출하여 request해서 작동한 뒤 DB에 해당 회원 데이터를 조회하여 조회된 회원 데이터는 삭제되어 회원 탈퇴가 성공하면 회원 탈퇴 알림창이 띄우고 확인 버튼을 누르면 알림창이 없어지면서 로그인 페이지로 이동합니다.

### 5. 소셜 로그인(카카오, 구글) 
1). 카카오 로그인
<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/38a48304-d0c9-4cdb-9519-12e33777a470" /></p>
<p align="center">연동 계정이 존재하지 않을 때 카카오 로그인</p>

<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/4283a763-e9ff-42a6-9d75-e6d7bc7180a9" /></p>
<p align="center">연동 계정이 존재할 때 카카오 로그인</p>

- 로그인 페이지에서 카카오 로그인을 누르면 소셜 로그인 로딩 페이지로 리다이렉트하면서 소셜 로그인 API를 request하여 카카오 토큰 가져오기 API(카카오 외부 API)를 호출한 뒤 카카오 토큰을 얻어서 카카오 프로필 정보 가져오기 API(카카오 외부 API)를 호출하여 카카오 프로필 정보를 가져와서 서버에서 소셜 로그인 계정 존재 여부 확인한 다음에 DB에서 소셜 로그인 회원 계정이 존재하는지 확인합니다. 해당 카카오 계정이 존재하면 로그인하여 홈 화면으로 이동하고 없으면 카카오 프로필 정보를 들고 회원가입 페이지로 이동합니다. 회원가입 페이지에서 회원 정보를 입력하여 회원가입 버튼을 클릭하면 입력한 회원정보를 들고 request해서 DB에 저장되고 서버에서 response 값을 받아서 회원가입 성공하므로 해당 카카오 계정으로 로그인하여 홈 화면으로 이동합니다.
<br/><br/>

2). 구글 로그인
<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/a0d5db4b-1c5d-40b6-99b3-0deaacf42c63" /></p>
<p align="center">연동 계정이 존재하지 않을 때 구글 로그인</p>

<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/dbaadfc0-4ce8-4375-9650-efc545ecad91" /></p>
<p align="center">연동 계정이 존재할 때 구글 로그인</p>

- 로그인 페이지에서 구글 로그인을 누르면 소셜 로그인 로딩 페이지로 이동하면서 소셜 로그인 API를 request하여 구글 토큰 가져오기 API(구글 외부 API)를 호출한 뒤 구글 토큰을 얻어서 구글 프로필 정보 가져오기 API(구글 외부 API)를 호출하여 구글 프로필 정보를 가져와서 서버에서 소셜 로그인 계정 존재 여부 확인한 다음에 DB에서 소셜 로그인 회원 계정이 존재하는지 확인합니다. 해당 구글 계정이 존재하면 로그인하여 홈 화면으로 이동하고 없으면 구글  프로필 정보를 들고 회원가입 페이지로 이동합니다. 회원가입 페이지에서 회원 정보를 입력하여 회원가입 버튼을 클릭하면 입력한 회원정보를 들고 request해서 DB에 저장되고 서버에서 response 값을 받아서 회원가입 성공하므로 해당 구글 계정으로 로그인하여 홈 화면으로 이동합니다.

### 6. 로그인 체크
<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/4c595da2-8451-4c19-8d52-45cec1e19b7c" /></p>
<p align="center">로그인된 상태로 로그인 체크</p>

<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/1250271e-8136-4cca-85fe-c570731458ab" /></p>
<p align="center">로그인되지 않는 상태로 로그인 체크</p>

로그인 URL를 입력하여 들어가면 로그인 체크 API를 호출하게 되는데 x_auth에 대한 쿠키를 존재하는지 확인하고 존재하면 x_auth 안에 있는 토큰을 가져와서 그 토큰이 유효하는지 체크한 뒤에 유효하면 회원 정보 및 자산 포트폴리오 정보를 담긴 response 값을 클라이언트에 보내고 클라이언트는 그것을 받는 다음에 회원 상태 저장소 및 자산 포트폴리오 상태 저장소를 저장하여 홈 화면으로 이동합니다. 유효하지 않으면 회원 상태 저장소 및 자산 포트폴리오 상태 저장소를 빈 객체로 저장하여 로그인 페이지로 이동합니다. 그리고 소셜 로그인되는 경우에는 소셜 로그인 체크 API를 호출하여 회원 및 자산 포트폴리오 데이터를 조회하여 로그인 체크와 마찬가지로 그 값들을 response 값에 담아서 클라이언트는 그것을 받는 다음에 회원 상태 저장소 및 자산 포트폴리오 상태 저장소를 저장하여 홈 화면으로 이동합니다.

### 7. 회원 목록
<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/0708b8d7-f030-45f6-917f-b227c9bd90c4" /></p>
<p align="center">회원 목록</p>

<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/5ae91aff-bdee-47db-b565-67c2cdf7a7a9" /></p>
<p align="center">페이징 처리</p>

<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/86bfd75d-6d8c-459d-a378-21e0b821c5b9" /></p>
<p align="center">검색 및 페이지 처리</p>

1). 회원 목록 : 홈 화면에서 회원 목록 페이지 들어가는 동안에 회원 목록 api를 호출하여 서버로부터 response 값을 받아서 페이지 처리에 필요한 값이나 회원 목록 데이터를 받아서 회원 목록 페이지에 렌더링합니다.<br /><br />
2). 페이지 처리 : 맨 밑에 페이지 처리 관련 UI가 있는데 회원 목록 개수에 따라 페이지 수를 렌더링했습니다. 그중에서 <(이전 페이지) 누르면 이전 페이지로 이동하면서 이전 페이지에 대한 response 값을 받으면서 회원 목록 페이지를 리렌더링을 하고 >(다음 페이지)로 누르면 다음 페이지에 대한 response 값을 받으면서 회원 목록 페이지를 리렌더링을 합니다. 그리고 해당 페이지를 누르면 해당 페이지에 대한 response 값을 받으면서 회원 목록 페이지를 리렌더링을 합니다. 그리고 처음 페이지로 이동하면 이전 페이지 아이콘이 사라지고 맨 마지막 페이지로 이동하면 다음 페이지 아이콘이 사라지도록 설정했습니다.<br /><br />
3). 검색 기능 : 맨 오른쪽에 검색 UI가 있는데 검색 카테고리를 고르고 검색어를 입력하면 회원 목록 api를 호출하여 그 검색 카테고리에 대한 데이터를 검색어와 비슷한 단어를 조회하는 다음에 웹 클라이언트에 reponse 값으로 페이지 처리에 필요한 값이나 회원 목록 데이터를 받아서 회원 목록 페이지에 리렌더링합니다.

### 8. 회원 상세보기/수정/삭제
<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/28757647-260d-44ce-8e95-66044cceb4a5" /></p>
<p align="center">회원 상세보기</p>

<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/f5ea6b8c-3f5c-4ebf-81b6-8dc47c24febf" /></p>
<p align="center">회원 수정(프로필 이미지 수정 없이)</p>

<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/8201c1be-1e3a-4636-abc4-5aa955f2812f" /></p>
<p align="center">회원 수정(프로필 이미지 수정)</p>

<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/c4b3122f-b4da-4713-95ab-5c5be203557e" /></p>
<p align="center">회원 삭제</p>

<br/>
1). 회원 상세보기 : 회원 목록 페이지에서 해당 회원 이름을 클릭하면 회원 상세보기 웹 페이지에 이동하면서 회원 상세보기 API를 호출한 뒤에 렌더링합니다. <br /><br />
2). 회원 수정 : 회원 상세보기 페이지에서 수정하고자 프로필 이미지 경로, 이름, 전화번호 및 회원 권한을 수정하여 수정 버튼을 클릭하면 회원 수정 API를 호출하여 수정하고자 프로필 이미지 경로, 이름, 전화번호 및 회원 권한을 request 값으로 들고 서버에 요청한 뒤에 DB에서 해당 회원을 조회해서 조회된 회원 데이터에 수정하고자 정보들로 수정하고 last_modified_at 칼럼에 해당 API를 호출했던 시점으로 수정됩니다. 그다음에 회원 수정이 성공하면 회원 수정 알림창이 뜨고 회원 수정 알림창에 확인 버튼을 누르면 회원 상세보기 페이지에서 리렌더링됩니다. <br /><br />
3). 회원 삭제 : 회원 상세보기 페이지에서 삭제를 누르면 회원 탈퇴 API를 호출함을 통해 request를 받고 DB에서 해당 회원 id로 조회하여 해당 회원과 일치하면 조회된 회원 데이터를 삭제되어 회원 삭제 처리가 성공하면 회원 삭제 알림창을 띄우고 회원 삭제 알림창에서 확인 버튼을 클릭하면 이전 페이지로 이동됩니다.

### 9. 회원 권한에 따라 허용된 페이지, 로그인이 필요한 페이지 및 다른 회원 프로필 페이지 접근 금지
<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/bbf21f57-7827-4287-9e70-f04010d610e9" /></p>
<p align="center">회원 권한에 따라 허용된 페이지</p>

<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/d5718b90-64c5-4d14-8626-ee6129e9e442" /></p>
<p align="center">로그인이 필요한 페이지</p>

<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/1e2096f7-d1e7-45fe-bab4-3e41c3d1a13e" /></p>
<p align="center">다른 회원 프로필 페이지 접근 금지</p>

<br/>
1). 회원 권한에 따라 허용된 페이지 : 로그인되지 않는 상태 또는 회원 권한으로 로그인한 상태로 관리자 전용 페이지로 접근하면 관리자 전용 페이지 알림창을 띄우고 확인 버튼을 누르면 로그인 페이지로 리다이렉트합니다. <br /><br />
2). 로그인이 필요한 페이지 : 로그인되지 않는 상태로 회원 전용 페이지로 접근하면 로그인 페이지로 리다이렉트합니다. <br /><br />
3). 다른 회원 프로필 페이지 접근 금지 : 다른 회원의 프로필 페이지에 접근하면 잘못된 접근 알림창이 띄우고 확인 버튼을 누르면 이전 페이지로 이동합니다.

### 10. 자산 포트폴리오 생성/상세보기/수정/삭제
<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/c5bda05f-0fcd-4827-b90e-10413c8517a1" /></p>
<p align="center">자산 포트폴리오 생성</p>

<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/2ece96ac-b0c4-4b5d-875e-b6d86dd6b336" /></p>
<p align="center">자산 포트폴리오 수정</p>

<p align="center"><img src="https://github.com/seongchangkim/asset-portfolio-platform/assets/74657556/bb56b87c-de31-4301-ad15-77b1954cf496" /></p>
<p align="center">자산 포트폴리오 삭제</p>

<br/>
1). 자산 포트폴리오 상세보기(홈 화면) : 홈 화면에서 로그인, 소셜 로그인 또는 로그인 체크 API를 통해 저장했던 자산 포트폴리오 상태 저장소를 통해 자산 포트폴리오 상세정보를 그래프를 시각화하고 렌더링합니다.</br></br>
2). 자산 포트폴리오 생성 : 홈 화면에서 '자산 포트폴리오 생성하러 가기 ->' 부분을 클릭하면 자산 포트폴리오 생성 페이지로 이동합니다. 여기서 자산 포트폴리오 이름, 초기 금액(원)을 입력하고 '+ 추가' 버튼을 누르면 추가할 자산 및 자산 비율을 추가로 입력할 수 있습니다. 입력한 값을 바탕으로 생성 버튼을 클릭하고 자산 포트폴리오 생성 API를 호출하여 입력한 값을 들고 request하여 DB에 해당 자산 포트폴리오를 생성되고 해당 자산 포트폴리오 생성이 성공하면 자산 포트폴리오 상태 저장소에 생성된 자산 포트폴리오 데이터를 저장해서 이전 페이지로 이동합니다. </br></br>
3). 자산 포트폴리오 수정 : 홈 화면에서 오른쪽 위쪽에 수정 버튼을 클릭하면 자산 포트폴리오 수정 페이지로 이동합니다. 여기서 자산 포트폴리오 이름 또는 초기 금액(원)을 수정하거나 자산 포트폴리오 생성 부분과 마찬가지로 '+ 추가' 버튼을 누르면 추가할 자산 및 자산 비율을 추가로 입력할 수 있습니다. 수정할 값을 바탕으로 수정 버튼을 클릭하고 자산 포트폴리오 수정 API를 호출하여 입력한 값을 들고 request하여 DB에서 자산 포트폴리오 id 값으로 조회하여 조회된 자산 포트폴리오 데이터에 수정하고 last_modified_at 칼럼에 해당 API를 호출했던 시점으로 수정됩니다. 해당 자산 포트폴리오 수정이 성공하면 산 포트폴리오 상태 저장소에 수정된 자산 포트폴리오 데이터를 저장해서 이전 페이지로 이동합니다.</br></br>
4). 자산 포트폴리오 삭제 : 홈 화면에서 오른쪽 위쪽에 삭제 버튼을 클릭하면 가계부 삭제 API를 호출하여 request해서 작동한 뒤 DB에 자산 포트폴리오 id 값으로 조회하여 조회된 데이터를 삭제되어 해당 자산 포트폴리오 삭제가 성공하면 자산 포트폴리오 상태 저장소를 비우고 홈 화면에서 리렌더링합니다.
