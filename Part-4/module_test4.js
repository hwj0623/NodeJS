//
var user = require('./user4');

function showUser(){
  return user().name+' , '+'No Group';  // module.exports에 할당한 익명함수를 호출
};

console.log('사용자 정보 : %s ', showUser());
