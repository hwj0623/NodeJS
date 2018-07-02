/*
 * 사용자 정보 처리 모듈
 */
var login = function(req, res){
  console.log('/process/login 호출됨 ');
  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;

  console.log('로그인 요청 파라미터 : ' + paramId + ', ' + paramPassword);
  console.log('세션 유저 정보 : '+req.session.user);
  if(req.session.user){
    console.log('이미 로그인 되어 메인 페이지로 이동합니다.');
    res.redirect('/index.html');

  }
  //데이터베이스 객체 참조
  var database = req.app.get('database');

  // 데이터베이스 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
  if(database.db){
    authUser(database, paramId, paramPassword, function(err, docs){
      if(err){
        console.error('사용자 로그인 중 에러 발생 : ' + err.stack);

        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>사용자 로그인 중 에러 발생</h2>');
        res.write('<p>' + err.stack + '</p>');
        res.end();
        return;
      }

      if(req.session.user){
        console.log('이미 로그인 되어 메인 페이지로 이동합니다.');
        res.redirect('/index.html');
      }else{
        console.log('세션에 로그인 정보가 없습니다 ===.');

      }
      // 조회된 레코드가 있으면 성공 응답 전송
      if(docs){
        console.dir(docs);
        // 조회 결과에서 사용자 이름 확인
        var username = docs[0].name;
        // res.session["user"] = {id:paramId, password : paramPassword};

        res.redirect('/index.html');
      }else {  // 조회된 레코드가 없는 경우 실패 응답 전송
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인  실패</h1>');
				res.write('<div><p>아이디와 패스워드를 다시 확인하십시오.</p></div>');
				res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
				res.end();
			}
    });
  }else{ // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h2>데이터베이스 연결 실패 </h2>');
    res.write('<div><p>데이터베이스에 연결하지 못했습니다. '+username+'</p></div>');
    res.end();
  }

};
var adduser = function(req, res) {
	console.log('user(user2.js) 모듈 안에 있는 adduser 호출됨.');

	  var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;

    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName);

    // 데이터베이스 객체 참조
	var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
	if (database.db) {
		addUser(database, paramId, paramPassword, paramName, function(err, addedUser) {
            // 동일한 id로 추가하려는 경우 에러 발생 - 클라이언트로 에러 전송
			if (err) {
                console.error('사용자 추가 중 에러 발생 : ' + err.stack);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 추가 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();

                return;
            }

            // 결과 객체 있으면 성공 응답 전송
			if (addedUser) {
				console.dir(addedUser);
        console.log("사용자 추가 성공, 로그인화면으로 갑니다.");
        res.redirect("../public/login.html");
			} else {  // 결과 객체가 없으면 실패 응답 전송

        console.log("사용자 추가 실패, 초기화면으로 갑니다.");
        res.redirect("../public/smartoffice.html");

				// res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				// res.write('<h2>사용자 추가  실패</h2>');
				// res.end();
			}
		});
	} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}

};

var listuser = function(req, res) {
    console.log('user(user2.js) 모듈 안에 있는 listuser 호출됨.');

      // 데이터베이스 객체 참조
    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우, 모델 객체의 findAll 메소드 호출
    if (database.db) {
      // 1. 모든 사용자 검색
      database.UserModel.findAll(function(err, results) {
        // 에러 발생 시, 클라이언트로 에러 전송
        if (err) {
          console.error('사용자 리스트 조회 중 에러 발생 : ' + err.stack);

          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2>사용자 리스트 조회 중 에러 발생</h2>');
          res.write('<p>' + err.stack + '</p>');
          res.end();

          return;
        }

        if (results) {
          console.dir(results);

          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2>사용자 리스트</h2>');
          res.write('<div><ul>');

          for (var i = 0; i < results.length; i++) {
            var curId = results[i]._doc.id;
            var curName = results[i]._doc.name;
            res.write('    <li>#' + i + ' : ' + curId + ', ' + curName + '</li>');
          }

          res.write('</ul></div>');
          res.end();
        } else {
          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2>사용자 리스트 조회  실패</h2>');
          res.end();
        }
      });
    } else {
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>데이터베이스 연결 실패</h2>');
      res.end();
    }

};

/*
* 사용자 조회 함수 - authUser : 아이디로 먼저 찾고, 비밀번호를 그 다음에 비교
*/
var authUser = function(database, id, password, callback){
  console.log('authUser 호출됨 ');

  //1. 아이디를 사용해서 검색
  database.UserModel.findById(id, function(err, results){
    if(err){
      callback(err, null);
      return;
    }
    console.log('아이디[%s]로 사용자 검색 결과.', id);
    console.dir(results);

    if(results.length > 0){
      console.log('아이디와 일치하는 사용자 찾음.');
      //2. 비밀번호 확인 : 모델 인스턴스 객체를 만들고 authenticate() 메소드 호출
      var user = new database.UserModel({id:id});
      var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
      if(authenticated){
        console.log('비밀번호 일치함');
        callback(null, results);
      }else{
        console.log('비밀번호 불일치');
        callback(null, null);
      }

    }else{
      console.log('아이디와 일치하는 사용자 찾지 못함');
      callback(null, null);
    }

  });

};

/*
* 사용자 추가 함수 - addUser
*/
var addUser = function(database, id, password, name, callback){
  console.log('addUser 호출됨 : '+id+', '+password+' , '+name);

  //USerModel의 인스턴스 생성
  var user = new database.UserModel({"id":id, "password":password, "name":name});
  // save()로 저장
  user.save(function(err){
    if(err){
      callback(err, null);
      return;
    }
    console.log('사용자 데이터 추가함.');
    callback(null, user);
  });
}


module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser;
