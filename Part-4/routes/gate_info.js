/*
 * 출입 게이트 정보 처리 모듈
 */

var GateInfoAll = function(req, res) {
    console.log('gate_info 모듈 안에 있는 GateInfoAll 호출됨.');

      // 데이터베이스 객체 참조
    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우, 모델 객체의 findAll 메소드 호출
    if (database.db) {
      console.log("====== database db ======");
      // console.dir(database.db);
      // 1. 모든 정보 검색
      database.gateInOutModel.findAll(function(err, results) {
        // 에러 발생 시, 클라이언트로 에러 전송
        if (err) {
          console.error('출입기록 전체 조회 중 에러 발생 : ' + err.stack);
          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2>사용자 리스트 조회 중 에러 발생</h2>');
          res.write('<p>' + err.stack + '</p>');
          res.end();
          return;
        }
        //Data 조회 성공시
        if (results) {
          console.log("========@@@ 출입기록 전체조회 결과 findAll results 출력 @@@====== ");
          console.dir(results);
          var response = new Array();
          for(var i=0; i<results.length; i++){
            var obj = {};
            obj.remark = results[i]._doc.remark;
            obj.cnt = results[i]._doc.cnt;
            obj.cnt2 = results[i]._doc.cnt2;
            obj.date =  results[i]._doc.time.getTime();
            obj.originalDate = results[i]._doc.time;
            response.push(obj);
          }
          res.body = response;
          res.statusCode = 200;
          return res.send({data:response});
        } else {
          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2>사용자 출입기록  조회  실패</h2>');
          res.end();
        }
      });
    } else {
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>데이터베이스 연결 실패</h2>');
      res.end();
    }
};


//
// var responseMax = null;
// var responseMin = null;
//
// function getMax(database){
//   return new Promise(function (resolve, reject){
//   database.tempHuModel.findMax(function(err, results) {
//       console.log("herrrrrrrr?");
//       // 에러 발생 시, 클라이언트로 에러 전송
//       if (err) {
//         console.error('온도/습도 조회 중 에러 발생 : ' + err.stack);
//         reject();
//         res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
//         res.write('<h2>사용자 리스트 조회 중 에러 발생</h2>');
//         res.write('<p>' + err.stack + '</p>');
//         res.end();
//         return;
//       }
//       //Data 조회 성공시
//       if (results) {
//         console.log("#######=MAX=##### results : ");
//         console.log(results);
//         var response = new Array();
//         var obj = {};
//         obj.maxHumidity = results[0]._doc.humid;
//         obj.maxTemperature = results[0]._doc.temp;
//         obj.date = results[0]._doc.time.getTime();
//         obj.originalDate = results[0]._doc.time;
//         response.push(obj);
//         console.log("responseMax : ", response);
//         responseMax = response;
//         resolve();
//       } else {
//         console.log("####### results == null ###### : ");
//         reject();
//         res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
//         res.write('<h2>사용자 리스트 조회  실패</h2>');
//         res.end();
//       }
//
//     });
//   });
// }
// function getMin(database){
//   return new Promise(function (resolve, reject){
//     database.tempHuModel.findMin(function(err, results) {
//       // 에러 발생 시, 클라이언트로 에러 전송
//       if (err) {
//         console.error('온도/습도 조회 중 에러 발생 : ' + err.stack);
//         res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
//         res.write('<h2>사용자 리스트 조회 중 에러 발생</h2>');
//         res.write('<p>' + err.stack + '</p>');
//         res.end();
//         return;
//       }
//       //Data 조회 성공시
//       if (results) {
//         var response = new Array();
//         var obj = {};
//         console.log("#######=MIN=##### results : ");
//         console.log(results);
//         obj.minHumidity = results[0]._doc.humid;
//         obj.minTemperature = results[0]._doc.temp;
//         obj.date = results[0]._doc.time.getTime();
//         obj.originalDate = results[0]._doc.time;
//         response.push(obj);
//         console.log("responseMin : ", response);
//         responseMin = response;
//         resolve();
//       } else {
//         console.log("####### results == null ###### : ");
//         reject();
//         res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
//         res.write('<h2>사용자 리스트 조회  실패</h2>');
//         res.end();
//       }
//     });
//   });
// }

module.exports.GateInfoAll = GateInfoAll;
