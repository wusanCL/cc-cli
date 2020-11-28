module.exports = (api) => {
    api.injectImports('path','import ')

    api.extendPackage({
        dependencies:{
            vuex:''
        }
    })

    api.render('./template')
}