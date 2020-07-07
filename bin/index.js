#!/usr/bin/env node

const chalk = require('chalk');
const semver = require('semver');//比较版本号
const packageInfo = require('../package.json');
const requiredVersion = packageInfo.engines.node;

// 检测node的版本号
function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) { // process.version表示当前node版本
    console.log(chalk.red(
      '你的node版本是' + process.version + ',而' + id + '所期望的版本是' + wanted
    ))
    //终止nodejs进程
    process.exit(1)
  }
}

checkNodeVersion(requiredVersion, 'cc')


const slash = require('slash'); //  \ => /  
const fs = require('fs');
const exists = fs.existsSync;   //解析路径是否存在
const program = require('commander');
// const minimist = require('minimist'); // 解析命令行参数

program
  .version(packageInfo.version, '-v --version')


program
  .command('create <projectName>')
  .description('create a new Project by cc')
  .action((name) => {
    require('../lib/create.js')(name)
  })

program.parse(process.argv)


