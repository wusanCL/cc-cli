const readAndWrite = require('../../../utils/readAndWrite');

module.exports = {
    name:'less',
    // 文件处理
    handler:async function(){
        let handlerArr = []

        let _future = [
            {
                source:'./lib/promptModules/less/template/vue',
                target: '/vue.config.js'
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
    pakTxt:{
        "devDependencies": {
            "less": "^3.0.4",
            "less-loader": "^5.0.0",
            "style-resources-loader": "^1.3.3",
            "vue-cli-plugin-style-resources-loader": "^0.1.3"
          }
    },
    inquirer:{
        type:'confirm',
        name:'less',
        message:'是否使用less？'
    }

}