const { execSync } = require("child_process")//使用子进程来执行语句判断包管理环境
const semver = require('semver') //版本规范解析库   

let _hasYarn
let _pnpmVersion

function getPnpmVersion () {
    if (_pnpmVersion != null) {
      return _pnpmVersion
    }
    try {
      _pnpmVersion = execSync('pnpm --version', {
        stdio: ['pipe', 'pipe', 'ignore']
      }).toString()
      _hasPnpm = true
    } catch (e) {}
    return _pnpmVersion || '0.0.0'
  }


exports.hasYarn = () => {
    if (_hasYarn != null) {
        return _hasYarn
    }
    try {
        execSync("yarn -v", { stdio: "ignore" })
        return (_hasYarn = true)
    } catch (e) {
        return (_hasYarn = false)
    }
}

// 为什么用3.0.0呢   我猜npm与pnpm之间的一些版本问题
exports.hasPnpm3OrLater = () => {
    return this.hasPnpmVersionOrLater("3.0.0")
}

exports.hasPnpmVersionOrLater = (version) => {
    // 判断_pnpmVersion的版本是否小于version
    return semver.gte(getPnpmVersion(), version)
}
