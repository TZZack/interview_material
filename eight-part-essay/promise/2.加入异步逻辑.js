/**
 * 核心逻辑：
 * 1. new时执行传进来的函数
 * 2. 有三种状态
 * 3. 状态只能由pending改为另外两个
 * 4. 使用resolve、reject两个函数来更改状态
 * 5. then方法有两个参数，一个是resolve后执行的回调，第二个是reject后执行的回调
 */

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    constructor (executor) {
        executor(this.resolve, this.reject);
    }

    // 初始状态
    status = PENDING;

    // 成功之后的值
    value = null;

    // 失败后的原因
    reason = null;

    // 缓存回调函数
    onFulfilledCallback = null;
    onRejectedCallback = null;

    // resolve和reject使用箭头函数，让this指向实例对象
    // 否则使用普通函数，this就默认指向window或undefined，调用时还需要重新指向this
    // (class的this都指向实例)
    resolve = (value) => {
        if (this.status === PENDING) {
            // 状态修改为成功
            this.status = FULFILLED;
            // 保存成功的值
            this.value = value;

            // =====新增=====
            this.onFulfilledCallback && this.onFulfilledCallback(value);
        }
    }

    reject = (reason) => {
        if (this.status === PENDING) {
            this.status = REJECTED;
            this.reason = reason;

            // =====新增=====
            this.onRejectedCallback && this.onRejectedCallback(reason);
        }
    }

    // TODO 简单实现
    then (onFulfilled, onRejected) {
        if (this.status === FULFILLED) {
            onFulfilled(this.value);
        } else if (this.status === REJECTED) {
            onRejected(this.reason);
        } else if (this.status === PENDING) {

            // =====新增=====
            // 状态暂时还没发生变化，先将回调缓存起来，等状态变化后再执行
            this.onFulfilledCallback = onFulfilled;
            this.onRejectedCallback = onRejected;
        }
    }
}

module.exports = MyPromise;