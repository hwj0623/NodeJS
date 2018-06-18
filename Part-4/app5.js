var express = require('express')
, http = require('http')
, path = require('path')
, crypto = require('crypto');

//Express middleware loading
var bodyParser = require('body-parser')
, static = require('serve-static')
, cookieParser = require('cookie-parser')
, errorHandler = require('errorhandler');

//오류 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

//Session 미들웨어 불러오기
var expressSession = require('express-session');

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

/**
 * 몽고 디비 모듈 사용
 */
var MongoClient = require('mongodb').MongoClient;
//mongoose 모듈 불러들이기 (Schema 생성위함. model 정의 위함)
var mongoose = require('mongoose');
//Database객체를 위한 변수 선언
var database;
//Database 스키마 객체를 위한 변수 선언
var UserSchema;
//Database 모델 객체를 위한 변수 선언
var UserModel;

//Database에 연결
function connectDB(){
  //연결 정보(문자열)
  var databaseUrl = 'mongodb://localhost:27017/local';

  //DB연결 (MongoClient 대신 mongoose모듈로 연결 )
  mongoose.Promise = global.Promise;
  mongoose.connect(databaseUrl);
  database = mongoose.connection;

  //DB 연결 에러시 이벤트
  database.on('error', console.error.bind(console, 'mongoose connection error'));
  //DB 연결 성공시 이벤트
  database.on('open', function(){
    console.log('DB에 연결되었습니다. : '+ databaseUrl);

    createUserSchema();

    //스키마에 static 메소드 추가
    UserSchema.static ('findById', function(id, callback){
      return this.find({id:id}, callback);

    });
    UserSchema.static('findAll', function(callback){
      return this.find({}, callback);
    });
    UserSchema.method('showMe', function(callback){
      console.log('showMe function called ');
      return;
    });

    console.log('UserSchema 정의함 ');
    //UserModel 모델 정의
    UserModel = mongoose.model("users2", UserSchema);
    console.log('UserModel을 정의함');
  });

  //연결 끊어졌을 때, 5초후 재연결
  database.on('disconnected', function(){
    console.log('연결이 끊어졌습니다. 5초후 다시 연결합니다.');
    setInterval(connectDB, 5000);
  });
};

function createUserSchema(){

  //user_schema.js 모듈 호출
  UserSchema = require('./database/user_schema').createSchema(mongoose);

  //UserModel 모델 정의
  UserModel = mongoose.model("users3", UserSchema);
  // console.log('UserModel 정의함.');
  // //스키마 정의
  // UserSchema = mongoose.Schema({
  //   id: {type:String, required:true, unique:true, 'default':' '},
  //   name :{type: String, index:'hashed', 'default':' '},                //index 생성
  //   hashed_password : {type:String, required:true, 'default':' '},
  //   salt : {type:String, required : true},
  //   age : {type:Number, 'default':-1},
  //   created_at : {type:Date, index:{unique:false}, 'default':Date.now},  //index 생성
  //   updated_at : {type:Date, index:{unique:false}, 'default':Date.now}   //index 생성
  // });
  //
  // //가상 속성의 이름으로 password를 전달.
  // UserSchema
  //   .virtual('password')
  //   .set(function(password){
  //     this._password = password;
  //     this.salt = this.makeSalt();
  //     this.hashed_password = this.encryptPassword(password);
  //     console.log('virtual password 호출됨 : '+this.hashed_password);
  //   })
  //   .get(function(){return this._password});
  //
  //   UserSchema.method('encryptPassword', function(plainText, inSalt){
  //     if(inSalt){
  //       return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
  //     }else{
  //       return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
  //     }
  //   });
  //
  //   //salt값 만들기 메소드
  //   UserSchema.method('makeSalt', function(){
  //     return Math.round((new Date().valueOf()*Math.random()))+'';
  //
  //   });
  //
  //   //인증 메소드 - 입력된 비밀번호와 비교 (true/false 리턴)
  //   UserSchema.method('authenticate', function(plainText, inSalt, hashed_password){
  //     if(inSalt){
  //       console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText, inSalt), hashed_password);
  //       return this.encryptPassword(plainText, inSalt) === hashed_password;
  //     }else{
  //       console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText), this.hashed_password);
  //       return this.encryptPassword(plainText) === this.hashed_password;
  //     }
  //   });
  //   UserSchema.path('id').validate(function(id){
  //     return id.length;
  //   }, 'id 컬럼의 값이 없습니다');
  //
  //   UserSchema.path('name').validate(function(name){
  //     return name.length;
  //   }, 'name 컬럼의 값이 없습니다');
};

/*
* 사용자 조회 함수 - authUser : 아이디로 먼저 찾고, 비밀번호를 그 다음에 비교
*/
var authUser = function(database, id, password, callback){
  console.log('authUser 호출됨 ');

  //1. 아이디를 사용해서 검색
  UserModel.findById(id, function(err, results){
    if(err){
      callback(err, null);
      return;
    }
    console.log('아이디[%s]로 사용자 검색 결과.', id);
    // console.dir(results._doc);
    if(results.length>0){
      console.log('아이디와 일치하는 사용자 찾음.');
      //2. 비밀번호 확인 : 모델 인스턴스 객체를 만들고 authenticate() 메소드 호출
      var user = new UserModel({id:id});
      var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
      if(authenticated){
        console.log('비밀번호 일치함');
        callback(null, results);
      }else{
        console.log('비밀번호 불일치');
        callback(null, null);
      }

      // if(results[0]._doc.password===password){
      //   console.log('비밀번호 일치함');
      //   callback(null, results);
      // }else{
      //   console.log('비밀번호 불일치');
      //   callback(null, null);
      // }
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
  var user = new UserModel({"id":id, "password":password, "name":name});
  user.save(function(err){
    if(err){
      callback(err, null);
      return;
    }
    console.log('사용자 데이터 추가함.');
    callback(null, user);
  });


}

//라우터 객체 할당
var router = express.Router();

//사용자 리스트 함수
router.route('/process/listuser').post(function(req, res){
  console.log('/process/listuser 호출됨 ');
  //DB객체가 초기화된 경우, 모델 객체의 findAll 메소드 호출
  if(database){
    //1.모든 사용자 검색
    UserModel.findAll(function(err, results){
      //오류가 발생했을 때 클라이언트로 오류 전송
      if(err){
        console.error('사용자 리스트 조회 중 오류 발생 : '+err.stack);
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>사용자 리스트 조회 중 오류 발생  </h2>');
        res.write('<div><p> '+err.stack+'</p></div>');
        res.end();
        return;
      }
      if(results){
        console.dir(results);
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>사용자 리스트 조회  </h2>');
        res.write('<div><ul>');

        for(var i=0; i<results.length; i++){
          var curId = results[i]._doc.id;
          var curName = results[i]._doc.name;
          res.write(' <li>#'+i+' : '+curId+', '+curName+' </li>');
        }
        res.write('</ul></div>');
        res.end();
      }else{
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>사용자 리스트 조회 실패 </h2>');
        res.end();
      }
    });
  }else{  //데이터베이스 객체가 초기화 되지 않을 떄 실패 응답 전송

    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h2>데이터베이스 연결 실패 실패 </h2>');
    res.end();
  }
});
//로그인 프로세스
router.route('/process/login').post(function(req, res){
  console.log('/process/login 호출됨 ');
  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;

  if(database){
    authUser(database, paramId, paramPassword, function(err, docs){
      if(err){throw err;}
      if(req.session.user){
        console.log('이미 로그인 되어 메인 페이지로 이동합니다.');
        res.redirect('/index.html');
      }
      if(docs){
        console.dir(docs);
        var username = docs[0].name;

        res.redirect('/index.html');
      }
    });
  }else{
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h2>데이터베이스 연결 실패 </h2>');
    res.write('<div><p>데이터베이스에 연결하지 못했습니다. '+username+'</p></div>');
    res.end();
  }
});
//회원 추가
router.route('/process/adduser').post(function(req, res){
  console.log('/process/adduser 호출됨 ');
  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;
  var paramName = req.body.name || req.query.name;

  console.log('요청 파라미터 : '+paramId+", "+paramPassword+", "+paramName);

  //데이터베이스 객체가 초기화된 경우, addUser 함수를 호출하여 사용자 추가
  if(database){
    addUser(database, paramId, paramPassword, paramName, function(err, result){
      if(err){throw err;}

      if(result&&result._doc!=undefined){ //성공시
        console.dir(result._doc);

        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>사용자 추가 성공 </h2>');
        res.end();
      }else{ //result 객체가 없으면 실패 응답 전송
        console.dir(result._doc);
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>사용자 추가 실패</h2>');
        res.end();
      }
    });
  }else{ //데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h2>데이터베이스 연결 실패 </h2>');
    res.write('<div><p>데이터베이스에 연결하지 못했습니다. </p></div>');
    res.end();
  }
});



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


//middleware에서 파라미터 확인
app.use(function (req, res, next){
  console.log('first middleware requst handle');

  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;

});

//Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
  console.log('express server started : '+app.get('port'));

  //Database 연결
  connectDB();
});
