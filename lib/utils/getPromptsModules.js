
module.exports = (type)=>{
    const preset = {
        vue:[
            // 'router',
            'vuex',
            // 'less',
            // 'rem',
            // 'axios',
            // 'vant'
        ],
        react:[]
    }
    return preset[type].map(file => require(`../promptModules/${type}/${file}`))
}