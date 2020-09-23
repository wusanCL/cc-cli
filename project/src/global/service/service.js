//1.0.0
class Service {
    constructor(api, xhr, request) {
        this.api = api  //api接口
        this.request = request 
        this.xhr = xhr

        return this.initService()
    }
    // init service
    initService() {
        var keys = Object.keys(this.api)
        keys.forEach((name) => {
            this[name] = this['$' + name] = this._createRequest(name)
        })
        return this
    }

    //create request function
    _createRequest(name) {

        return function (config = {}) {
            var _default = this.api[name] 

            if (process.env.NODE_ENV === 'development') {
                if (config.mock) {
                    return new Promise((res, rej) => {
                        let mock = config.mock
                        mock === 'success' ? res(_default.mock[mock]) : rej(_default.mock[mock])
                    })
                }
            }
            return this.request({
                api: Object.assign({}, typeof _default === 'string' ? {url:_default} : _default, config),
                xhr: this.xhr
            })

        }
    }
}

export default Service