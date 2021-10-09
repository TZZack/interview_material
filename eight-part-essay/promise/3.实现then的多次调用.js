/**
 * Promise 的 then 方法是可以被多次调用的。
 * 这里如果有三个 then 的调用，如果是同步回调，那么直接返回当前的值就行；
 * 如果是异步回调，那么保存的成功失败的回调，需要用不同的值保存，因为都互不相同。之前的代码需要改进。
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
    onFulfilledCallbacks = [];
    onRejectedCallbacks = [];

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
            while (this.onFulfilledCallbacks.length) {
                this.onFulfilledCallbacks.shift()(value);
            }
        }
    }

    reject = (reason) => {
        if (this.status === PENDING) {
            this.status = REJECTED;
            this.reason = reason;

            // =====新增=====
            while (this.onRejectedCallbacks.length) {
                this.onRejectedCallbacks.shift()(reason);
            }
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
            this.onFulfilledCallbacks.push(onFulfilled);
            this.onRejectedCallbacks.push(onRejected);
        }
    }
}
 
module.exports = MyPromise;