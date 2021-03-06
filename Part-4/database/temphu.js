var tempHuSchema = { };
var mongoosePaginate = require('mongoose-paginate');
var numCall = 0;
var num2Call = 0;
var num3Call = 0;

var num = 0;
var num2 = 0;
var num3 = 0;
tempHuSchema.createSchema = function (mongoose){
  //스키마 정의
  var TH_Schema = mongoose.Schema({
    humid: {type: Number, 'default':' '},
    temp : {type: Number, 'default':' '},                //index 생성
    time : {type: Date},
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

    // 스키마의 tempHuModel에 static 메소드 추가
  	TH_Schema.static('findByPage', function( callback) {
      console.log("@@@@@@@@@@ num : "+num);
      // console.log(this.count());
      if(num >= 94){
        num = 0;
      }

      var obj = this.find({}, callback).limit(1).skip(num++).sort({data:1});
      // console.log(obj);
      return obj;
  	});

  	TH_Schema.static('findAll', function( callback) {
      console.log("=== find all 호출 ===")
      // console.dir(this.find({}));
      if(num >= 80){
        num = 0;
      }
      if(numCall>=200){
        numCall=0;
      }
      if(numCall%2==0){
          num++;
      }
      numCall++;

  		return this.find({}, callback).limit(20).skip(num).sort({data:1});
  	});

    TH_Schema.static('findMax', function( callback) {
      // console.log("=== findMax 호출 ===");
      // console.log(this.find({}).limit(1).sort({temp : -1}));
      //수정코드
      if(num2 >= 80 ){
        num2 = 0;
      }
      if(num2Call >= 200){
        num2Call = 0;
      }
      if(num2Call%2==0){
          num2++;
      }
      num2Call++;
      return this.find({}, callback).limit(20).skip(num2);//.sort({temp:-1}).limit(1);
      //return this.find({}, callback).limit(1).sort({temp: -1});
    });

    TH_Schema.static('findMin', function( callback) {
      // console.log("=== findMin 호출 ===")
      //수정코드
      if(num3 >= 80 ){
        num3 = 0;
      }
      if(num3Call >= 200){
        num3Call = 0;
      }
      if(num3Call%2==0){
        num3++;
      }
      num3Call++;
      return this.find({} ,callback).limit(20).skip(num3).sort({"temp":1});//.sort({temp:1}).limit(1);
      //  return this.find({}, callback).limit(1).sort({temp : 1});//.aggregate([{$sort : {temp : 1}}, {$limit:1}]);
    });
    console.log('TH_Schema 정의함 ');

    return TH_Schema;
};

//module.exports에 UserSchema 객체 직접 할당
module.exports = tempHuSchema;
