//사용패턴 3) 프로토타입 객체를 할당하는 코드 패턴
//require()메소드 호출로 모듈로 불러들인 프로토타입 객체로 인스턴스를 생성해서 쓴다.
var User = require('./user10').User;
var user = new User('test01', '크리스티아노 호날두');

user.printUser();
