/**
 * 初始化入口
* 
* 注意：执行compile命令会生新后成本文件，所以请不要修改本文件
* 本文件仅供在执行voerkai18n extract&compile前提供t函数占位引用 
*/

const { translate,VoerkaI18nScope  } =  require("@voerkai18n/runtime")
 

// 语言作用域
const scope = new VoerkaI18nScope({
    id          : "{{scopeId}}",                    // 当前作用域的id，自动取当前工程的package.json的name
    debug       : false,                            // 是否在控制台输出高度信息
    messages    : {},                               // 当前语言包
    idMap       : {},                               // 消息id映射列表    
    formatters  : {},                               // 扩展自定义格式化器
    library     : {{library}},                      // 开发库时设为true
    languages: [
        {
            name: "zh",
            title: "中文",
            default: true
        },
        {
            name: "en",
            title: "英文"
        }
    ]
}) 
// 翻译函数
const scopedTtranslate = translate.bind(scope) 

module.exports.t = scopedTtranslate
module.exports.i18nScope = scope 