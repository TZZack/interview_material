/**
 * 期望结果：
 * success
 * error
 */

const MyPromise = require('./8.then中的参数变为可选');

const promise1 = new MyPromise((resolve, reject) => {
    resolve('success');
})
promise1
.then()
.then()
.then(value => console.log(value));

const promise2 = new MyPromise((resolve, reject) => {
    reject('error');
})
promise2
.then()
.then()
.then(value => console.log(value), reason => console.log(reason));