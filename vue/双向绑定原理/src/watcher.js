const Dep = require('./dep');

/**
 * 
 * @param {Object} vm vue实例
 * @param {*} exp v-model绑定的属性或插值的属性
 * @param {*} cb 订阅者绑定的更新函数
 */
function Watcher (vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;

    // 将自己添加到订阅器的操作
    this.value = this.get();
}

Watcher.prototype = {

    // 更新函数
    update () {
        this.run();
    },

    run () {
        let value = this.vm.data[this.exp];
        let oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    },

    get () {
        // 缓存自己
        Dep.target = this;

        // 强制执行监听器里的get函数，这样就会把当前这个订阅者加入到订阅器中
        let value = this.vm.data[this.exp];

        // 释放自己
        Dep.target = null;

        return value;
    }
}

module.exports = Watcher;