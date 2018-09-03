// Express 기본 모듈 불러오기
var express = require('express')
, http = require('http')
, path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
, static = require('serve-static')
, cookieParser = require('cookie-parser')
, errorHandler = require('errorhandler');

//오류 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

//Session 미들웨어 불러오기
var expressSession = require('express-session');

/*
 * 몽고 디비 모듈 사용
 */
//mongoose 모듈 불러들이기 (Schema 생성, model 정의 위함)
// var mongoose = require('mongoose');
// crypto 모듈 불러들이기
// var crypto = reuqire('crypto');

//routes의 user 모듈 불러오기
var user = require('./routes/user');
//config 모듈 불러오기
var config = require('./config');

// 모듈로 분리한 데이터베이스 파일 불러오기
var database = require('./database/database');

// 모듈로 분리한 라우팅 파일 불러오기
var route_loader = require('./routes/route_loader');

//AWS Iot Device ( 2018/09/04)
var awsIot = require('./routes/iot_mqtt');


var device = awsIot.device({

});

device
  .on('connect', function() {
    console.log('connect');
    //device.subscribe('redirect'); //aws에서 subscribe할 topic

    device.publish('sungsik2', JSON.stringify({ test_data: '2'})); //aws로 publish할 topic
});

//express 객체 설정
var app = express();

//===== 서버 변수 설정 및 static으로 [public] 폴더설정 =====//
console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || 3000);

// body-parser를 사용해 a®pplication/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded( { extended:false } ));

//body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());

//public 폴더를 static으로 오픈
app.use(static(path.join(__dirname, 'public')));
app.use(static(path.join(__dirname, 'pages')));
app.use(static(path.join(__dirname, '../Part-4')));

//cookie-parser 설정
app.use(cookieParser());

app.use(expressSession({
  secret : 'my key',
  resave : true,
  saveUninitialized : true
}));

//======= 라우팅 모듈 로딩 ========//
// 라우팅 정보를 읽어들여 라우팅 설정
route_loader.init(app, express.Router());



//test
//========== 404 오류 페이지 처리 =========
var errorHandler = expressErrorHandler({
  static : {
    '404' : './Part-4/public/404.html'
  }
});
//
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

//===== 서버 시작 =====//

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});
app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
	if (database.db) {
		database.db.close();
	}
});


//Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
  console.log('express server started : '+app.get('port'));

  //Database 연결
  database.init(app, config);
});
