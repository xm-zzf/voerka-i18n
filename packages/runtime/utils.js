
/**
 * 判断是否是JSON对象
 * @param {*} obj 
 * @returns 
 */
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
 * 判断值是否是一个数字
 * @param {*} value 
 * @returns 
 */
 function isNumber(value){
    if(value==undefined) return false
    if(typeof(value)=='number') return true
    if(typeof(value)!='string') return false        
    try{
        if(value.includes(".")){
            let v = parseFloat(value)
            if(value.endsWith(".")){                
                return !isNaN(v) && String(v).length===value.length-1
            }else{
                return !isNaN(v) && String(v).length===value.length
            }            
        }else{
            let v = parseInt(value)
            return !isNaN(v) && String(v).length===value.length
        }    
    }catch{
        return false
    }
}
function isFunction(fn){
    return typeof fn === "function"
}
/**
 * 当value= null || undefined || "" || [] || {} 时返回true
 * @param {*} value 
 * @returns 
 */
function isNothing(value){
    if(["boolean","function"].includes(typeof(value))) return false
    if(value=="") return true    
    if(value==undefined) return true    
    if(Array.isArray(value) && value.length==0) return true
    if(typeof(value)=="object" && Object.keys(value).length==0) return true
    return false
} 

/**
 * 深度合并对象
 * 
 * 注意：
 *  - 不会对数组成员进行再次遍历
 *  - 不能处理循环引入
 * 
 * @param {*} toObj 
 * @param {*} formObj 
 * @param {*} options 
 *     array : 数组合并策略，0-替换，1-合并，2-去重合并
 *     mixin : 是否采用混入方式来，=false,  则会创建新对象并返回
 */
function deepMerge(toObj,formObj,options={}){
    let results = options.mixin ? toObj : Object.assign({},toObj)
    Object.entries(formObj).forEach(([key,value])=>{
        if(key in results){
            if(typeof value === "object" && value !== null){
                if(Array.isArray(value)){
                    if(options.array === 0){//替换
                        results[key] = value
                    }else if(options.array === 1){//合并
                        results[key] = [...results[key],...value]
                    }else if(options.array === 2){//去重合并
                        results[key] = [...new Set([...results[key],...value])]
                    }
                }else{
                    results[key] = deepMerge(results[key],value,options)
                }
            }else{
                results[key] = value
            }
        }else{
            results[key] = value
        }
    })
    return results
}

 
function deepMixin(toObj,formObj,options={}){
    return deepMerge(toObj,formObj,{...options,mixin:true})
}

/**
 * 获取指定变量类型名称
 * getDataTypeName(1) == Number
 * getDataTypeName("") == String
 * getDataTypeName(null) == Null
 * getDataTypeName(undefined) == Undefined
 * getDataTypeName(new Date()) == Date
 * getDataTypeName(new Error()) == Error
 * 
 * @param {*} v 
 * @returns 
 */
 function getDataTypeName(v){
	if (v === null)  return 'Null' 
	if (v === undefined) return 'Undefined'   
    if(typeof(v)==="function")  return "Function"
	return v.constructor && v.constructor.name;
};
/**
 * 格式化日期
 * 将值转换为Date类型
 * @param {*} value  
 */
function toDate(value) {
    try {
        return value instanceof Date ? value : new Date(value)
    } catch {
        return value
    }
}
/**
 * 转换为数字类型
 */
function toNumber(value,defualt=0) {
    try {
        if (isNumber(value)) {
            return parseInt(value)
        } else {
            return defualt
        }
    } catch {
        return value 
    }
} 
/**
 * 转换为货币格式
 * 
 * @param {*} value      可以是数字也可以是字符串
 * @param {*} division    分割符号位数,3代表每3个数字添加一个,号  
 * @param {*} prefix      前缀,货币单位
 * @param {*} suffix      前缀,货币单位
 * @param {*} precision   小数点精确到几位，0-自动
 * @returns 
 */
 function toCurrency(value,{division=3,prefix="",precision=0,suffix=""}={}){
    let [wholeValue,decimalValue] = String(value).split(".")
    let result = []
    for(let i=0;i<wholeValue.length;i++){
        if(((wholeValue.length - i) % division)==0 && i>0) result.push(",")
        result.push(wholeValue[i])
    }
    if(decimalValue){
        if(precision>0){
            decimalValue = String(parseFloat(`0.${decimalValue}`).toFixed(precision)).split(".")[1]
        }
        result.push(`.${decimalValue}`)
    }
    return prefix + result.join("") + suffix
}

/**
 * 根据路径获取指定值
 * 
 * getByPath({a:{b:1}},"a.b") == 1
 * getByPath({a:{b:1}},"a.c",2) == 2
 * 
 * @param {*} obj 
 * @param {*} path          使用.分割的路径
 * @param {*} defaultValue  默认值
 * @returns 
 */
function getByPath(obj,path,defaultValue){
    if(typeof(obj)!="object") return defaultValue
    let paths = path.split(".")
    let cur = obj
    for(let key of paths){
        if(typeof(cur)=="object" && key in cur ){
            cur = cur[key]
        }else{
            return defaultValue
        }
    }
    return cur
}


// YY	18	年，两位数
// YYYY	2018	年，四位数
// M	1-12	月，从1开始
// MM	01-12	月，两位数字
// MMM	Jan-Dec	月，英文缩写
// D	1-31	日
// DD	01-31	日，两位数
// H	0-23	24小时
// HH	00-23	24小时，两位数
// h	1-12	12小时
// hh	01-12	12小时，两位数
// m	0-59	分钟
// mm	00-59	分钟，两位数
// s	0-59	秒
// ss	00-59	秒，两位数
// S	0-9	毫秒（百），一位数
// SS	00-99	毫秒（十），两位数
// SSS	000-999	毫秒，三位数
// Z	-05:00	UTC偏移
// ZZ	-0500	UTC偏移，两位数
// A	AM / PM	上/下午，大写
// a	am / pm	上/下午，小写
// Do	1st... 31st	月份的日期与序号

function formatDatetime(value,templ="YYYY/MM/DD HH:mm:ss"){
    const v = toDate(value)
    const year =String(v.getFullYear()),month = String(v.getMonth()+1),weekday=String(v.getDay()),day=String(v.getDate())
    const minute = String(v.getMinutes()),second = String(v.getSeconds()),millisecond=String(v.getMilliseconds()),hour = String(v.getHours())
    const time = String(v.getTime())
    let result = templ
    const vars = [
        ["YYYY", year],                                                 // 2018	年，四位数
        ["YY", year.substring(year.length - 2, year.length)],           // 18	年，两位数        
        ["MMM", ""],                                                    // Jan-Dec	月，英文缩写
        ["MM", month.padStart(2, "0")],                                 // 01-12	月，两位数字
        ["M", month],                                                   // 1-12	月，从1开始
        ["DD", day.padStart(2, "0")],                                   // 01-31	日，两位数
        ["D", day],                                                     // 1-31	日
        ["HH", String(hour).padStart(2, "0")],                          // 00-23	24小时，两位数
        ["H", String(hour)],                                            // 0-23	24小时
        ["hh", String(hour > 12 ? hour - 12 : hour).padStart(2, "0")],  // 01-12	12小时，两位数
        ["h", hour > 12 ? hour - 12 : hour],                            // 1-12	12小时
        ["mm", minute.padStart(2, "0")],                                // 00-59	分钟，两位数
        ["m", minute],                                                  // 0-59	分钟
        ["ss", second.padStart(2, "0")],                                // 00-59	秒，两位数
        ["s", second],                                                  // 0-59	秒
        ["SSS", millisecond],                                           // 000-999	毫秒，三位数
        ["SS", millisecond.substring(year.length - 2, year.length)],    // 00-99	毫秒（十），两位数
        ["S",millisecond[millisecond.length - 1]],                      // 0-9	毫秒（百），一位数
        ["A",  hour > 12 ? "PM" : "AM"],                                // AM / PM	上/下午，大写
        ["a", hour > 12 ? "pm" : "am"]                                  // am / pm	上/下午，小写
    ]
    vars.forEach(([key,value])=>result = result.replace(key,value))
    return result
}


/**
 * 创建格式化器
 */
function createFormatter(fn,meta={}){
    let opts = Object.assign({
        checker     : false,        // true时代表该格式化器是作为校验器存在，会在执行每一次格式化器函数后调用进行检查
        paramCount  : 0,            // 声明该该格式化器具有几个参数,0代表未知
        error       : 0,            // 当执行格式化化器函数出错时的行为，取值0-break,1-skip,2-default
        empty       : false,        // 当输入为空时的输出        
        default     : null          // 当出错默认输出     
    },meta)
    Object.entries(opts).forEach(([key,value])=>fn[key] = value)
    return fn 
}

module.exports ={
    isPlainObject,
    isFunction,
    isNumber,
    isNothing,
    deepMerge,
    deepMixin,
    getByPath,
    getDataTypeName,
    toDate,
    toNumber,
    toCurrency 
}