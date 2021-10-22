# 模块化理解

## 概念

> __Web工程化__：
>
> * 工程化目的是`高性能`、`稳定性`、`可用性`、`可维护性`、`高效协同`，以这几个角度为目标所做的事情，都可称为工程化的一部分
> * 当下的前端工程化可分为四个方面：`模块化`、`组件化`、`规范化`、`自动化`
>
> __什么是模块化__：
>
> * 指解决一个复杂问题时`自顶向下逐层把系统划分成若干模块`的过程，每个模块负责完成一个特定的`子功能`（单一职能），所有模块按某种规则组装起来，形成一个能够完成系统所有功能的整体
>
> __为什么需要模块化__：
>
> * 随着Web技术的发展，网页展示变得越来越`丰富`，前端`代码量`、`复杂度`也急剧上升，各种`全局变量污染`、`命名冲突`、`代码冗余`、`文件间依赖变大`、`难维护`等一系列问题显现，因此前端加入模块化以解决这些问题



## 早期JS模块化方案

* `普通函数`：无法保证不与其它模块发生命名冲突、模块成员之间看不出有引用关系（不能很直接看出函数a里面使用了函数b）
* `命名空间模式`：即使用对象作为模块，一个对象为一个模块，问题是对象内部的属性会暴露出去且内部状态能够被外部随意篡改
* `立即执行函数（IIFE）`：

> 1. 利用闭包的特性来实现私有数据和共享方法，如下:
>
> ```javascript
> var myModule = (function () {
> 	var name = 'zzz';
>     function getName () {
>         console.log(name);
>     }
>     return {
>         getName
>     }
> })();
> 
> // 这样外部就无法直接访问和修改name属性
> ```
>
> 2. 如果这个模块依赖其它模块（引入依赖），很明显，这里使用函数传参，如：
>
> `这种方式是现代模块化规范的思想来源`
>
> ```javascript
> var otherModule = (function () {
>     return {
>         name: 'hyx',
>         age: 26
>     }
> })();
> var myModule = (function (other) {
> 	var name = 'zzz';
>     function getName () {
>         console.log(name);
>         console.log(other.name);
>     }
>     return {
>         getName
>     }
> })(otherModule);
> ```
* `依赖注入`：结合`IIFE`方法

> 1. 需要一个`依赖注入器`，帮我们解决一下问题：
>
> * 可以实现依赖的注册
> * 接收依赖（函数等），注入成功后返回一个可以获取所有资源的函数
> * 能够保持传递函数的作用域
> * 传递的函数能否接收自定义的参数，而不仅仅是被描述的依赖项
>
> 简单实现一个`依赖注册器`，代码如下
>
> ```javascript
> var injector = {
>     dependencies: {},	// 保存注入的依赖
>     register: function (key, value) {	// 注册依赖
>         this.dependencies[key] = value;
>     },
>     resolve: function (depList, func, scope) {	// 注入依赖
>         var args = [];
>         for (var i = 0; i < depList.length; i++) {
>             let depKey = depList[i];
>             if (this.dependencies[depKey]) {
>                 args.push(this.dependencies[depKey]);
>             } else {
>                 throw new Error('不存在依赖：' + depKey);
>             }
>         }
>         return function () {
>             func.apply(scope || {}, args.concat(Array.from(arguments)));
>         }
>     }
> }
> 
> // 使用
> var moduleA = (function () {
>     return {
>         name: 'a',
>         age: 26
>     }
> })();
> var moduleB = (function () {
>     return {
>         name: 'b',
>         age: 26
>     }
> })();
> injector.register('moduleA', moduleA);
> injector.register('moduleB', moduleB);
> 
> (injector.resolve(['moduleA', 'moduleB'], function (moduleA, moduleB, str) {
>     console.log('moduleA.name', moduleA.name);
>     console.log('moduleB.name', moduleB.name);
>     console.log('myModule', str);
> }))('myModule');
> ```



## 模块化规范


### 1. CommonJS规范

#### 1.1 简介

> 1. JS 标准定义的 API 只是为了构建基于浏览器的应用程序，并没有制定一个用于更广泛的应用程序的标准库。
> 2. 而`CommonJS`规范的提出主要是为了弥补JS没有标准的缺陷，它由社区提出，终极目标就是提供一个类似`Python`或`Ruby`或`Java`语言的标准库，而不只是停留在脚本程序的阶段
> 3. 用`CommonJS`的`API`编写出的应用不仅可利用JS来开发客户端应用，还可编写服务端JS应用程序、命令行工具、桌面图形界面应用程序等等
> 4. `node.js`就是以`CommonJS`规范为基础创造的，将JS语言用于服务端编程，`node.js`成为`CommonJS`的代名词
> 5. `CommonJS`规范中规定每个文件就是一个独立的模块，模块有自己的作用域，且变量、函数、类都是私有的，外部想要调用，必须使用`module.exports`主动暴露后，在调用的地方`require(path)`进去
> 6. 同步加载模块，所以不适用于浏览器端，浏览器的加载是异步的，强行同步体验很差，一次性加载完或者按需加载都不好
>
> 
>
> 注意：
>
> __在服务端，模块的加载是运行时同步加载的；在浏览器端，模块需要提前编译打包处理__

#### 1.2 特点

> * 所有代码都运行在模块作用域，不会污染全局作用域
> * 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就会被缓存（想拿最新结果，需要清缓存）
> * 模块加载的顺序，按照在代码中出现的顺序

#### 1.3 简单实现

> 原理：
>
> 1. 每个模块内部，都有一个`module`实例，该对象就会有下面几个属性：
>
> * `module.id`模块的识别符，通常是带有绝对路径的模块文件名
> * `module.filename`模块的文件名，带有绝对路径
> * `module.loaded`返回一个布尔值，表示模块是否已经完成加载
> * `module.parent`返回一个对象，表示调用该模块的模块
> * `module.children`返回一个数组，表示该模块要用到的其他模块
> * `module.exports`表示模块对外输出的值

```javascript
let path = require('path');
let fs= require('fs');
let vm = require('vm');

let id = 0;

// 构造函数Module
function Module (filename) {
    this.id = id++;
    this.filename = filename;	// 这个filename是完整的
    this.exports = {};	// 模块导出的结果
}

Module._extensions = ['.js'];
Module._loadFn = {};
Module._cache = {};
// 将文件拼凑成闭包，这样就能实现模块作用域，不污染全局作用域
Module.wrapper = ['(function(){', '\r\n})'];
// 解析文件名，没写拓展名，就添加默认的拓展名
Module._resolveFilename = function (filePath) {
    filePath = path.join(__dirname, filePath);	// 转成绝对路径
    if (!/\.\w+$/.test('filePath')) {	// 如果没有拓展名，则每个支持的拓展名都去尝试下
        Module._extensions.forEach(ext => {
            let fullPath = filePath + ext;
            try {
                fs.accessSync(fullPath);
                return fullPath;
            } catch (error) {
                throw new Error('module not found');
            }
        });
    } else {
        return filePath;
    }
}

// 模块加载
Module.prototype.load = function () {
    let extName = path.extname(this.filename);
    Module._loadFn[extName](this);
}

// 对应的拓展文件的加载方法
Module._loadFn['.js'] = function (module) {
    // 1.加载文件
    let content = fs.readFileSync(module.filename, 'utf8');
    // 2.形成闭包
    let script = Module.wrapper[0] + content + Module.wrapper[1];
    // 3.创建沙箱环境，运行并范围结果
    let fn = vm.runInThisContext(script);	// 在当前全局作用域下执行，与eval的区别是eval的作用域会在当前模块
    // 4.执行闭包函数，模块内部给module.exports赋值绑定
    fn.call(module, module.exports, requireZZZ, module)
}

// 声明一个全局的加载模块的函数
function requireZZZ (path) {
    // 1.获取绝对路径
    let filename = Module._resolveFilename(path);
    // 2.看看是否有缓存
    if (Module._cache[filename]) {
        return Module._cache[filename];
    }
    // 创建一个module实例
    let module = new Module(filename);
	module.load();
    // 如缓存
    Module._cache[filename] = module;
    // 返回module.exports的内容
    return module.exports;
}
```



### 2. AMD规范

#### 2.1 简介

> 1. `AMD`（异步模块定义）是专门为浏览器环境设计的，定义了一套异步加载标准来解决同步的问题
> 2. 使用`requireJS`，一个准守AMD规范的工具库，用于客户端的模块管理
> 3. 用法
>
> ```javascript
> // 定义模块/依赖，该模块依赖JS模块
> define('myModule', ['jquery'], function ($) {
>     $('body').test('body content')
> });
> 
> // 引入模块/依赖
> require(['myModule'], function (myModule) {
>     // ...
> })
> ```
>
> 

### 3. CMD规范

#### 3.1 简介

> 1. `CMD`的出现较为晚一些，汲取了`CommonJS`和`AMD`规范的有点，也是专门用于浏览器的异步模块加载
> 2. 一个模块就是一个文件，`define`是一个全局函数，用来定义模块
> 3. `CMD`是SeaJS在推广过程中对模块定义的规范化产出
> 4. 而`CMD`规范以及`SeaJS`在国内曾经十分被推崇，原因不只是因为它足够简单方便，更是因为`SeaJS`的作者是阿里的`玉伯`大佬，同`Vue`一样的国人作者，堪称国人之光

### 4. UMD规范

#### 4.1 简介

> 1. `UMD`(Universal Module Definition)，通用模块定义，从名字上看就知道是做大一统的
> 2. 随着`大前端`的趋势所诞生，可以通过运行时或者编译时让同一个代码模块在使用`CommonJs`、`CMD`、甚至是`AMD`的项目中运行，也就是同一个javascript包运行在浏览器端、服务区端甚至是APP端都只需要遵守同一个写法就行了

```javascript
((root, factory) => {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory();
  } else if (typeof define === 'function' && define.cmd){
		// CMD
    define(function(require, exports, module) {
      module.exports = factory()
    })
  } else {
    // 都不是
    root.umdModule = factory();
  }
})(this, () => {
  console.log('我是UMD')
  // todo...
});
```

解析：其实就是在定义模块的时候检测当前使用环境和模块的定义方式，如果匹配就想用匹配到的规范，都不匹配就挂在到全部对象上

### 5. ES Module规范

#### 5.1 简介

> 1. 2015年6月，`ECMAScript2015`即`ES6`发布，JS终于在语言标准的层面上，实现了模块功能，在编译时就能确定模块的依赖关系，以及其输入和输出的变量，不像`CommonJS`、`AMD`之类的需要在运行时才能确定，成为浏览器和服务器通用的模块解决方案
> 2. 所以在`ES6`之前JS没有官方的模块机制
> 3. `ESModule`实现相当简单，模块化功能主要由`exports`和`import`两个命令构成
> 4. 还提供了`exports default`，为模块指定默认输出，对应的import就不需要大括号`{}`，这也更接近AMD的引用写法
> 5. 与`CommonJS`的运行机制不一样，js引擎对脚本静态分析的时候，遇到模块加载指令会生成一个只读引用，等到脚本真正执行时，才能通过引用模块获取值，在引用到执行的过程中，模块中的值发生变化，导入的也会发生变化，所以`ESModule`也称为`动态引入`，并不会缓存值
> 6. 在`vite`上的使用足以证明这个模块化是最好的选择，也是未来的趋势

#### 5.2 与CommonJS的区别

> * `CommonJS`是运行时加载，`ES6`是编译时输出接口
>   * 运行时加载：`CommonJS`模块就是对象，即在输入时就先加载整个模块，生成一个对象，然后再从这个对象上面读取方法、属性，这个加载成为`运行时加载`
>   * 编译时加载：`ES`模块不是对象，而是通过export命令显式指定输出的代码，import时采用`静态命令`的形式，即在import时可以指定加载某个输出值，而不是加载整个模块，这种加载称为`编译时加载`
> * CommonJS加载的是一个对象，即module.exports属性，该对象只有在脚本运行完才会生成
> * 而ES6模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成

## 总结

* `CommonJS`规范主要用于服务端编程，加载模块是同步的，这并不适合在浏览器环境，因为同步意味着阻塞加载，浏览器资源是异步加载的，因此有了AMD、CMD解决方案

* `AMD`规范在浏览器环境中异步加载模块，而且可以并行加载多个模块。不过，AMD规范开发成本高，代码的阅读和书写比较困难，模块定义方式的语义不顺畅

* `CMD`规范与AMD规范很相似，都用于浏览器编程，依赖就近，延迟执行，可以很容易在Node.js中运行。不过，依赖SPM 打包，模块的加载逻辑偏重

* `ES6`在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案



## 模块兼容处理

开发插件时可能需要对各种模块做支持

```javascript
const appJsBridge = function(){};
if ("function" === typeof define) {
    // AMD CMD
    define(function() {
        return appJsBridge;
    })
} else if ("undefined" != typeof exports) {
    // commonjs
    module.exports = appJsBridge;
} else {
    // 没有模块化
    window.appJsBridge = appJsBridge;
}
```





参考文章：

[「前端工程四部曲」模块化的前世今生（上）](https://juejin.cn/post/7007946894605287432#heading-1)

[前端模块化详解(完整版)](https://juejin.cn/post/6844903744518389768#heading-47)