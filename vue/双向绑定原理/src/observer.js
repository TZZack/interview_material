/**
 * 监听器和订阅器
 */

const Dep = require('./dep');

// 监听器
function Observer (data) {
    this.data = data;
    this.walk(data);
}
Observer.prototype = {

    // 遍历对象的属性，逐个去劫持，即Object.defineProperty
    walk (data) {
        var self = this;
        Object.keys(data).forEach(key => {
            self.defineReactive(data, key, data[key]);
        });
    },
    defineReactive (data, key, val) {
        let dep = new Dep();
        // observe(val);    还需要处理属性值为对象的情况
        Object.defineProperty(data, key, {
            enumerable: true,   // 属性可枚举
            configurable: true, // 属性可删改
            get () {
                if (Dep.target) {
                    dep.addSub(Dep.target);
                }
                return val;
            },
            set (newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                dep.notify();   // 发生变更后，通知订阅者
            }
        });
    }
}

// 抛一个监听函数出去
function observe (value) {
    if (!value || typeof value !== 'object') {
        return;
    }

    // 返回一个监听器实例
    return new Observer(value);
}

module.exports = {
    observe
};