# Get started <!-- {docsify-ignore-all} -->


This section provides an overview `VoerkaI18n` of the basic use of the internationalization framework, using standard `Nodejs` applications as examples.

 `vue` Or `react` the use process of the application is also basically the same, you can refer to [use Vue](../integration/vue) and [use React](../integration/react).

```shell
myapp
  |--package.json
  |--index.js  
```

In all the supported source code files of this project, functions can be used `t` to wrap the text to be translated, which is simple and crude.

```javascript 
// index.js
console.log(t("xxxxxxx"))
console.log(t("xxxxxxx{}",1949))
```

The `t` translation function is a translation function exported from `myapp/languages/index.js` the file, but `myapp/languages` it does not exist yet, and it will be automatically generated by the tool later. `voerkai18n` The follow-up session uses regular expression pairs to extract the text to be translated.

## Step 1: Install the command line tool
Install `@voerkai18n/cli` to global.
```shell
> npm install -g @voerkai18n/cli
> yarn global add @voerkai18n/cli
> pnpm add -g @voerkai18/cli
```

## Step 2: Initialize the project

Run `voerkai18n init` the command in the project directory for initialization.

```javascript 
> voerkai18n init 
```

The above command creates `languages/settings.json` a file in the current project directory. If your source code is in a `src` subfolder, `src/languages/settings.json` the

 `settings.json` The contents are as follows:

```json
{
    "languages": [
        {
            "name": "zh",
            "title": "zh",
            "default":true
        },
        {
            "name": "en",
            "title": "en"
        }
    ],
    "namespaces": {}
}
```

The above commands represent:

- This project is intended to support `zh` and `en` two languages.
- The default language is `zh` (that is, use Chinese directly in the source code)
- The active language is `zh` (represents the language currently in effect)

** Notice **

- You can modify this file to configure supported languages, default languages, active languages, and so on. The supported languages can be found in [language code](../../reference/lang-code).
-  `voerkai18n init` Is optional and `voerkai18n extract` can also achieve the same functionality.
- In general, you can modify `settings.json` it manually, such as defining namespaces.
-  `voerkai18n init` Just create `languages` the file, and generate it `settings.json`, so you can do it yourself.
- For `js/typescript` different applications such as or `react/vue`, `voerkai18n init` the generated `ts` file or `js` file can be configured by different parameters.
- For more `voerkai18n init` information on how to use the command, see [here](../tools/cli.md)

##  Step 3: Identify the translation content

Next, in the source code file, use `t` the translation function to package all the contents to be translated, as shown in the following example:
```javascript 
import { t } from "./languages"
// Without interpolation variables
t("My name is tom")
// Position interpolation variable
t("My name is {}","tom")
t("My name is {}，{} years old this year","tom",12)
```
A `t` translation function is just a normal function that you need to provide an execution environment for. `t` See [here](../use/t.md) for more about the use of translation functions.

##  Step 4: Extract Text

Next, we use `voerkai18n extract` the command to automatically scan the project source code file for the text information that needs to be translated. `voerkai18n extract` The command uses a regular expression to extract `t("xxxxxx")` the text of the wrapper.

```shell
myapp>voerkai18n extract
```

After the command is executed `voerkai18n extract`, relevant files such as, `settings.json`, and so on will be `myapp/languages` generated `translates/default.json`.

- ** translates/default.json ** ：
    This file is the text information extracted from the current engineering scan that needs to be translated. All text content that needs to be translated is collected in this file.
- ** settings.json **: Basic configuration information of the locale, including supported language, default language, active language, etc.

The structure of the final document is as follows:

```shell
myapp
  |-- languages
    |-- settings.json                // Language Profile
    |-- translates                   // Include all content that needs to be translated
      |-- default.json               // default namespace
  |-- package.json
  |-- index.js

```

** If you skip the `voerkai18n init` in the first step, you can also use the following commands to create and update `settings.json` ** th

```javascript 
myapp>voerkai18n extract -D -lngs zh en de jp -d zh -a zh
```

** The above commands represent: **

- Scan all source code files in the current folder. The default file type is `js`, `jsx`, `html`, `vue`.
- Four languages, `en`, `de`, `jp` are supported `zh`
- The default language is Chinese. (It means that we can use Chinese directly in the source code file)
- The active language is Chinese (i.e., switch to Chinese by default)
-  `-D` Represents the display of scan debugging information, which can show which text is provided from which files

## Step 5: Human Translation

Next, you can translate all `JSON` the files under the folder separately `language/translates`. Each `JSON` file is roughly as follows:

```json
{
    "My name is {}":{
        "en":"<English translation content>",
        "de":"<German translation content>",
        "jp":"<Japanese translation content>",
        "$files":["index.js"]    // Recorded which files the information was extracted from
    },
	"My name is {}，{} years old this year":{
        "en":"<English translation content>",
        "de":"<German translation content>",
        "jp":"<Japanese translation content>",
        "$files":["index.js"]
    }
}
```

We only need to modify the language corresponding to the translation of the file.

** Important: If the source file is modified during translation, you only need to re-execute the `voerkai18n extract` command, which does the following: **

- If the text content has been removed from the source code, it is automatically removed from the translation list.
- If the text content has been modified in the source code, it is treated as a new addition.
- If the text content has been partially translated, the translated content is retained.

** In a word, it is safe to execute `voerkai18n extract` the command repeatedly, which will not lead to the loss of half of the translated content, and it can be safely executed. **

## Step 6: Automatic translation

 `voerkai18n` Support automatic translation through `voerkai18n translate` commands ** Invoke online translation services **.

```javascript 
>voerkai18n translate --appkey <appkey> --appid <appid>
```

Executing the above statement in the project folder will automatically invoke `Baidu's online translation API` the translation, and with the current level of translation, you only need to make a few tweaks. Please refer to the subsequent introduction for `voerkai18n translate` the use of the command.

## Step 7: Compile the language pack

After we have completed `myapp/languages/translates` all `JSON file` the translations (if the namespace is configured, each namespace will generate a corresponding file, see the following `namespace` introduction for details), we need to compile the translated files.

```shell
myapp> voerkai18n compile
```

 `compile` The command generates the following files based on `myapp/languages/translates/*.json` the and `myapp/languages/settings.json` file compilations:

```javascript 
  |-- languages
    |-- settings.json                 
    |-- idMap.js                     
    |-- index.js                      
    |-- storage.js
    |-- zh.js                        
    |-- en.js
    |-- jp.js
    |-- de.js
    |-- formatters                   // custom formatter
        |-- zh.js                     
        |-- en.js
        |-- jp.js
        |-- de.js
    |-- translates                   // 
      |-- default.json
  |-- package.json
  |-- index.js

```

## Step 8: Import the translation function

In the first step, we directly use the `t` translation function to wrap the text information to be translated in the source file. The `t` translation function is automatically generated and declared in `myapp/languages/index.js` the compilation phase.

```javascript 
import { t } from "./languages"   
```

Therefore, we need to import the function when we need to translate it.

However, if there are many source code files, it is more troublesome to import `t` functions repeatedly, so we also provide a `babel/vite` plug-in to automatically import `t` functions, which can be selected according to the usage scenario.

## Step 9: Switch languages

When you need to switch languages, you can switch languages by calling `change` a method.

```javascript 
import { i18nScope } from "./languages"

// change to english
await i18nScope.change("en")
// or
await VoerkaI18n.change("en")
```

Is equivalent `i18nScope.change` to `VoerkaI18n.change` both.

In general, you may also need to update the rendering of the interface after the language switch, and you can subscribe to events to respond to the language switch.

```javascript 
import { i18nScope } from "./languages"

// change to english
i18nScope.on("change",(newLanguage)=>{
    // Re render the interface here
 
    ...

})
// 
VoerkaI18n.on("change",(newLanguage)=>{
     // Re render the interface here
     ...
})
```
[ @voerkai18n/vue ](../integration/vue) And [ @voerkai18n/react ](../integration/react.md) provide corresponding plug-ins and libraries to simplify the rendering of reinterface updates.

## Step 10: Language Pack Patch

In general, the process of multilingual engineering is over, and `voerkai18n` multilingual practice is considered more humanized. Have you often found such a situation, when the project is on line, only to find:
- The translation is wrong
- The client has a personal preference for certain terms and asks you to change them.
- Temporarily add support for a language

Encounter this kind of circumstance commonly, be forced to repack build a project, reissue, whole process trival and troublesome. There is now `voerkai18n` a perfect solution to this problem, which can be applied `Apply language pack patches` and `Dynamically adding language` supported by the server without repackaging the application and modifying the application.

** The method is as follows: **

1. Registers a default language pack loader function for loading language pack files from the server.
```javascript 
import { i18nScope } from "./languages"

i18nScope.registerDefaultLoader(async (language,scope)=>{
    return await (await fetch(`/languages/${scope.id}/${language}.json`)).json()
})
```

2. Save the language pack patch file to the designated location `/languages/<appName>/<language>.json` on the Web server.
3. When the application is started, it will automatically load the language patch package from the server to merge, so as to realize the function of automatically patching the language package.
4. This feature can also be used to dynamically add temporary support for a language.

See [ `Dynamically adding language`] (./advanced/dynamic-add) and [`Apply language pack patches`] (./advanced/lang-patch) for a more complete description.


 