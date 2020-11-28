const EventEmitter = require("events")
const getModules = require("./utils/getPromptsModules")
const inquirer = require("inquirer")
const PromptModuleAPI = require("./PromptModuleAPI")
const cloneDeep = require("lodash.clonedeep")
const clearConsole = require("./utils/clearConsole")
const writeFileTree = require("./utils/writeFileTree")
const { loadModule } = require("./utils/module")

const { hasYarn, hasPnpm3OrLater } = require("./utils/env")
const Generator = require("./Generator")

const isCustom = (answers) => answers.preset === "custom"

module.exports = class Creator extends EventEmitter {
    constructor({ name, targetDir }) {
        super()
        const {
            presetPrompts,
            templateTypePrompts,
            featurePrompts,
        } = this.resolveIntroPrompts()

        this.name = name
        this.targetDir = targetDir
        this.templateTypePrompts = templateTypePrompts
        this.presetPrompts = presetPrompts
        this.featurePrompts = featurePrompts
        this.injectedPrompts = []
        this.promptCompleteCbs = []
    }

    async create() {
        const { name, targetDir } = this

        const preset = cloneDeep(await this.promptAndResolvePreset())

        // 获取用户的包管理器
        const packageManager =
            // loadOptions().packageManager ||
            (hasYarn() ? "yarn" : null) || (hasPnpm3OrLater() ? "pnpm" : "npm")

        // clearConsole()

        const pkg = {
            name,
            version: "0.0.0",
            private: true,
            devDependencies: {},
        }

        // 设置plugins的版本
        // Object.keys(preset.plugins).forEach((dep) => {
        //     let { version } = preset.plugins

        //     if(!version){
        //         version = 'latest'
        //     }

        //     pkg.devDependencies[dep] = version
        // })

        // write package.json
        await writeFileTree(targetDir, {
            "package.json": JSON.stringify(pkg, null, 2),
        })

        // 关于插件安装  vuecli中对yarn   npm等进行了适配处理  所以显得比较麻烦，但是不得不说vuecli考虑的特别周到
        // 暂时跳过这个  之后再细看
        // install

        // 命令执行  使用execa

        const plugins = await this.resolvePlugins(preset, preset)

        const generate = new Generator(targetDir, {
            name,
            plugins,
            pkg,
        })

        generate.generate()
    }
    resolvePlugins(preset) {
        let rawPlugins = preset.plugins
        let plugins = []
        Object.keys(rawPlugins).forEach((id) => {
            plugins.push({
                id,
                option: rawPlugins[id],
                apply: loadModule(
                    `./promptModules/${preset.type}/${id}/generator`,
                    "../package.json"
                ),
            })
        })

        return plugins
    }
    // vuecli中将prompts进行了一个细致的划分  将比较简单的比如这个前言 注入  放在这  比较复杂的专门放在了promptModules下
    resolveIntroPrompts() {
        // 模板类型
        const templateTypePrompts = {
            type: "list",
            name: "type",
            message: "请选择模板基本框架",
            default: "vue",
            choices: ["vue", "react"],
        }
        // 预设方案
        const presetPrompts = {
            name: "preset",
            type: "list",
            default: "default",
            message: "请选择预设方案",
            choices: [
                {
                    name: "自定义",
                    value: "custom",
                },
                {
                    name: "默认（使用route、axios、rem）",
                    value: "default",
                },
            ],
        }

        // 项目插件集合
        const featurePrompts = {
            name: "feature",
            type: "checkbox",
            when: isCustom,
            message: "请选择项目所要使用的插件（配置）",
            choices: [],
        }

        return {
            templateTypePrompts,
            presetPrompts,
            featurePrompts,
        }
    }

    // 注入并解析预设           你如果想将这个功能专门放在一个模块下也可以  vuecli是将其放在了creator类中
    // vue中是将所有的命令行交互先统一整理，按照不同的类型划分，然后一起放到一个数组里面   只调用了一次inquirer   (resolvePlugins函数不太懂干嘛的  之后再细看)
    async promptAndResolvePreset() {
        let { type } = await inquirer.prompt([this.templateTypePrompts])

        // 根据模板类型（type）类型获取对应的injectedPrompts
        getModules(type).forEach((i) => i(new PromptModuleAPI(this)))

        let answer = await inquirer.prompt(this.resolveFinalPrompts())

        console.log(answer)
        const preset = {
            type,
            plugins: {},
        }

        // 这个放在这边是因为，这个函数的功能是，解析预设，第三方包也算是预设的一部分  我最开始知识认为这个函数做的是   提示处理，和解析用户回答   但是从命名来看，还包含了解析预设
        this.promptCompleteCbs.forEach((fn) => fn(answer, preset))
        // 后续可以添加保存的预设的功能
        return preset
    }

    // 解析最终 prompts
    // vuecli中  只有在初始化的时候对this的属性进行了赋值   并没有在执行的时候进行赋值    但是我这边就   因为需要选择模板类型，所以暂时想不到好的办法来进行解耦
    resolveFinalPrompts() {
        const prompts = [
            this.presetPrompts, //预设的
            this.featurePrompts, //插件的
            ...this.injectedPrompts, //插件配置的
        ]
        return prompts
    }
}
