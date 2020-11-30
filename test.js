// 学习草稿
const fs = require("fs-extra")
const download = require("download-git-repo")
const path = require("path")
const os = require("os")

const a = require("module")
const tmpdir = path.resolve(os.tmpdir(), "cc-cli-presets")






class Test {
    constructor() {}

    err() {
        let obj = {}
        Error.captureStackTrace(obj)
        const callSite = obj.stack.split('\n')[3]
        const reg = /\s\((.*):\d+:\d+\)$/
        const str = ' at Object.<anonymous> (C:\Users\asus\Desktop\myCause\代码仓库\vue\mycli\test.js:32:1)'
        console.log(callSite.match(reg)[1])
        console.log(str.match(reg)[1])      //这个和上面那个竟然不一样？
        return obj
    }
}

const aaa = new Test()

function testt(){
    aaa.err()
}
testt()


// function MyError() {
//     let obj = {}
//     Error.captureStackTrace(obj,MyError);

//     return obj
//     // 如果传入函数，那么你访问stack的堆栈信息中不会包含这个函数的信息  不然正常你如果是在函数中调用的capture函数，那么也会包含你调用这个方法的函数的信息，但是你传入了这个函数  就不会显示了   你可以理解为   一个自定义堆栈信息的方法
//   }

// console.log(MyError().stack)

// console.log(module)      //注入的module，其中的children包含了你这边require的东西，还有一些id，filename等等，里面的paths数组就是你require的层级关系       我们更改这个数组的时候，是会影响require函数的，也就是说我们可以更改加载依赖的层级关系，优化加载依赖的时间

// console.log(a.builtinModules)   返回node所有内置模块的名称，可以用来判断包是否为第三方维护

// console.log(a._nodeModulePaths('..'))    这个函数返回你所传入的相对路径到根目录路径下的所有的node_modules的绝对路径数组

// console.log(process.execPath)    node.exe的绝对路径

// console.log(process.env)

// function extractCallDir () {
//     // extract api.render() callsite file location using error stack
//     const obj = {}
//     Error.captureStackTrace(obj)
//     const callSite = obj.stack.split('\n')[3]

//     // the regexp for the stack when called inside a named function
//     const namedStackRegExp = /\s\((.*):\d+:\d+\)$/
//     // the regexp for the stack when called inside an anonymous
//     const anonymousStackRegExp = /at (.*):\d+:\d+$/

//     let matchResult = callSite.match(namedStackRegExp)
//     if (!matchResult) {
//       matchResult = callSite.match(anonymousStackRegExp)
//     }

//     const fileName = matchResult[1]
//     console.log(callSite)
//     console.log(fileName)
//     return path.dirname(fileName)
//   }

//   console.log(extractCallDir())
// console.log(process.argv)
// console.log(process.cwd())  //命令行所在位置
// console.log(__dirname)  //实际执行目录位置
// console.log(fs.readdirSync(tmpdir))
// download(
//   "github:wusanCL/vue-template",
//   tmpdir,
//   (err) => {
//     if (err) console.log(err);
//   }
// );
