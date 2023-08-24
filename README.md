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
|/api/member/:id|GET|프로필 상세보기|-
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
2). 프로필 수정 : My 프로필에서 수정하고자 이름, 이메일 또는 프로필 이미지를 수정하여 수정 버튼을 누르면 프로필 수정 API을 호출하여 수정하고자 회원 정보 값을 들고 request해서 작동한 뒤 DB에서 해당 회원의 id으로 조회하여 조회된 회원 데이터에 수정되고 last_modified_at는 해당 API를 호출했던 시점으로 수정됨. 그리고 프로필 수정이 성공하면 프로필 수정 알림창을 띄우고 확인 버튼을 누르면 알림창이 없어지면서 리렌더링합니다.</br></br>
3). 회원 탈퇴 : My 프로필에서 회원 탈퇴 버튼을 클릭하면 회원 삭제 API를 호출하여 request해서 작동한 뒤 DB에 해당 회원 데이터를 조회하여 조회된 회원 데이터는 삭제되어 회원 탈퇴가 성공하면 회원 탈퇴 알림창이 띄우고 확인 버튼을 누르면 알림창이 없어지면서 로그인 페이지로 이동합니다.

### 5. 소셜 로그인(카카오, 구글) 




