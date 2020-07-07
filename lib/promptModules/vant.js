

module.exports = {
    name:'vant',
    // 文件处理
    handler:async function(){
        await new Promise((resolve,reject)=>{
            resolve()
        })
    },
    pakTxt:{
        "dependencies": {
            "vant": "^2.1.5"
          }
    },
    inquirer:{
        type:'confirm',
        name:'vant',
        message:'是否使用vant？'
    }

}