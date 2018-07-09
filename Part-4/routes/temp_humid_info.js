/*
 * 온도/습도 정보 처리 모듈
 */
// var listInfo = function(req, res){
//   console.log('/process/listInfo 호출됨 ');
//   var paramId = req.body.id || req.query.id;
//   var paramPassword = req.body.password || req.query.password;
//
//   console.log('로그인 요청 파라미터 : ' + paramId + ', ' + paramPassword);
//   console.log('세션 유저 정보 : '+req.session.user);
//   if(req.session.user){
//     console.log('이미 로그인 되어 메인 페이지로 이동합니다.');
//     res.redirect('/index.html');
//
//   }
//   //데이터베이스 객체 참조
//   var database = req.app.get('database');
//
//   // 데이터베이스 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
//   if(database.db){
//     authUser(database, paramId, paramPassword, function(err, docs){
//       if(err){
//         console.error('사용자 로그인 중 에러 발생 : ' + err.stack);
//
//         res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
//         res.write('<h2>사용자 로그인 중 에러 발생</h2>');
//         res.write('<p>' + err.stack + '</p>');
//         res.end();
//         return;
//       }
//
//       if(req.session.user){
//         console.log('이미 로그인 되어 메인 페이지로 이동합니다.');
//         res.redirect('/index.html');
//       }else{
//         console.log('세션에 로그인 정보가 없습니다 ===.');
//
//       }
//       // 조회된 레코드가 있으면 성공 응답 전송
//       if(docs){
//         console.dir(docs);
//         // 조회 결과에서 사용자 이름 확인
//         var username = docs[0].name;
//         // res.session["user"] = {id:paramId, password : paramPassword};
//
//         res.redirect('/index.html');
//       }else {  // 조회된 레코드가 없는 경우 실패 응답 전송
// 				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
// 				res.write('<h1>로그인  실패</h1>');
// 				res.write('<div><p>아이디와 패스워드를 다시 확인하십시오.</p></div>');
// 				res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
// 				res.end();
// 			}
//     });
//   }else{ // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
//     res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
//     res.write('<h2>데이터베이스 연결 실패 </h2>');
//     res.write('<div><p>데이터베이스에 연결하지 못했습니다. '+username+'</p></div>');
//     res.end();
//   }
// };
//
// var adduser = function(req, res) {
// 	console.log('user(user2.js) 모듈 안에 있는 adduser 호출됨.');
//
// 	  var paramId = req.body.id || req.query.id;
//     var paramPassword = req.body.password || req.query.password;
//     var paramName = req.body.name || req.query.name;
//
//     console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName);
//
//     // 데이터베이스 객체 참조
// 	var database = req.app.get('database');
//
//     // 데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
// 	if (database.db) {
// 		addUser(database, paramId, paramPassword, paramName, function(err, addedUser) {
//             // 동일한 id로 추가하려는 경우 에러 발생 - 클라이언트로 에러 전송
// 			if (err) {
//                 console.error('사용자 추가 중 에러 발생 : ' + err.stack);
//
//                 res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
// 				res.write('<h2>사용자 추가 중 에러 발생</h2>');
//                 res.write('<p>' + err.stack + '</p>');
// 				res.end();
//
//                 return;
//             }
//
//             // 결과 객체 있으면 성공 응답 전송
// 			if (addedUser) {
// 				console.dir(addedUser);
//         console.log("사용자 추가 성공, 로그인화면으로 갑니다.");
//         res.redirect("../public/login.html");
// 			} else {  // 결과 객체가 없으면 실패 응답 전송
//
//         console.log("사용자 추가 실패, 초기화면으로 갑니다.");
//         res.redirect("../public/smartoffice.html");
//
// 				// res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
// 				// res.write('<h2>사용자 추가  실패</h2>');
// 				// res.end();
// 			}
// 		});
// 	} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
// 		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
// 		res.write('<h2>데이터베이스 연결 실패</h2>');
// 		res.end();
// 	}
//
// };
// var listInfoByPage = function(req, res) {
//     console.log('temp_humid_info 모듈 안에 있는 listInfoById 호출됨.');
//
//       // 데이터베이스 객체 참조
//     var database = req.app.get('database');
//
//     // 데이터베이스 객체가 초기화된 경우, 모델 객체의 findByPage 메소드 호출
//     if (database.db) {
//       console.log("====== database db ======");
//       console.dir(database.db);
//       // 1. 모든 정보 검색
//       database.tempHuModel.findByPage(function(err, results) {
//         // 에러 발생 시, 클라이언트로 에러 전송
//         if (err) {
//           console.error('온도/습도 조회 중 에러 발생 : ' + err.stack);
//           res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
//           res.write('<h2>사용자 리스트 조회 중 에러 발생</h2>');
//           res.write('<p>' + err.stack + '</p>');
//           res.end();
//           return;
//         }
//
//         if (results) {
//           console.log("========results 출력====== ");
//           console.dir(results);
//           var response = new Array();
//           for(var i=0; i<results.length; i++){
//             var obj = {};
//             obj.humidity = results[i]._doc.humid;
//             obj.temperature = results[i]._doc.temp;
//             var tmpDate = new Date(results[i]._doc.date);
//             console.log("날짜 : ", tmpDate);
//             obj.originalDate = tmpDate;
//             response.push(obj);
//           }
//           res.statusCode = 200;
//           return res.send({"data":response});
//
//         } else {
//           res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
//           res.write('<h2>사용자 리스트 조회  실패</h2>');
//           res.end();
//         }
//       });
//     } else {
//       res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
//       res.write('<h2>데이터베이스 연결 실패</h2>');
//       res.end();
//     }
// };
var num = 1;
var listInfoById = function(req, res) {
    console.log('temp_humid_info 모듈 안에 있는 listInfoById 호출됨.');

      // 데이터베이스 객체 참조
    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우, 모델 객체의 findAll 메소드 호출
    if (database.db) {
      console.log("====== database db ======");
      // console.dir(database.db);
      // 1. 모든 정보 검색
      database.tempHuModel.findByPage(function(err, results) {
        // 에러 발생 시, 클라이언트로 에러 전송
        if (err) {
          console.error('온도/습도 조회 중 에러 발생 : ' + err.stack);
          // res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          // res.write('<h2>사용자 리스트 조회 중 에러 발생</h2>');
          // res.write('<p>' + err.stack + '</p>');
          // res.end();
          return;
        }
        //Data 조회 성공시
        if (results) {
          console.log("========@@@ findByPage results 출력 @@@====== ");
          // console.dir(results);
          var response = new Array();
          for(var i=0; i<results.length; i++){
            var obj = {};
            obj.humidity = results[0]._doc.humid;
            obj.temperature = results[0]._doc.temp;
            obj.date =  results[0]._doc.time.getTime();
            obj.originalDate = results[0]._doc.time;
            response.push(obj);
          }
          console.log("======== response ========");
          console.log(response);
          res.body = response;
          // res.statusCode = 200;
          return res.send({data:response});
        } else {
          // res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          // res.write('<h2>사용자 리스트 조회  실패</h2>');
          // res.end();
        }
      });

    } else {
      console.log("=====데이터베이스 연결 실패=====");
      // res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      // res.write('<h2>데이터베이스 연결 실패</h2>');
      // res.end();
    }
};


var listInfoAll = function(req, res) {
    console.log('temp_humid_info 모듈 안에 있는 listInfoByAll 호출됨.');

      // 데이터베이스 객체 참조
    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우, 모델 객체의 findAll 메소드 호출
    if (database.db) {
      console.log("====== database db ======");
      // console.dir(database.db);
      // 1. 모든 정보 검색
      database.tempHuModel.findAll(function(err, results) {
        // 에러 발생 시, 클라이언트로 에러 전송
        if (err) {
          console.error('온도/습도 조회 중 에러 발생 : ' + err.stack);
          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2>사용자 리스트 조회 중 에러 발생</h2>');
          res.write('<p>' + err.stack + '</p>');
          res.end();
          return;
        }
        //Data 조회 성공시
        if (results) {
          console.log("========@@@ findAll results 출력 @@@====== ");
          // console.dir(results);
          var response = new Array();
          for(var i=0; i<results.length; i++){
            var obj = {};
            obj.humidity = results[i]._doc.humid;
            obj.temperature = results[i]._doc.temp;
            obj.date =  results[i]._doc.time.getTime();
            obj.originalDate = results[i]._doc.time;
            response.push(obj);
          }
          res.body = response;
          res.statusCode = 200;
          return res.send({data:response});
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

var listInfoStat = function(req, res) {
    console.log('@@@ temp_humid_info 모듈 안에 있는 listInfoStat 호출됨.');

      // 데이터베이스 객체 참조
    var database = req.app.get('database');
    var responseMax = null;
    var responseMin = null;
    // 데이터베이스 객체가 초기화된 경우, 모델 객체의 findAll 메소드 호출
    if (database.db) {
      // console.log("====== database db ======");
      // console.dir(database.db);
      // 1. 최대습도/온도 정보 검색

      database.tempHuModel.findMax(function(err, results) {
        // 에러 발생 시, 클라이언트로 에러 전송
        if (err) {
          console.error('온도/습도 조회 중 에러 발생 : ' + err.stack);
          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2>사용자 리스트 조회 중 에러 발생</h2>');
          res.write('<p>' + err.stack + '</p>');
          res.end();
          return;
        }
        //Data 조회 성공시
        if (results) {
          console.log("#######=====##### results : ");
          console.log(results);
          var response = new Array();
          var obj = {};
          obj.maxHumidity = results[0]._doc.humid;
          obj.maxTemperature = results[0]._doc.temp;
          var tmpDate = new Date(results[0]._doc.date);
          obj.originalDate = tmpDate;
          response.push(obj);
          console.log("responseMax : ", response);

          responseMax = response;

        } else {
          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2>사용자 리스트 조회  실패</h2>');
          res.end();
        }
      });
        // 2. 최저습도/온도 정보 검색
      database.tempHuModel.findMin(function(err, results) {
        // 에러 발생 시, 클라이언트로 에러 전송
        if (err) {
          console.error('온도/습도 조회 중 에러 발생 : ' + err.stack);
          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2>사용자 리스트 조회 중 에러 발생</h2>');
          res.write('<p>' + err.stack + '</p>');
          res.end();
          return;
        }
        //Data 조회 성공시
        if (results) {
          var response = new Array();
          var obj = {};
          obj.maxHumidity = results[0]._doc.humid;
          obj.maxTemperature = results[0]._doc.temp;
          var tmpDate = new Date(results[0]._doc.date);
          obj.originalDate = tmpDate;
          response.push(obj);
          console.log("responseMin : ", response);
          responseMin = response;

        } else {
          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2>사용자 리스트 조회  실패</h2>');
          res.end();
        }
      });

      if(responseMax != null && responseMax != undefined &&
                    responseMin != null && responseMin != undefined){
        }
        res.statusCode = 200;
        return res.send([{"max":responseMax}, {"min":responseMin}]);
    } else {
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>데이터베이스 연결 실패</h2>');
      res.end();
    }
};


module.exports.listInfoAll = listInfoAll;
module.exports.listInfoById = listInfoById;
module.exports.listInfoStat = listInfoStat;
