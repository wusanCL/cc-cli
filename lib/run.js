const fs = require('fs-extra');
const slash = require('slash');//转换路径
const ora = require('ora');//转圈圈
const { log } = console;
const downLoadTemplate = require('./utils/downLoadTemplate');
const Generate = require('./generate');
const shell = require('shelljs');


const Info = {}

//职责：下载模板以及根据用户选项修改项目目录
async function run(obj) {
    const spinner = ora('begin').start();
    const { allPromptModules, promptMdules } = obj;
    const { projectName } = Info.projectName = obj;
    const promptModules = Info.promptModules = filterModules(promptMdules, allPromptModules);
    const targetPath = Info.targetPath = process.env.TARGET_PATH = process.cwd() + '/' + projectName;
    const sourcePath = Info.sourcePath = process.env.CC_PROJECT_DIR = slash(process.argv[1]) + '/../../project';
    const templateAST = getTemplateDir(sourcePath);

    //下载模板
    await downLoadTemplate(targetPath, templateAST)

    //生成自定义模板
    await new Generate(targetPath, sourcePath, promptModules, templateAST, projectName).exec()

    spinner.stop();
    log('项目初始化完成，开始下载依赖包');
    shell.cd('./' + projectName);
    shell.exec('yarn');
}

//根据用户回答筛选出需要执行的处理模块
function filterModules(answer, all) {
    return all.filter((item) => {
        return answer[item.name] === true
    })
}

//创建模板项目目录AST
function getTemplateDir(path, arr = [], relativePath = '') {
    var _dir = fs.readdirSync(path);

    _dir.forEach(function (item) {
        var absolutePath = path + '/' + item;
        var info = fs.statSync(absolutePath);

        if (info.isDirectory()) {
            let relative = relativePath + item + '/'
            arr.push({
                type: 'dir',
                absolutePath,
                relativePath: relative
            });
            getTemplateDir(absolutePath, arr, relative);
        } else {
            arr.push({
                type: 'file',
                absolutePath,
                relativePath: relativePath + item,
                filename: item
            });
        }
    })

    return arr
}


module.exports = {
    run,
    Info
}