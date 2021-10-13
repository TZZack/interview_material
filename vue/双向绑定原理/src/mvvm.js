const Compile = require('./compile');
const {observe} = require('./observer');

function MVVM (options) {
    let me = this;
    this.data = options.data;
    this.methods = options.methods;

    // 这里还需要做个数据劫持，因为observer实际上没有去更新data对象的值
    // 这里要做的就是去更新data对象的值
    // observer监听器只是监听，然后告诉订阅器，它其实不做对data的修改
    Object.keys(this.data).forEach(key => {
        me.proxyKeys(key);
    });

    // 先遍历data对象，每个属性创建一个监听器，以及一个订阅器
    observe(this.data);

    // 解析指令，初始化页面，并初始化订阅者
    new Compile(options.el, this);
}

MVVM.prototype = {
    proxyKeys (key) {
        let me = this;
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function getter () {
                return me.data[key];
            },
            set: function setter (newVal) {
                me.data[key] = newVal;
            }
        });
    }
};

module.exports = MVVM;