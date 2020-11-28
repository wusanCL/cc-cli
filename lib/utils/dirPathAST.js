// 生成路径下所有文件的AST描述对象

module.exports = function getTemplateDir(path, arr = [], relativePath = '') {
    var _dir = fs.readdirSync(path);

    _dir.forEach(function (item) {
        var absolutePath = path + '/' + item;
        var info = fs.statSync(absolutePath);

        if (info.isDirectory()) {
            let relative = relativePath + item + '/'
            arr.push({
                type: 'dir',
                absolutePath,
                relativePath: relative
            });
            getTemplateDir(absolutePath, arr, relative);
        } else {
            arr.push({
                type: 'file',
                absolutePath,
                relativePath: relativePath + item,
                filename: item
            });
        }
    })

    return arr
}