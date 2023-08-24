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
- 로그인 페이지에서 회원가입 부분을 누르면 회원가입 페이지가 이동되는데 회원정보를 입력하여 회원가입 버튼을 클릭하면 회원가입 API를 POST 방식으로 호출하여 입력한 회원정보를 들고 서버에 request한 뒤에 해당 회원정보를 바탕으로 회원 데이터가 추가되고 서버에서 response값을 받아서 회원가입이 성공하면 로그인 페이지로 이동합니다.


