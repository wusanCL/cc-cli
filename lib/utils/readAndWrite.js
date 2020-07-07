const fs = require('fs-extra');
const exists = fs.existsSync;

module.exports = function (obj) {
    return new Promise((resolve) => {
        let targetPath = process.env.TARGET_PATH + obj.target;
        if (obj.source) {
            //read
            fs.readFile(process.env.ROOT_DIR + '/' + obj.source, 'utf-8', function (err, data) {
                if (obj.beforeWrite) data = obj.beforeWrite(data)
                fs.outputFile(targetPath, data, function (err) {
                    resolve()
                })
            })
        } else {
            //no read
            fs.outputFile(targetPath, '', function (err) {
                resolve()
            })
        }

    })
}