/**
 * 目前还缺少重要的一个环节，就是我们的错误捕获还没有处理
 * 1.捕获执行器错误：如果执行器中有代码错误，那么 Promise 的状态要变为失败
 * 2.捕获then执行错误：
 */

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    constructor (executor) {
        try {
            executor(this.resolve, this.reject);
        } catch (error) {
            this.reject(error);
        }
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

            // 执行
            while (this.onFulfilledCallbacks.length) {
                this.onFulfilledCallbacks.shift()(value);
            }
        }
    }

    reject = (reason) => {
        if (this.status === PENDING) {
            this.status = REJECTED;
            this.reason = reason;
            while (this.onRejectedCallbacks.length) {
                this.onRejectedCallbacks.shift()(reason);
            }
        }
    }

    then (onFulfilled, onRejected) {

        // ===== 新增 =====
        const promise2 = new MyPromise((resolve, reject) => {
            if (this.status === FULFILLED) {

            // ===== 新增 =====
            // 创建一个微任务等待promise2完成初始化
            queueMicrotask(() => {
                try {
                    const result = onFulfilled(this.value);

                    // 传入resolvePromise集中处理
                    resolvePromise(promise2, result, resolve, reject);
                } catch (error) {
                    reject(error);
                }
            });
            } else if (this.status === REJECTED) {
                onRejected(this.reason);
            } else if (this.status === PENDING) {
                this.onFulfilledCallbacks.push(onFulfilled);
                this.onRejectedCallbacks.push(onRejected);
            }
        });

        return promise2;
    }
}

function resolvePromise (promise2, result, resolve, reject) {

    if (promise2 === result) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
    }

    // 如果是返回一个MyPromise实例，则去执行它的then
    // 因为要去获取这个实例的return值再继续传给下一个then
    // 否则直接resolve
    if (result instanceof MyPromise) {

        // 直接用class里面的resolve和reject函数即可
        result.then(resolve, reject);
    } else {
        resolve(result);
    }
}

module.exports = MyPromise;