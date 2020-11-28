const inquirer = require("inquirer");
const path = require('path');
const validateProjectName = require('validate-npm-package-name')
const chalk = require('chalk')
const fs = require("fs-extra");

const Creator = require('./Creator')

const {exit} = require('process')
const {warn,log,error} = console


//模板配置
async function create(projectName,options) {
  const cwd = process.cwd()
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir = path.resolve(cwd,name)

  const validate = validateProjectName(name)
  
  // check npm-package-name
  if(!validate.validForNewPackages){
    warn(chalk.red(`Invalid project name: "${name}"`))
    result.errors && result.errors.forEach(err => {
      error(chalk.red.dim('Error: ' + err))
    })
    result.warnings && result.warnings.forEach(warn => {
      error(chalk.red.dim('Warning: ' + warn))
    })
    exit(1)
  }
  
  if(fs.existsSync(targetDir)){
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: `目标目录已存在（ ${chalk.cyan(targetDir)} ），请选择一个合适的操作：`,
        choices: [
          { name: '覆盖', value: 'overwrite' },
          { name: 'Cancel', value: false }
        ]
      }
    ])

    if(!action){
      return
    }else if(action === 'overwrite'){
      console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
      await fs.remove(targetDir)
    }
  }
  const creator = new Creator({
    name,
    targetDir
  })
  creator.create()

}

module.exports = (name) => {
  return create(name);
};
