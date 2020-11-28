const fs = require('fs-extra');
const exists = fs.existsSync;

// 就算不用git   直接copy不好吗   bash命令直接复制就好了不是- -
module.exports = 
async function downLoadTemplate(target, sourceDirAST) {
    let arr = [];

    if (exists(target)) { fs.removeSync(target) }
    fs.ensureDirSync(target);

    sourceDirAST.forEach((item) => {
        arr.push(new Promise((resolve) => {
            var targetPath = target + '/' + item.relativePath
            if (item.type === 'file') {
                try {
                    fs.readFile(item.absolutePath, 'utf-8', function (err, data) {
                        fs.writeFile(targetPath, data, (err) => {
                            resolve()
                        })
                    });
                } catch (err) {
                    log(chalk.red(err))
                    process.exit(1)
                }
            } else {
                fs.mkdirSync(targetPath);
                resolve()
            }
        }))
    })

    await Promise.all(arr)
}