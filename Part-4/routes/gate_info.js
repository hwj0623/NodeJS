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

var GateInStat = function(req, res) {
    console.log('gate_info 모듈 안에 있는 GateInStat 호출됨.');

    // 데이터베이스 객체 참조
    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우, 모델 객체의 findInCount 메소드 호출
    if (database.db) {
      console.log("====== database db ======");
      // console.dir(database.db);
      // 1. 모든 정보 검색
      database.gateInOutModel.findInCount(function(err, results) {
        // 에러 발생 시, 클라이언트로 에러 전송
        if (err) {
          console.error('출입기록 GateIn 조회 중 에러 발생 : ' + err.stack);
          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2>GateInStat 조회 중 에러 발생</h2>');
          res.write('<p>' + err.stack + '</p>');
          res.end();
          return;
        }
        //Data 조회 성공시
        if (results) {
          console.log("========@@@ 출입기록 In count 결과 findInCount results 출력 @@@====== ");
          console.dir(results);
          res.statusCode = 200;
          return res.send({data:results});
        } else {
          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2>사용자 출입기록  In count 조회  실패</h2>');
          res.end();
        }
      });
    } else {
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>데이터베이스 연결 실패</h2>');
      res.end();
    }
};
var GateOutStat = function(req, res) {
    console.log('gate_info 모듈 안에 있는 GateOutStat 호출됨.');
    // 데이터베이스 객체 참조
    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우, 모델 객체의 findInCount 메소드 호출
    if (database.db) {
      console.log("====== database db ======");
      // console.dir(database.db);
      // 1. 모든 정보 검색
      database.gateInOutModel.findOutCount(function(err, results) {
        // 에러 발생 시, 클라이언트로 에러 전송
        if (err) {
          console.error('출입기록 GateOut 조회 중 에러 발생 : ' + err.stack);
          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2>GateOutStat 조회 중 에러 발생</h2>');
          res.write('<p>' + err.stack + '</p>');
          res.end();
          return;
        }
        //Data 조회 성공시
        if (results) {
          console.log("========@@@ 출입기록 In count 결과 findOutCount results 출력 @@@====== ");
          console.dir(results);
          res.statusCode = 200;
          return res.send({data:results});
        } else {
          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2>사용자 출입기록  In count 조회  실패</h2>');
          res.end();
        }
      });
    } else {
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>데이터베이스 연결 실패</h2>');
      res.end();
    }
};

module.exports.GateOutStat = GateOutStat;
module.exports.GateInStat = GateInStat;
module.exports.GateInfoAll = GateInfoAll;
