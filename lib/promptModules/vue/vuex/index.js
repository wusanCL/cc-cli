module.exports = (cli) => {
    // vuecli中这边有配置一个plugins的选项，暂时不懂是干嘛用的
    cli.injectFeature({
        name: "vuex",
        value: "vuex",
        checked: false,
    })

    // cli.injectPrompt({
    //     type:'confirm',
    //     name:'vuex',
    //     message:'是否使用vuex作为项目的状态管理工具？'
    // })

    cli.onPromptComplete((answer,preset) => {
        answer.feature.includes('vuex') && (preset.plugins.vuex = {})
    })
}
