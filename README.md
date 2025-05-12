## 250509

- 어제: multer 설정했음 (app.js)

- MVC 패턴으로 API 서버 만들기
- 스프린트에서 제공한 API구조와 동일하게 만드는 것이 목표 (controllers/services/models)

[오전10:20] 가장 먼저 해야 할건 컨트롤러에서
request를 잘 받는지[요청을 받고 에러도 잘 뱉음 -> 일단 request-response가 동작하지만 로직 오류가 있다는 뜻, 연결이 되었다는 뜻]
DB 연결이 되어있는지[프리즈마 스튜디오 포트5555 를 열었을때 구조가 잘 짜여져있고, 스튜디오상에서 데이터 CRUD OK]

[오전11:28] GET http://localhost:3000/articles/:id 주소로 요청 보내 DB에 들어간 개별데이터 확인 완료. /:id 없는 목록 조회도 OK.

[오전11:50] "Please authenticate" :: 게시물 등록하기에서 인증/인가 구현필요한듯?

[오후14:30] 회원가입 하고, 로그인 해서 얻은 토큰으로 게시물 등록하기 OK, auth.middleware.js 사용함.

[오후15:20] MVC 패턴이 완성되지 않음 -> controller 레이어에 로직이 모두 뭉쳐져있음
프리즈마 클라이언트를 사용하는 코드만 떼서 - model 레이어로 옮기고
controller레이어는 사용자의응답을 받고 service에 요청하고 응답하는 것만 집중하고,
service 레이어는 컨트롤러에서 넘어온 data를 활용할 수 있고,
일단 service레이어에서 기본적으로 model을 호출하고 있는 상태가 기본형으로 보인다.

- 위 구조가 잡히고 나서 추가적인 서비스로직은 service레이어에 작성하면 되고,
  만약 req가 들어올때 추가적인 관문들(req가 controller에 도착하기 전까지 미리 들어오자마자 선처리해줘야하는 미들웨어들, 은 route에서 기본적으로 엔드포인트를 정의하며 미들웨어를 거쳐 최종적으로 controller에 도달하게끔만 설계하면 된다?)
- 그렇다면 express에서 MVC 구조의 가장 명확한 관심사를 분리해보자면..

* routes Layer: 엔드포인트를 정의하고 요청을 컨트롤러로 안내. (미들웨어 적용가능)
* controller Layer: routes Layer의 호출을 받고, service Layer를 호출시킴.
* service Layer: controller Layer의 호출을 받고, model Layer를 호출시킴.
* model Layer: 프리즈마 클라이언트가 존재하는 레이어로, DB에 직접 요청을 보내고 반환하는 것에만 관심이 있음.

- 250512

http 파일들 작성해보고, 필요한 만큼(product) 작성한 후에 테스트해보고 MVC 분리 ㄱㄱ

등록이랑 조회들 잘 돼서, 일단 product만 MVC 분리 ㄱㄱ

[오전10:10] product 전체조회,개별조회,등록하기 MVC패턴 분리 완료 , 등록도? OK -> 커밋
