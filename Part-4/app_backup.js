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
var mongoose = require('mongoose');
// crypto 모듈 불러들이기
var crypto = require('crypto');
//routes의 user 모듈 불러오기
var user = require('./routes/user');


//express 객체 설정
var app = express();

//기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000);

// body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended:false}));

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


//===== 데이터베이스 연결 =====//

//Database객체를 위한 변수 선언
var database;

//Database 스키마 객체를 위한 변수 선언
// var UserSchema;
//Database 모델 객체를 위한 변수 선언
// var UserModel;

function connectDB(){
  //연결 정보(문자열)
  var databaseUrl = 'mongodb://localhost:27017/local';
    // var databaseUrl = 'mongodb://ec2-13-125-227-81.ap-northeast-2.compute.amazonaws.com:27017/hitech';
  // var databaseUrl = 'mongodb://ec2-13-209-77-132.ap-northeast-2.compute.amazonaws.com:27017/hitech';
  //DB연결 (mongoose모듈로 연결 )
  console.log('데이터베이스 연결을 시도합니다.');
  mongoose.Promise = global.Promise;
  mongoose.connect(databaseUrl);
  database = mongoose.connection;

  //DB 연결 에러시 이벤트
  database.on('error', console.error.bind(console, 'mongoose connection error'));
  //DB 연결 성공시 이벤트
  database.on('open', function(){
    console.log('DB에 연결되었습니다. : '+ databaseUrl);

    // user 스키마 및 모델 객체 생성
    createUserSchema(database);

  });

  //연결 끊어졌을 때, 5초후 재연결
  database.on('disconnected', function(){
    console.log('연결이 끊어졌습니다. 5초후 다시 연결합니다.');
    setInterval(connectDB, 5000);
  });
  // 1. app 객체에 database 속성 추가
  app.set('database', database);
};

function createUserSchema(database){

  //user_schema.js 모듈 호출
  database.UserSchema = require('./database/user_schema').createSchema(mongoose);

  //UserModel 모델 정의
  database.UserModel = mongoose.model("users3", database.UserSchema);

};


//===== 라우팅 함수 등록 =====//

//라우터 객체 참조
var router = express.Router();


// 4. 로그인 처리 함수를 라우팅 모듈을 호출하는 것으로 수정
router.route('/process/login').post(user.login);
// 5. 사용자 추가 함수를 라우팅 모듈을 호출하는 것으로 수정
router.route('/process/adduser').post(user.adduser);
// 6. 사용자 리스트 함수를 라우팅 모듈을 호출하는 것으로 수정
router.route('/process/listuser').post(user.listuser);
// 라우터 객체 등록
app.use('/', router);

//========== 404 오류 페이지 처리 =========
// var errorHandler = expressErrorHandler({
//   static : {
//     '404' : './Part-4/public/404.html'
//   }
// });
//
// app.use(expressErrorHandler.httpError(404));
// app.use(errorHandler);

//===== 서버 시작 =====//

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});
app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
	if (database) {
		database.close();
	}
});


//Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
  console.log('express server started : '+app.get('port'));

  //Database 연결
  connectDB();
});
