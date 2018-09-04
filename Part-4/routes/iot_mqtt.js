/*
 * 출입 게이트 정보 처리 모듈
 */

 var awsIot = require('aws-iot-device-sdk');


var mqttOnCall = function(req, res) {
    console.log('iot_mqtt 모듈 안에 있는 mqttOnCall 호출됨.');

    //
    // // 데이터베이스 객체 참조
    // var database = req.app.get('database');
    //
    // // 데이터베이스 객체가 초기화된 경우, 모델 객체의 findInCount 메소드 호출
    // if (database.db) {
    //   console.log("====== database db ======");
    //   // console.dir(database.db);
    //   // 1. 모든 정보 검색
    //   database.gateInOutModel.findInCount(function(err, results) {
    //     // 에러 발생 시, 클라이언트로 에러 전송
    //     if (err) {
    //       console.error('mqttOnCall 중 에러 발생 : ' + err.stack);
    //       res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    //       res.write('<h2>GateInStat 조회 중 에러 발생</h2>');
    //       res.write('<p>' + err.stack + '</p>');
    //       res.end();
    //       return;
    //     }
    //     //Data 조회 성공시
    //     if (results) {
    //       console.log("========@@@ mqttOnCall 결과 출력 @@@====== ");
    //       console.dir(results);
    //       res.statusCode = 200;
    //       return res.send({data:results});
    //     } else {
    //       res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    //       res.write('<h2>사용자 출입기록  In count 조회  실패</h2>');
    //       res.end();
    //     }
    //   });
    // } else {
    //   res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    //   res.write('<h2>데이터베이스 연결 실패</h2>');
    //   res.end();
    // }
};
var mqttOffCall = function(req, res) {
    console.log('gate_info 모듈 안에 있는 mqttOffCall 호출됨.');

    // 데이터베이스 객체 참조
    // var database = req.app.get('database');
    // // 데이터베이스 객체가 초기화된 경우, 모델 객체의 findInCount 메소드 호출
    // if (database.db) {
    //   console.log("====== database db ======");
    //   // console.dir(database.db);
    //   // 1. 모든 정보 검색
    //   database.gateInOutModel.findOutCount(function(err, results) {
    //     // 에러 발생 시, 클라이언트로 에러 전송
    //     if (err) {
    //       console.error('출입기록 GateOut 조회 중 에러 발생 : ' + err.stack);
    //       res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    //       res.write('<h2>GateOutStat 조회 중 에러 발생</h2>');
    //       res.write('<p>' + err.stack + '</p>');
    //       res.end();
    //       return;
    //     }
    //     //Data 조회 성공시
    //     if (results) {
    //       console.log("========@@@ 출입기록 In count 결과 findOutCount results 출력 @@@====== ");
    //       console.dir(results);
    //       res.statusCode = 200;
    //       return res.send({data:results});
    //     } else {
    //       res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    //       res.write('<h2>사용자 출입기록  In count 조회  실패</h2>');
    //       res.end();
    //     }
    //   });
    // } else {
    //   res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    //   res.write('<h2>데이터베이스 연결 실패</h2>');
    //   res.end();
    // }
};

// module.exports.mqttOnCall = mqttOnCall;
// module.exports.mqttOffCall = mqttOffCall;
