//Reason : exports는 속성으로, exports 에 속성을 추가하면 모듈에서 접근하지만,
//         exports에 객체를 지정하면 js에서 새로운 변수로 만들어서 처리한다.
//exports의 속성에 값을 추가하는게 아닌, exports에 객체를 할당 => require시 이 exports 변수를 참조하지 못함
//exports 전역변수를 참조하는데, exports 전역변수에는 해당 객체 내용이 없다. 
exports = {
    getUser : function(){
      return {id: 'test01', name:'테스트01'};

    },
    group : {id:'group01', name:'친구'}
}
