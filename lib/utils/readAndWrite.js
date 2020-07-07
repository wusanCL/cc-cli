const fs = require('fs-extra');
const exists = fs.existsSync;

module.exports = function (obj) {
    return new Promise((resolve) => {
        let path = process.env.TARGET_PATH + obj.target;
        if (obj.source) {
            //read
            fs.readFile(obj.source, 'utf-8', function (err, data) {
                if (obj.beforeWrite) data = obj.beforeWrite(data)
                fs.outputFile(path, data, function (err) {
                    resolve()
                })
            })
        } else {
            //no read
            fs.outputFile(path, '', function (err) {
                resolve()
            })
        }

    })
}