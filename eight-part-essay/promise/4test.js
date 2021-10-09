/**
 * 验证
 * 期望结果：
 */
const MyPromise = require('./4.实现then方法的链式调用');
const promise = new MyPromise((resolve, reject) => {
    // 目前这里只处理同步的问题
    resolve('success');
});

function other () {
    return new MyPromise((resolve, reject) =>{
        resolve('other')
    });
}

promise.then(value => {
    console.log(1);
    console.log('resolve', value);
    return other();
}).then(value => {
    console.log(2);
    console.log('resolve', value);
})