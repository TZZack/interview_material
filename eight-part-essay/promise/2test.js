/**
 * 验证
 * 期望结果：resolve success
 * 实际结果：resolve success
 */
const MyPromise = require('./2.加入异步逻辑');

const promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('success')
    }, 2000); 
})
  
promise.then(value => {
    console.log('resolve', value)
}, reason => {
    console.log('reject', reason)
})