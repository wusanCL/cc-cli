// 先明确一下我要做什么   找到代码的imports   然后判断传入的options是否包含重复的   是添加还是更新    无非就这两种，那么我首先需要获得两个数组  专门用来存放信息

module.exports = function injectImprots(fileInfo, api, {imports}) {
    const j = api.jscodeshift //api就是   emmm   就是jscodesshift库提供给我们的一些工具函数的集合     包含了以下3个东西
    // jscodeshift	A reference to the jscodeshift library
    // stats	A function to collect statistics during --dry runs
    // report	Prints the passed string to stdout
    const root = j(fileInfo.source) //根据我们传入的文件内容 （字符串）所生成的Coll什么什么的实例  并不是ast描述对这个实例拥有许多有用的东西  我们可以通过nodes获取ast描述对象数组

    const toImportAST = i => j(`${i}\n`).nodes()[0].program.body[0]
    const toImportHash = node => JSON.stringify({
        specifiers: node.specifiers.map(i => i.local.name),
        source: node.source.value,
      })

      
    const declarations = root.find(j.ImportDeclaration)

    const importSet = new Set(declarations.nodes().map(node => toImportHash(node)))
    const nonDuplicates = node => !importSet.has(toImportHash(node))
    const importASTNodes = imports.map(i => toImportAST(i)).filter(nonDuplicates)

    // 操作方式  直接使用 Collection类提供的方法进行操作
    // 也可以直接对ast进行操作        只有这两种操作方式   直接对ast一般会和nodepath和node属性有关系，c类就是api了
    if (declarations.length) {
        // 获取到最后一个C类   
        declarations.at(-1).insertAfter(importASTNodes)
    } else {
        root.get().node.program.body.unshift(...importASTNodes)
    }

    return root.toSource()
}
