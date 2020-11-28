// 从远程仓库拉取模板
const fs = require("fs-extra")
const download = require("download-git-repo")

const MY_TEMPLATE_PATH = "github:wusanCL/vue-template"

module.exports = async function loadRemotePreset() {
    const tmpdir = process.env.PRESET_PATH
    // 保证模板处于最新状态

    fs.readdirSync(tmpdir) && fs.removeSync(tmpdir)

    return new Promise((resolve, reject) => {
        download(MY_TEMPLATE_PATH, tmpdir, (err) => {
            if (err) reject(err)
            resolve
        })
    })
}
