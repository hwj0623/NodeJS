var tempHuSchema = { };
var mongoosePaginate = require('mongoose-paginate');

var num = 0;

tempHuSchema.createSchema = function (mongoose){
  //스키마 정의
  var TH_Schema = mongoose.Schema({
    humid: {type: Number, 'default':' '},
    temp : {type: Number, 'default':' '},                //index 생성
    time : {type: Date, },
  });

  TH_Schema.plugin(mongoosePaginate);
    // 메소드 만들기
    // TH_Schema.method('makeSalt', function(){
    //   return Math.round((new Date().valueOf()*Math.random()))+'';
    //
    // });

    // 필수 속성에 대한 유효성 확인 (길이값 체크)
    TH_Schema.path('humid').validate(function(humid){
      return humid.length;
    }, 'humid 컬럼의 값이 없습니다');

    TH_Schema.path('temp').validate(function(temp){
      return temp.length;
    }, 'temp 컬럼의 값이 없습니다');

    TH_Schema.path('time').validate(function (time) {
  		return time.length;
  	}, 'time 칼럼의 값이 없습니다.');

    // 스키마에 static 메소드 추가
  	TH_Schema.static('findByPage', function( callback) {
      console.log("@@@@@@@@@@ num : "+num);
      return this.find({}, callback).limit(1).skip(num++).sort({data:1});
  	});

  	TH_Schema.static('findAll', function( callback) {
      console.log("=== find all 호출 ===")
      // console.dir(this.find({}));
  		return this.find({}, callback);
  	});

    TH_Schema.static('findMax', function(temp, callback) {
      console.log("=== findMax 호출 ===");
      // console.dir(this.find().sort({temp:-1}).limit(1));
      return this.find({}, callback).limit(1).sort("-temp");
    });

    TH_Schema.static('findMin', function(temp, callback) {
      console.log("=== findMin 호출 ===")
      return this.find({}, callback).limit(1).sort("temp");
    });
    console.log('TH_Schema 정의함 ');

    return TH_Schema;
};

//module.exports에 UserSchema 객체 직접 할당
module.exports = tempHuSchema;
