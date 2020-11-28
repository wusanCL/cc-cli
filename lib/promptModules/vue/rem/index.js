const readAndWrite = require('../../../utils/readAndWrite');
const { Info } = require('../../../run');


module.exports = {
    name:'rem',
    // 文件处理
    handler:async function(){
        let handlerArr = []

        let _future = [
            {
                source:'./lib/promptModules/rem/template/config',
                target: '/postcss.config.js'
            },
            {
                source:'./lib/promptModules/rem/template/index',
                target: '/public/index.html',
                beforeWrite(content){
                    return content.replace('demo',Info.projectName)
                }
            }
        ]
        
        _future.forEach((item)=>{ 
            handlerArr.push(readAndWrite(item)) 
        })
        
        await Promise.all(handlerArr)
    },
    pakTxt:{
        "devDependencies": {
            "postcss-pxtorem": "^4.0.1"
          }
    },
    inquirer:{
        type:'confirm',
        name:'rem',
        message:'是否使用rem适配方案？'
    }
}