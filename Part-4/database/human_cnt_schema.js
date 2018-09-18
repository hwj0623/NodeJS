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
    // 스키마의 모델 gateInOutModel에 static 메소드 추가 -- IN count
    Gate_Schema.static('findInCount', function( callback) {
      console.log("=== findInCount 호출 ===");
      console.log("this : ", this);
      return this.count({remark : "IN"}, callback);
    });
    // 스키마의 모델 gateInOutModel에 static 메소드 추가 -- OUT count
    Gate_Schema.static('findOutCount', function( callback) {
      console.log("=== findOutCount 호출 ===");
      console.log("this : ", this);
      return this.count({remark : "OUT"}, callback);
    });

    console.log('Gate_Schema 정의함 ');

    return Gate_Schema;
};

//module.exports에 UserSchema 객체 직접 할당
module.exports = gateInOutSchema;
