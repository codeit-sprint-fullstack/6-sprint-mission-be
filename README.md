- 250509

* 어제: multer 설정했음 (app.js)

* MVC 패턴으로 API 서버 만들기
* 스프린트에서 제공한 API구조와 동일하게 만드는 것이 목표 (controllers/services/models)

[오전10:20]가장 먼저 해야 할건 컨트롤러에서
request를 잘 받는지[요청을 받고 에러도 잘 뱉음 -> 일단 request-response가 동작하지만 로직 오류가 있다는 뜻, 연결이 되었다는 뜻]
DB 연결이 되어있는지[프리즈마 스튜디오 포트5555 를 열었을때 구조가 잘 짜여져있고, 스튜디오상에서 데이터 CRUD OK]

[오전11:28]GET http://localhost:3000/articles/:id 주소로 요청 보내 DB에 들어간 개별데이터 확인 완료. /:id 없는 목록 조회도 OK.

[오전11:50] "Please authenticate" :: 게시물 등록하기에서 인증/인가 구현필요한듯?

[오후13:00]
