const slash = require("slash"); //转换路径
const ora = require("ora"); //转圈圈
const { log } = console;
const loadRemotePreset = require("./loadRemotePreset");
const Generate = require("./Generator");
const shell = require("shelljs");
const os = require("os");


// 下载模板    模板处理（插件、填充模板的一些问题）    安装依赖（包管理器等的判断）
async function run({ presetType, promptModules, projectName }) {
  const spinner = ora("begin").start();

  process.env.ROOT_DIR = slash(process.argv[1]) + "/../..";
  const targetPath = process.env.TARGET_PATH = process.cwd() + "/" + projectName;
  const sourcePath = process.env.PRESET_PATH = os.tmpdir() + "/cc-cli-preset/template/" + presetType;

  //下载模板到临时文件夹
  await loadRemotePreset(projectName);

  //模板处理
  await new Generate(targetPath, sourcePath, promptModules, projectName).exec();

  // 安装依赖
  spinner.stop();
  log("项目初始化完成，开始下载依赖包");
  shell.cd("./" + projectName);
  shell.exec("yarn");
}

module.exports = run;
