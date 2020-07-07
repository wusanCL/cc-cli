const inquirer = require('inquirer');
const getPromptModules = require('./utils/getPromptMdules');
const { run } = require('./run');
const { filterObj } = require('./utils/util');



//创建模板的总入口
//模板配置， 需要和用户进行交互
async function create(projectName) {
    let obj = {
        projectName,
        promptMdules: {},
        allPromptModules: getPromptModules()
    }

    //判断是否使用默认配置
    const { ok } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'ok',
            message: '是否使用默认配置?'    //vuecli默认模板
        }
    ])
    if (!ok) {
        const prompts = obj.allPromptModules.map((m) => m.inquirer);
        const answer = await inquirer.prompt(prompts)

        obj.promptMdules = answer
    } else {
        //默认配置
        obj.promptMdules = {
            'rem': true,
            'axios': true,
            'router': true,
            'less':true
        }
    }

    run(obj)
}


module.exports = (name) => {
    return create(name)
}