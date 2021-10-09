const MyPromise  = require('./1.核心逻辑实现');

const promise = new MyPromise((resolve, reject) => {
    resolve('success')
    reject('err')
})
 
promise.then(value => {
    console.log('resolve', value)
}, reason => {
    console.log('reject', reason)
})

// 期望结果：resolve success
// 实际结果：resolve success