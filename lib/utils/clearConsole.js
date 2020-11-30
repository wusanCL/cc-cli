const readline = require("readline")

module.exports = () => {
    if (process.stdout.isTTY) {
        const blank = "\n".repeat(process.stdout.rows)
        console.log(blank)
        // 跳到0，0的位置
        readline.cursorTo(process.stdout, 0, 0)
        // 清除    因为process.stdout是流数据，要读写的话需要用readline
        readline.clearScreenDown(process.stdout)
    }
}
