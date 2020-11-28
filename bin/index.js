#!/usr/bin/env node

const chalk = require('chalk');
const semver = require('semver');//比较版本号
const packageInfo = require('../package.json');
const requiredVersion = packageInfo.engines.node;

// check node version
function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(
      '你的node版本是' + process.version + ',而' + id + '所期望的版本是' + wanted
    ))
    process.exit(1)
  }
}

checkNodeVersion(requiredVersion, 'cc')

const program = require('commander');
// const minimist = require('minimist'); // 解析命令行参数

program
  .version(packageInfo.version, '-v --version')

program
  .command('create <projectName>')
  .description('create a new Project by cc')
  .option('-f, --force','')
  .action((name,cmd) => {
    if(!name){
      console.warn('please input a Name')
      process.exit(1)
    }
    require('../lib/create.js')(name)
  })

program.parse(process.argv)


