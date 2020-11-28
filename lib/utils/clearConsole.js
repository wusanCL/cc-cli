const readline = require("readline")

module.exports = () => {
    if (process.stdout.isTTY) {
        const blank = "\n".repeat(process.stdout.rows)
        console.log(blank)
        // 跳到0，0的位置
        readline.cursorTo(process.stdout, 0, 0)
        // 清除    至于为什么要用readline，因为process.stdout是流数据，要读写的话就要用~   不过stdout的方法比如write 好像支持字符串
        readline.clearScreenDown(process.stdout)
    }
}
