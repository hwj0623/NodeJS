//Reason : exports는 속성으로, exports 에 속성을 추가하면 모듈에서 접근하지만,
//         exports에 객체를 지정하면 js에서 새로운 변수로 만들어서 처리한다.
//결국 아무 속성도 없는 { }객체가 반환된다.

var user = require('./user2');

console.dir(user);
function showUser(){
  return user.getUser().name+', '+user.group.name;
}

console.log('사용자 정보 : %s ', showUser());
