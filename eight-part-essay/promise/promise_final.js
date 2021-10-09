/**
 * MyPromise.resolve/reject需要返回一个Promise对象
 * 这样使用，到第8步的代码是会报错的，提示MyPromise.resolve不是函数，
 * 即需要增加resolve和reject的静态方法，class中，静态方法可以和原型方法重名
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

    static resolve (value) {

        // 如果是MyPromise实例，则直接返回
        if (value instanceof MyPromise) {
            return value;
        }

        // 否则new一个实例来返回
        return new MyPromise(resolve => {
            resolve(value);
        });
    }

    static reject (reason) {
        return new MyPromise((resolve, reject) => {
            reject(reason);
        });
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
                this.onFulfilledCallbacks.shift()();
            }
        }
    }

    reject = (reason) => {
        if (this.status === PENDING) {
            this.status = REJECTED;
            this.reason = reason;
            while (this.onRejectedCallbacks.length) {
                this.onRejectedCallbacks.shift()();
            }
        }
    }

    then (onFulfilled, onRejected) {
        const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        const realOnRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason};

        // ===== 新增 =====
        const promise2 = new MyPromise((resolve, reject) => {
            const fulfilledMicrotask = () => {
                // 创建一个微任务等待promise2完成初始化
                queueMicrotask(() => {
                    try {
                        const result = realOnFulfilled(this.value);

                        // 传入resolvePromise集中处理
                        resolvePromise(promise2, result, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            };
            const rejectedMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const result = realOnRejected(this.reason);

                        // 传入 resolvePromise 集中处理
                        resolvePromise(promise2, result, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            };
            if (this.status === FULFILLED) {
                fulfilledMicrotask();
            } else if (this.status === REJECTED) {
                rejectedMicrotask();
            } else if (this.status === PENDING) {
                this.onFulfilledCallbacks.push(fulfilledMicrotask);
                this.onRejectedCallbacks.push(rejectedMicrotask);
            }
        });

        return promise2;
    }
}

function resolvePromise (promise, result, resolve, reject) {

    if (promise === result) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
    }

    let resultType = typeof result;

    // 返回的是普通值
    if (!['object', 'function'].includes(resultType)) {
        return resolve(result);
    }

    let then;
    try {
        then = result.then;
    } catch (error) {
        return reject(error);
    }

    if (typeof then !== 'function') {
        return resolve(result);
    }

    // 返回的是promise实例
    let called = false;
    try {
        then.call(
            result,  // this指向返回的promise实例
            value => {
                if (called) return;
                called = true;
                resolvePromise(promise, value, resolve, reject);
            },
            reason => {
                if (called) return;
                called = true;
                reject(reason);
            }
        );
    } catch (error) {
        if (called) return;
        reject(error);
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

MyPromise.deferred = function(){
    let dfd = {};
    dfd.promise = new MyPromise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}

module.exports = MyPromise;