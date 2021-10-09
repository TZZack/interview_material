/**
 * 期望结果1：
 * 2
 * 执行器错误
 * 
 * 期望结果2：
 * 1
 * resolve success
 * 4
 * then error
 */

const MyPromise = require('./6.捕获错误及then链式调用其它状态代码补充')
const promise1 = new MyPromise((resolve, reject) => {
    // resolve('success')
    throw new Error('执行器错误')
})
 
promise1.then(value => {
  console.log(1)
  console.log('resolve', value)
}, reason => {
  console.log(2)
  console.log(reason.message)
})


const promise2 = new MyPromise((resolve, reject) => {
    resolve('success')
    // throw new Error('执行器错误')
 })
 
// 第一个then方法中的错误要在第二个then方法中捕获到
promise2.then(value => {
  console.log(1)
  console.log('resolve', value)
  throw new Error('then error')
}, reason => {
  console.log(2)
  console.log(reason.message)
}).then(value => {
  console.log(3)
  console.log(value);
}, reason => {
  console.log(4)
  console.log(reason.message)
})