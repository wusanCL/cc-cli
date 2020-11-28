import axios from 'axios';
import Service from './service'
import api from './api';

const requestFn = function (requestInfo) {
    const {xhr, api } = requestInfo
    const { url, method = 'post', data } = api

    const req = xhr({
        url,
        method,
        params:data
    })
    return req.then(respon => {
        let data = respon.data
        if(data.code == 1000){
            return data.data
        } else {
            throw(api.errData ? data.data : data.msg)
        }
    })
}

const createService = (function (xhr) {
    return function(api){
        return new Service(api, xhr, requestFn)
    }
})(axios.create({
    baseURL:process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080/'
}))



export default createService


export const globalService = createService(api)
