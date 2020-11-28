const readAndWrite = require('../../../utils/readAndWrite');

module.exports = {
    name:'router',
    // 文件处理
    handler:async function(){
        let handlerArr = []

        let _future = [
            {
                source:'./lib/promptModules/router/template/router',
                target: '/src/router/index.js'
            },
            {
                source:'./lib/promptModules/router/template/routes',
                target: '/src/router/routes.js'
            },
            {
                source:'./lib/promptModules/router/template/vue',
                target: '/src/vue.config.js'
            },
            {
                target: '/src/global/css/public.less'
            }
        ]

        _future.forEach((item)=>{ 
            handlerArr.push(readAndWrite(item)) 
        })

        await Promise.all(handlerArr)   
    },
    //package.json的扩展
    pakTxt:{
        "dependencies":{
            "vue-router": "^3.1.3"
        }     
    },
    inquirer:{
        type:'confirm',
        name:'router',
        message:'是否使用vue-router？'
    }

}