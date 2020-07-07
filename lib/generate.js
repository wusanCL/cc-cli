const fs = require('fs-extra');
const exists = fs.existsSync;


class Generate {
    constructor(targetPath, sourcePath, promptModules, templateAST,projectName) {
        this.targetPath = targetPath
        this.sourcePath = sourcePath
        this.promptModules = promptModules
        this.templateAST = templateAST
        this.pkg = fs.readFileSync(sourcePath + '/package.json', 'utf-8')
        this.projectName = projectName
    }

    async exec() {
        let handlerArr = [];
        //执行对应模块的处理函数
        this.promptModules.forEach((item) => {
            handlerArr.push(item.handler());
            this.generatePkg(item.pakTxt, this.pkg);
        })

        this.generatePkg({
            name:this.projectName
        }, this.pkg);

        handlerArr.push(this.writePkg())
        await Promise.all(handlerArr);
    }

    writePkg(){
        return new Promise(resolve=>{
            fs.writeFileSync(this.targetPath + '/package.json',this.pkg)
            resolve()
        })
    }
    //生成所需package文件
    //待优化
    generatePkg(data, target) {
        let obj = {
            'string': function (key, value) {
                let reg = new RegExp('"' + key + '"\\\s\*:\\\s\*"\(\[\\S\\s\]\*\?\)"', 'i')
                if (target.match(reg)) {
                    this.pkg = target = target.replace(RegExp.$1, value)
                }
            },
            'object': function (key, value) {
                let reg = new RegExp('"' + key + '"\\\s\*:\\\s\*{\(\[\\S\\s\]\*\?\)}', 'i')
                if (target.match(reg)) {
                    let str = RegExp.$1
                    let initStr = str
                    str = str.replace(/\s*$/,'')
                    for (let name in value) { 
                        if(!new RegExp(name).test(initStr)){
                            str += `,\n    "${name}":"${value[name]}"`;
                        }                         
                    }
                    str += '\n'
                    this.pkg = target = target.replace(initStr, str)
                }
            },
        }
        for (let key in data) {
            let value = data[key];
            obj[typeof value].call(this, key, value);
        }
    }
}

module.exports = Generate