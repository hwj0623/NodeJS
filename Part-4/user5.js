//module.exports와 exports 동시사용
//exports 는 무시된다.

module.exports = {
  getUser : function() {
      return {id:'test01', name:'호날두'};
  },
  group : { id : 'group01', name : '친구'}
};

exports.group = {id: 'group02', name :'가족'};
