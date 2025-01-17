const { t,i18nScope } = require("./languages"); 

async function main(){
    console.log(`-------------${i18nScope.activeLanguage}-----------------`)
    console.log(t("这是一个测试:{a}+{b | x}={c}", { a: 1, b: 2, c: 3 }));
    console.log(t("你好"))//("你好")
    console.log(t("我叫{name},今年{age}岁","张三",12))//("我叫张三,今年12岁") 
    console.log(t("我叫{name},今年{age}岁",["张三",12]))//("我叫张三,今年12岁") 
    console.log(t("我叫{name},今年{age}岁",{name:"张三",age:12}))//("我叫张三,今年12岁") 
    console.log(t("中国"))//("china")
    console.log(t("我有{}部车",0))//("我没有车")
    console.log(t("我有{}部车",1))//("我有一部车")
    console.log(t("我有{}部车",2))//("我有两部车")
    console.log(t("我有{}部车",3))//("我有3部车")
    console.log(t("我有{}部车",100))//("我有100部车")
    console.log(t("我有{count}部车",{count:3}))//("我有3部车")
    console.log(t("我有{count}部车",{count:()=>3}))//("我有3部车")
    console.log(t("现在是{|date}",Date.now()))
    
    await i18nScope.change("en")
    
        console.log(`-------------${i18nScope.activeLanguage}-----------------`)
        console.log(t("中国"))//("china")
        console.log(t("我有{}部车",[100]))//("我有100部车")
        console.log(t("我有{}部车",0))//("I don't have car")
        console.log(t("我有{}部车",1))//("I have a car")
        console.log(t("我有{}部车",2))//("I have two cars")
        console.log(t("我有{}部车",3))//("I have 3 cars")
        console.log(t("我有{}部车",100))//("I have 100 cars")
        console.log(t("你好"))//("hello")
        console.log(t("我叫{name},今年{age}岁","tom",12))//("My name is tom,Now 12 years old year") 
        console.log(t("我叫{name},今年{age}岁",["tom",12]))//("My name is tom,Now 12 years old year") 
        console.log(t("我叫{name},今年{age}岁",{name:"tom",age:12}))//("My name is tom,Now 12 years old year") 
        console.log(t("现在是{|date}",Date.now()))

    await i18nScope.change("jp")
        console.log(`-------------${i18nScope.activeLanguage}-----------------`)
        console.log(t("中国"))//("china")
        console.log(t("我有{}部车",[100]))//("我有100部车")
        console.log(t("我有{}部车",0))//("I don't have car")
        console.log(t("我有{}部车",1))//("I have a car")
        console.log(t("我有{}部车",2))//("I have two cars")
        console.log(t("我有{}部车",3))//("I have 3 cars")
        console.log(t("我有{}部车",100))//("I have 100 cars")
        console.log(t("你好"))//("hello")
        console.log(t("我叫{name},今年{age}岁","tom",12))//("My name is tom,Now 12 years old year") 
        console.log(t("我叫{name},今年{age}岁",["tom",12]))//("My name is tom,Now 12 years old year") 
        console.log(t("我叫{name},今年{age}岁",{name:"tom",age:12}))//("My name is tom,Now 12 years old year") 
        console.log(t("现在是{|date}",Date.now()))
}


main().then(()=>{
    console.log("done")
}).catch((err)=>{
    console.error(err)
})
