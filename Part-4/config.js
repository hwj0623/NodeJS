module.exports = {

  server_port : 3000,
  // db_url : 'mongodb://localhost:27017/local',
  db_schemas:[
    {
      file:'./user_schema',
      collection:'local_user',
      schemaName : 'UserSchema',
      modelName : 'UserModel'
    },
    {
        file:'./temphu',
        collection:'temphus',
        schemaName : 'tempHuSchema',
        modelName : 'tempHuModel'
    },
    {
        file:'./human_cnt_schema',
        collection:'human_cnts',
        schemaName : 'gateInOutSchema',
        modelName : 'gateInOutModel'
    }
  ],
  route_info : [
      {
        file : './user', path:'/process/login', method :'login', type:'post'
      },
      {
        file : './user', path:'/process/login', method :'login', type:'get'
      },
      {
        file : './user', path:'/process/adduser', method :'adduser', type:'post'
      },
      {
        file : './user', path:'/process/listuser', method :'listuser', type:'post'
      },
      {
        file : './user', path:'/process/listuser', method :'listuser', type:'get'
      },
      {
        file : './temp_humid_info', path:'/process/info1', method : 'listInfoById', type:'get'
      },
      {
        file : './temp_humid_info', path:'/process/info', method : 'listInfoAll', type:'get'
      },
      {
        file : './temp_humid_info', path:'/process/info/stat', method : 'listInfoStat', type:'get'
      },
      {
        file : './gate_info', path:'/process/gate', method : 'GateInfoAll', type:'get'
      }

  ]
}
