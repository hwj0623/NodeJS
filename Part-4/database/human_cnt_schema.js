var gateInOutSchema = { };

var num = 0;

gateInOutSchema.createSchema = function (mongoose){
  //스키마 정의
  var Gate_Schema = mongoose.Schema({
    remark: {type: String, 'default':' '},
    cnt : {type: String, 'default':' '},                //index 생성
    cnt2 : {type: String, 'default':' '},                //index 생성
    time : {type: Date},
  });

  // Gate_Schema.plugin(mongoosePaginate);
    // 메소드 만들기
    // TH_Schema.method('makeSalt', function(){
    //   return Math.round((new Date().valueOf()*Math.random()))+'';
    //
    // });

    // 필수 속성에 대한 유효성 확인 (길이값 체크)
    Gate_Schema.path('remark').validate(function(remark){
      return remark.length;
    }, 'remark 컬럼의 값이 없습니다');

    Gate_Schema.path('cnt').validate(function(cnt){
      return cnt.length;
    }, 'cnt(IN : +1, Out : -1) 컬럼의 값이 없습니다');

    Gate_Schema.path('cnt2').validate(function (cnt2) {
  		return cnt2.length;
  	}, 'cnt2(절대값) 칼럼의 값이 없습니다.');

    Gate_Schema.path('time').validate(function (time) {
      return time.length;
    }, 'time(시간) 칼럼의 값이 없습니다.');

    // 스키마의 모델 gateInOutModel에 static 메소드 추가
  	Gate_Schema.static('findAll', function( callback) {
      console.log("=== find all 호출 ===");
      console.log("this : ", this);
  		return this.find({}, callback);
  	});

    // Gate_Schema.static('findMax', function( callback) {
    //   console.log("=== findMax 호출 ===");
    //   // console.log(this.find({}).limit(1).sort({temp : -1}));
    //   return this.find({}, callback).limit(1).sort({temp: -1});
    // });
    //
    // Gate_Schema.static('findMin', function( callback) {
    //   console.log("=== findMin 호출 ===")
    //   return this.find({}, callback).limit(1).sort({temp : 1});//.aggregate([{$sort : {temp : 1}}, {$limit:1}]);
    // });
    console.log('Gate_Schema 정의함 ');

    return Gate_Schema;
};

//module.exports에 UserSchema 객체 직접 할당
module.exports = gateInOutSchema;
