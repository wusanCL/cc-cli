const readAndWrite = require('../../utils/readAndWrite');
const fs = require('fs');
const exists = fs.existsSync;

module.exports = {
    name:'axios',
    // 文件处理
     handler:async function(){
        let handlerArr = []

        let _future = [
            {
                source:'./lib/promptModules/axios/template/api',
                target: '/src/global/service/api.json'
            },
            {
                source:'./lib/promptModules/axios/template/index',
                target: '/src/global/service/index.js'
            },
            {
                source:'./lib/promptModules/axios/template/service',
                target: '/src/global/service/service.js'
            }
        ]

        // let path = process.env.TARGET_PATH + '/src/global/service'
        
        // if(!exists(path)){
        //     fs.mkdirSync(path)
        // }
              
        _future.forEach((item)=>{ 
            handlerArr.push(readAndWrite(item)) 
        })

        await Promise.all(handlerArr)   
    },
    pakTxt:{
        "dependencies": {
            "axios": "^0.19.0"
        }
    },
    inquirer:{
        type:'confirm',
        name:'axios',
        message:'是否使用axios？'
    }

}