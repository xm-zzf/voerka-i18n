const path = require("path") 
const fs = require("fs") 
const readJson = require("readjson")

async function importModule(url,onlyDefault=true) {
    try{
        return require(url)
    }catch(e){
        const result = await import(`file:///${url}`)
        return onlyDefault ? result.default : result
    }
}

/**
 * 从当前文件夹开始向上查找package.json文件，并解析出语言包的类型
 * @param {*} folder 
 */
 function findModuleType(folder){
    try{
        let pkgPath = path.join(folder, "package.json")
        if(fs.existsSync(pkgPath)){
            let pkg = readJson.sync(pkgPath)
            return pkg.type || "commonjs"
        }
        let parent = path.dirname(folder)
        if(parent===folder) return null
        return findModuleType(parent)
    }catch(e){
        return "esm"
    }
}



/**
 * 读取指定文件夹的package.json文件，如果当前文件夹没有package.json文件，则向上查找
 * @param {*} folder 
 * @param {*} exclueSelf    =true 排除folder，从folder的父级开始查找
 * @returns 
 */
function getCurrentPackageJson(folder,exclueSelf=true){
    try{ 
        let pkgPath =exclueSelf ? 
                        path.join(folder, "..", "package.json")
                        : path.join(folder, "package.json")
        if(fs.existsSync(pkgPath)){
            let pkg = readJson.sync(pkgPath)
            return pkg
        }
        let parent = path.dirname(folder)
        if(parent===folder) return null
        return getCurrentPackageJson(parent,false)
    }catch(e){
        return null
    }
}

function createPackageJsonFile(targetPath,moduleType="auto"){
    if(moduleType==="auto"){
        moduleType = findModuleType(targetPath)
    }
    const packageJsonFile = path.join(targetPath, "package.json")
    if(["esm","es","module"].includes(moduleType)){
        fs.writeFileSync(packageJsonFile,JSON.stringify({type:"module",license:"MIT"},null,4))
        if(moduleType==="module"){
            moduleType = "esm"
        }
    }else{
        fs.writeFileSync(packageJsonFile,JSON.stringify({license:"MIT"},null,4))
    }
    return moduleType
}


function isPlainObject(obj){
    if (typeof obj !== 'object' || obj === null) return false;
    var proto = Object.getPrototypeOf(obj);
    if (proto === null) return true;
    var baseProto = proto;

    while (Object.getPrototypeOf(baseProto) !== null) {
        baseProto = Object.getPrototypeOf(baseProto);
    }
    return proto === baseProto; 
}
/**
 * 
 * getExportContent({a:1})  ==   export let a = 1
 * 
 * @param {*} values 
 * @param {*} moduleType 
 * @returns 
 */
function generateExportContents(values,{moduleType="esm",varExportDeclare="let"}={}){
    if(!isPlainObject(values)) throw new TypeError("export value must be a function or plain object") 
    let results = []
    let varExports = [] 
    let varExportSyntax = moduleType === "esm" ?  `export ${varExportDeclare} `  : "module.exports."
    let funcExportSyntax = moduleType === "esm" ? `export ` : "module.exports."

    Object.entries(values).forEach(([name,value])=>{
        if(Array.isArray(value) || isPlainObject(value)){ 
            results.push(`${varExportDeclare} ${name} = ${JSON.stringify(value,null,4)}`)
        }else if(typeof(value)==="function"){                
            if(value.prototype){ 
                results.push(value.toString())
            }else{// 箭头函数
                results.push(`const ${name} = ${value.toString()}`)                    
            }
        }else{
            results.push(`${varExportDeclare} ${name} = ${JSON.stringify(value)}`)
        }                
    })
     
    if(moduleType === "esm"){
        results.push(`export {\n\t${Object.keys(values).join(",\n\t")}\n}`)
    }else{ fu
        results.push(`module.exports = {\n\t${Object.keys(values).join(",\n\t")}\n}`)
    }

    return  results.join("\n")
}

/**
 * 创建js文件
 * @param {*} filename 
 * @param {*} defaultExports  
 * @param {*} namedExports    {name:value}
 * 
 * @param {*} moduleType 
 */
function createJsModuleFile(filename,defaultExports={},namedExports={},moduleType="esm"){
    let jsContents = []
    if(moduleType === "esm"){
        Object.entries(namedExports).forEach(([name,value])=>{
           
        }) 
        jsContents.push
    }else{
        
    }
}

function escape(str){
    return str
        .replaceAll("\\t","\t")
        .replaceAll("\\n","\n")
        .replaceAll("\\b","\b")
        .replaceAll("\\r","\r")
        .replaceAll("\\f","\f")
        .replaceAll("\\'","\'")
        .replaceAll('\\"','\"')
        .replaceAll('\\v','\v')
        .replaceAll("\\\\",'\\')       
}

// 翻译函数
// @voerkai18n/cli工程本身使用了voerkai18n,即@voerkai18n/cli的extract和compile依赖于其自己生成的languages运行时
// 这样产生了鸡蛋问题，因此在extract与compile调试阶段如果t函数无法使用(即编译的languages无法正常使用)，则需要提供t函数
// 此函数的目的是提供一种容错方式
let t
try{
    t = require("./languages").t
}catch(e){
    console.warn(e.stack)
    t = v=>v
}

module.exports = {
    importModule,
    findModuleType,
    createPackageJsonFile,
    isPlainObject,
    getCurrentPackageJson,
    escape,
    t
}

