//사용패턴 2-2) module.exports에 인스턴스 객체를 할당하는 코드 패턴

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

//정의된 User 객체에서 새로운 인스턴스 객체를 만들어서 직접 할당
//==> 모듈을 불러오는 쪽에서 인스턴스 객체를 바로 참조
// module.exports = new User('test01', '소녀시대');
exports.user = new User('test02', '소년시대');
