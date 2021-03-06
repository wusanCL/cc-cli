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


        // write package.json
        await writeFileTree(targetDir, {
            "package.json": JSON.stringify(pkg, null, 2),
        })

        // 关于插件安装  vuecli中对yarn   npm等进行了适配处理  
        // install

        // 命令执行 

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
    // 
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

    // 注入并解析预设
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

        this.promptCompleteCbs.forEach((fn) => fn(answer, preset))
        // 后续可以添加保存的预设的功能
        return preset
    }

    // 解析最终 prompts
    // vuecli中  只有在初始化的时候对this的属性进行了赋值   并没有在执行的时候进行赋值    但是我这边 因为需要选择模板类型，耦合性会比较高
    resolveFinalPrompts() {
        const prompts = [
            this.presetPrompts, //预设方案
            this.featurePrompts, //预安装插件
            ...this.injectedPrompts, //插件的配置项
        ]
        return prompts
    }
}
