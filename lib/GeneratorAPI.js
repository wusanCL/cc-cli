const path = require("path")
const ejs = require("ejs")
const fs = require("fs-extra")

const isString = (val) => typeof val === "string"
const isFunction = (val) => typeof val === "function"

// 首先，这整个类，都是一个抽象层，做的是个注入操作  整体的调用我们应该放在generator那边，数据源在对应的插件下，这个抽象层做中间处理类似中间件，调用放在generator那  应该是这么个逻辑
class GenerateAPI {
    constructor(id, generator) {
        this.id = id
        this.generator = generator
    }

    injectImports(imports) {
        const { id } = this
        const _imports =
            this.generator.imports[id] ||
            (this.generator.imports[id] = new Set())(
                Array.isArray(imports) ? imports : [imports]
            ).forEach((i) => {
                _imports.add(i)
            })
    }

    extendPackage(fields) {
        const pkg = this.generator.pkg
    }

    // 首先要引入模板文件内容  然后调用ejs获取渲染后的内容   这个content是之后write的内容
    // 为了方便扩展增加了options和ejsOptions
    render(source, options = {}, ejsOptions = {}) {
        // 路径获取这边  vuecli用的是Error.captureStackTrace   的一个堆栈信息   很巧妙的感觉
        const baseDir = this.extractCallDir()

        if (isString(source)) {
            this._injectFileMiddleware(async () => {
                source = path.resolve(baseDir, source) //获取模板根路径
                // 去加载文件  那么首先需要获取目录
                const globby = require("globby")
                // 第一个参数是需要匹配的路径规则  第二个是配置  还有第三个回调  不过这边用了promise
                // 关于匹配规则  *代表{0,}个任意字符   整体规则和正则差不多     
                // 两个*号的意思就是   两层目录   这个*有两种意思  一个是代表层级路径  一个代表文件名
                const _files = await globby(["**/*"], { cwd: source })

                _files.forEach((rawPath) => {
                    const sourcePath = path.resolve(source, rawPath)
                    // 在vuecli中，还有使用yaml进行文件的一个解析相关，也就是说，在给到ejs之前还有一个步骤   所以另起了一个函数来进行编写
                    const content = renderFile(sourcePath, options, ejsOptions)

                    // 只有在不是全部为空白或者是Buffer流的情况下才将其添加进入files
                    // 问题：buffer流是什么情况？   全部为空白的验证感觉有点不太对？
                    if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
                        files[targetPath] = content
                    }
                })
            })
        }
    }

    _injectFileMiddleware(middleware) {
        this.generator.fileMiddlewares.push(middleware)
    }

    extractCallDir() {
        const obj = {}
        Error.captureStackTrace(obj)
        const callSite = obj.stack.split("\n")[3]
        // 具名函数的调用堆栈，匿名函数似乎不太一样
        const namedStackRegExp = /\s\((.*):\d+:\d+\)$/

        const matchResult = callSite.match(namedStackRegExp)

        const fileName = matchResult[1]

        return path.dirname(fileName)
    }
}

// 一个处理函数，甚至没有放在generatorapi的必要？
function renderFile(filePath, options, ejsOptions) {
    const template = fs.readFileSync(filePath, "utf-8")

    // 暂时没有使用yaml的需求  所以暂时跳过   vuecli中有一个extend和replace的处理
    const yaml = require("yaml-front-matter")
    const parsed = yaml.loadFront(template)
    const content = parsed.__content

    let finalTemplate = content.trim() + `\n`
    console.log(content)

    return ejs.render(finalTemplate, options, ejsOptions)
}

module.exports = GenerateAPI
