/*
 * 온도/습도 정보 처리 모듈
 */

var num = 1;
var curMax = 0;
var curMin = 60;
var listInfoById = function(req, res) {
    console.log('temp_humid_info 모듈 안에 있는 실시간 온도 조회 함수 호출됨.');

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
          var response = new Array();
          for(var i=0; i<results.length; i++){
            var obj = {};
            obj.humidity = results[0]._doc.humid;
            obj.temperature = results[0]._doc.temp;
            obj.date =  results[0]._doc.time.getTime();
            obj.originalDate = results[0]._doc.time;
            //아웃라이어 제거
            if(results[0]._doc.humid >= 100 || results[0]._doc.temp >=50 || results[0]._doc.temp <-40){
              continue;
            }else{
              response.push(obj);
            }
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
            //아웃라이어 제거
            // if(results[0]._doc.humid >= 100 || results[0]._doc.temp >=50 || results[0]._doc.temp <-40){
            //   continue;
            // }else{
            response.push(obj);
            // }
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



var responseMax = null;
var responseMin = null;

function getMax(database){
  return new Promise(function (resolve, reject){
  database.tempHuModel.findMax(function(err, results) {
      // console.log("herrrrrrrr?");
      // 에러 발생 시, 클라이언트로 에러 전송
      if (err) {
        console.error('온도/습도 조회 중 에러 발생 : ' + err.stack);
        reject();
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>사용자 리스트 조회 중 에러 발생</h2>');
        res.write('<p>' + err.stack + '</p>');
        res.end();
        return;
      }
      //Data 조회 성공시
      if (results) {
        // console.log("#######=MAX=##### results : ", results[0]);
        var response = new Array();
        //녹화용 코드
        var obj = {};
        for(var i=0; i<results.length; i++){

          if(obj.maxTemperature == undefined){
            obj.maxHumidity = results[i]._doc.humid;
            obj.maxTemperature = results[i]._doc.temp;
            obj.date = results[i]._doc.time.getTime();
            obj.originalDate = results[i]._doc.time;
          }else{
            if(obj.maxTemperature <= results[i]._doc.temp){
              obj.maxHumidity = results[i]._doc.humid;
              obj.maxTemperature = results[i]._doc.temp;
              obj.date = results[i]._doc.time.getTime();
              obj.originalDate = results[i]._doc.time;
            }
          }
        }
        response.push(obj);
        // console.log("response MAAX $$$$$$$$$===$$$$$$ ");

        //원래 코드
        // var obj = {};
        // obj.maxHumidity = results[0]._doc.humid;
        // obj.maxTemperature = results[0]._doc.temp;
        // obj.date = results[0]._doc.time.getTime();
        // obj.originalDate = results[0]._doc.time;
        // response.push(obj);
        console.log("responseMax : ", response);
        responseMax = response;
        resolve();
      } else {
        // console.log("####### results == null ###### : ");
        reject();
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>사용자 리스트 조회  실패</h2>');
        res.end();
      }

    });
  });
}
function getMin(database){
  return new Promise(function (resolve, reject){
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

        console.log("#######=MIN=##### results : ");
        // console.dir(results);
        //녹화용 코드
        var obj = {};
        for(var i=0; i<results.length; i++){
          if(obj.minTemperature == undefined){
            obj.minHumidity = results[i]._doc.humid;
            obj.minTemperature = results[i]._doc.temp;
            obj.date = results[i]._doc.time.getTime();
            obj.originalDate = results[i]._doc.time;
          }else{
            if(obj.minTemperature <= results[i]._doc.temp){
              obj.minHumidity = results[i]._doc.humid;
              obj.minTemperature = results[i]._doc.temp;
              obj.date = results[i]._doc.time.getTime();
              obj.originalDate = results[i]._doc.time;
            }
          }
        }
        // response.push(obj);
        // console.log("response MIN $$$$$$$$$===$$$$$$ ");
        // var obj = {};
        // for(var i=0; i<results.length; i++){
        //   obj = {};
        //   obj.minHumidity = results[0]._doc.humid;
        //   obj.minTemperature = results[0]._doc.temp;
        //   obj.date = results[0]._doc.time.getTime();
        //   obj.originalDate = results[0]._doc.time;
        //
        //   if(response.length == 0){
        //     response.push(obj);
        //   }
        //   if(response.length>0){
        //     if(results[i]._doc.temp < response[0]._doc.temp){
        //       response.pop();
        //       response.push(obj);
        //     }
        //   }
        // }

        //0905 수정코드
        if(results[0] !== undefined){
          if(results[0]._doc!==undefined || results[0]._doc.humid !==undefined  ){
              if(obj.minHumidity > results[0]._doc.humid){
                obj.minHumidity =  results[0]._doc.humid;
              }
              if(obj.minTemperature > results[0]._doc.temp){
                obj.minTemperature = results[0]._doc.temp
              }
              if(obj.date > results[0]._doc.time.getTime()){
                obj.date = results[0]._doc.time.getTime();
                obj.originalDate = results[0]._doc.time;
              }
          }
        }
        //end of 수정코드

        //원래 코드
        // var obj = {};
        // obj.minHumidity = results[0]._doc.humid;
        // obj.minTemperature = results[0]._doc.temp;
        // obj.date = results[0]._doc.time.getTime();
        // obj.originalDate = results[0]._doc.time;
        response.push(obj);
        console.log("responseMin : ", response);
        responseMin = response;
        resolve();
      } else {
        console.log("####### results == null ###### : ");
        reject();
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>사용자 리스트 조회  실패</h2>');
        res.end();
      }
    });
  });
}
var listInfoStat = function(req, res) {
    console.log('@@@ temp_humid_info 모듈 안에 있는 listInfoStat 호출됨.');

      // 데이터베이스 객체 참조
      var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우, 모델 객체의 findAll 메소드 호출
    if (database.db) {
      // 1. 최대습도/온도 정보 검색
      // console.log("=========");
      // console.log(getMax(database).then(getMin(database)));
      console.log(getMax(database).then(getMin(database)));
      getMax(database).then(getMin(database)).then(function(){
        if(responseMax != null && responseMax != undefined &&
                      responseMin != null && responseMin != undefined){
            // res.statusCode = 200;
            console.log("=====@@@@ here @@@@====");
            console.log("max : ", responseMax);
            console.log("min : ", responseMin);
            return res.send([{"max":responseMax}, {"min":responseMin}]);
        }
      });
    } else {
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>데이터베이스 연결 실패</h2>');
      res.end();
    }
};


module.exports.listInfoAll = listInfoAll;
module.exports.listInfoById = listInfoById;
module.exports.listInfoStat = listInfoStat;
