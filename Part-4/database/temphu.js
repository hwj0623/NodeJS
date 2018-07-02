var tempHuSchema = { };
var mongoosePaginate = require('mongoose-paginate');

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
  	TH_Schema.static('findById', function( callback) {
      var curCnt = this.find({}, callback).count();
      console.log("///// cur Cnt : "+curCnt);
      // if(curCnt < num){
      //   num=0;
      // }
      var id = "5b3360a074fece06174b9938";
      console.dir(this.find({id:id}));
      return this.find({id:id}, callback);
  		// return this.paginate({},{ skip: num*1, limit: 10 }, callback);
  	});

  	TH_Schema.static('findAll', function(callback) {
      console.log("=== find all 호출 ===")
      console.dir(this.find({}));
  		return this.find({}, callback);
  	});

    console.log('TH_Schema 정의함 ');

    return TH_Schema;
};

//module.exports에 UserSchema 객체 직접 할당
module.exports = tempHuSchema;
