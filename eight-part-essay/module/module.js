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
Module.wrapper = ['(function(exports, requireZZZ, module){', '\r\n})'];
// 解析文件名，没写拓展名，就添加默认的拓展名
Module._resolveFilename = function (filePath) {
    filePath = path.join(__dirname, filePath);	// 转成绝对路径
    // 如果没有拓展名，则每个支持的拓展名都去尝试下
    if (!/\.\w+$/.test(filePath)) {
        for (let i = 0; i < Module._extensions.length; i++) {
            let fullPath = filePath + Module._extensions[i];
            try {
                fs.accessSync(fullPath);
                return fullPath;
            } catch (error) {
                throw new Error('module not found');
            }
        }
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
    // 2.形成闭包（字符串）
    let scriptStr = Module.wrapper[0] + content + Module.wrapper[1];
    // 3.创建沙箱环境，运行并范围结果（按前面的拼接，这里返回的是一个闭包函数）
    let fn = vm.runInThisContext(scriptStr);	// 在当前全局作用域下执行，与eval的区别是eval的作用域会在当前模块
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

let str = requireZZZ('./test');
console.log(str);