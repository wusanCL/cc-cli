// 真的做了很多版本的处理，这是一种底蕴，一种积累，暂时是没有办法的，只能慢慢来

const Module = require('module')    //内置模块   和我们平时写的module.export中的module不一样
const path = require('path')

const semver = require('semver')

// 为什么要用module呢，当项目逐渐庞大的时候，目录层级变深，我们的require语句就会变的特别丑，是否有什么模块加载机制的优化方式呢？就是使用module模块   可以尝试更改里面的path数组


const createRequire = Module.createRequire || Module.createRequireFromPath || function (filename) {
    // 这段属实找不到资料 - -
    // 猜：  其实就是require函数    require函数返回的是我们的module.exports   对象，也就是说，这个函数是要返回mod.exports就对了，至于filename那些应该就是module的属性配置
    // 简单来说   配置了mod的filename和paths也就是遍历路径   害执行了_compile？  这个就不太懂了   然后返回了mod的exports也就是我们引入的模块文件所导出的对象，那么我觉得_compile就是执行的方法  没有执行这个方法也就拿不到exports这个对象？
  const mod = new Module(filename, null)
  mod.filename = filename
  
  mod.paths = Module._nodeModulePaths(path.dirname(filename))

  mod._compile(`module.exports = require;`, filename)

  return mod.exports
}

function resolveFallback (request, options) {
  const isMain = false
  const fakeParent = new Module('', null)

  const paths = []

  for (let i = 0; i < options.paths.length; i++) {
    const p = options.paths[i]
    fakeParent.paths = Module._nodeModulePaths(p)
    const lookupPaths = Module._resolveLookupPaths(request, fakeParent, true)

    if (!paths.includes(p)) paths.push(p)

    for (let j = 0; j < lookupPaths.length; j++) {
      if (!paths.includes(lookupPaths[j])) paths.push(lookupPaths[j])
    }
  }

  const filename = Module._findPath(request, paths, isMain)
  if (!filename) {
    const err = new Error(`Cannot find module '${request}'`)
    err.code = 'MODULE_NOT_FOUND'
    throw err
  }
  return filename
}

const resolve = semver.satisfies(process.version, '>=10.0.0')
  ? require.resolve
  : resolveFallback

exports.resolveModule = function (request, context) {
  let resolvedPath
  try {
    try {
      resolvedPath = createRequire(path.resolve(context, 'package.json')).resolve(request)
    } catch (e) {
      resolvedPath = resolve(request, { paths: [context] })
    }
  } catch (e) {}
  return resolvedPath
}

exports.loadModule = function (request, context, force = false) {

    // request  eg：  @vue/cli-plugin-router/generator
    // context  是你的目标路径
  try {
    return createRequire(path.resolve(context, 'package.json'))(request)
  } catch (e) {
    const resolvedPath = exports.resolveModule(request, context)
    if (resolvedPath) {
        // 强制
      if (force) {
        clearRequireCache(resolvedPath)
      }
      return require(resolvedPath)
    }
  }
}

exports.clearModule = function (request, context) {
  const resolvedPath = exports.resolveModule(request, context)
  if (resolvedPath) {
    clearRequireCache(resolvedPath)
  }
}

function clearRequireCache (id, map = new Map()) {
  const module = require.cache[id]
  if (module) {
    map.set(id, true)
    // Clear children modules
    module.children.forEach(child => {
      if (!map.get(child.id)) clearRequireCache(child.id, map)
    })
    delete require.cache[id]
  }
}
