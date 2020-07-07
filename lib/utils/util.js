// 通用的工具函数

module.exports = {
    //过滤对象(真值)
    filterObj(obj) {
        let newObj = {}
        for (let key in obj) {
            let value = obj[key]
            if (value) newObj[key] = value
        }
        return newObj
    }
}