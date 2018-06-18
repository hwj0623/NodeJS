//사용패턴 3) 프로토타입 객체를 할당하는 코드 패턴

//생성자 함수
function User(id, name){
  this.id = id;
  this.name = name;
}

//User객체의 속성으로 함수나 값을 추가
//==> User.prototype 객체에 속성으로 추가
User.prototype.getUser = function(){
  return {id:this.id, name: this.name};
}

User.prototype.group = {id:'group1', name:'친구'};

User.prototype.printUser = function(){
  console.log('user 이름 : %s, group 이름 : %s ', this.name, this.group.name);
}

//모듈 나머지 부분은 user9와 동일.
exports.User = User;
