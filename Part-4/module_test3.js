//module.exports는 객체를 그대로 반환한다 

var user = require('./user3');

function showUser(){
  return user.getUser().name+', '+user.group.name;
}

console.log('사용자 정보 : %s ', showUser());
