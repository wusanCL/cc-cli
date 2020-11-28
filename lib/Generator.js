const fs = require("fs-extra")
const exists = fs.existsSync
const writeFileTree = require("./utils/writeFileTree")
const GenerateAPI = require('./GeneratorAPI')

// 先分析一下整个过程，初始化插件   然后生成模板
class Generate {
    constructor(targetDir,{ name, files = {}, plugins, pkg }) {
        this.projectName = name
        this.targetDir = targetDir
        this.originalPkg = pkg
        this.pkg = Object.assign({}.pkg)
        this.plugins = plugins
        this.files = files
        this.imports = {}
        this.fileMiddlewares = []
    }
// 关于模板的存放，vuecli中使用了loadModule方法，获取存于用户项目目录下的模板，我这边不太一样，需要思考一下怎么做 
    generate() {
        await this.initPlugins()
        await this.resolveFiles()

        this.sortPkg()
        writeFileTree(targetDir, this.files)
    }
// 生成插件选项，不过vuecli中因为它所有的插件选项他都做成了npm包  所以处理不太一样，我目前是在cli中的包括模板等等，所以要改变一下
    async initPlugins() {
        // 去加载vuex等插件的函数并传入generateAPI执行   关于这个加载函数vuecli是在creator初始化的，那我这边要怎么处理？
        //  这边说一个这个结构，   首先一个是数据源的存在   然后一个是中间层的存在，对数据源进行处理   接着是控制台，也就是整体调用的一个存在   感觉有点像MVM?   或许我需要看一下系统设计了
        // 那么第一步先写一个  loadmoduel的函数处理         这个函数的初始化我效仿了vuecli  放在了creator那边  其实我觉得区别不是很大  这边写一个函数这边来规范化一下也不是不可以   不过语义化确实放在creator会更好一些~
        for(let plugin of this.plugins){
            const {id,options,apply} = plugin
            const api = new GenerateAPI(id,this)
            await plugin.apply(api)
        }
        
    }

    async resolveFiles(){
        // 主要功能  一个是模板编译 增加新文件，还有一个是   重构  对现有文件进行更改
        // 模板编译
        let files = this.files

        // 关于这一步，关于GeneratorAPI这个模块，其主要作用是准备好要执行的东西，然后这边来执行   也就是说，api模块的主要抽象功能应该是一个，中间件，一个总控室和数据源的中间件，作为一个桥梁，桥梁做的事情只是让总控室和数据源之间产生交集，一个注入的操作，主要的执行都是放在总控室的，所以才会有下面这一步，那又有一个疑问，下面这一步，执行的函数是桥梁那边加工后的函数，并不是数据源原原本本的数据，也就是说，桥梁不仅仅是桥梁，也可以算是一个小的加工厂，方便总控室的使用，但是最终的控制权，是否调用的权利，一直都是在总控室这边
        for(let middleware of this.fileMiddlewares){
            middleware()
        }


        // 关于代码重构
    }

    sortPkg(){

    }
}

module.exports = Generate
