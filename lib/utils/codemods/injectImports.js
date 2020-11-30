
module.exports = function injectImprots(fileInfo, api, {imports}) {
    const j = api.jscodeshift 
    // jscodeshift	A reference to the jscodeshift library
    // stats	A function to collect statistics during --dry runs
    // report	Prints the passed string to stdout
    const root = j(fileInfo.source) 

    const toImportAST = i => j(`${i}\n`).nodes()[0].program.body[0]
    const toImportHash = node => JSON.stringify({
        specifiers: node.specifiers.map(i => i.local.name),
        source: node.source.value,
      })

      
    const declarations = root.find(j.ImportDeclaration)

    const importSet = new Set(declarations.nodes().map(node => toImportHash(node)))
    const nonDuplicates = node => !importSet.has(toImportHash(node))
    const importASTNodes = imports.map(i => toImportAST(i)).filter(nonDuplicates)
     
    if (declarations.length) {  
        declarations.at(-1).insertAfter(importASTNodes)
    } else {
        root.get().node.program.body.unshift(...importASTNodes)
    }

    return root.toSource()
}
