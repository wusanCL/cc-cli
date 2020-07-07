
module.exports = ()=>{
    return [
        'router',
        // 'vuex',
        'less',
        'rem',
        'axios',
        // 'vant'
    ].map(file => require(`../promptModules/${file}`))
}