# promise

## promise

> * 有三个状态：`pending`、`fulfilled`、`rejected`，状态只能是从`pending->fulfilled`或`pending->rejected`，状态一但改变则不能再变
> * promise可以链式调用，`.then`或`.catch`都会返回一个新的promise，从而实现链式调用

## 手写promise

> 使用queueMicrotask实现创建微任务

详情看promise文件夹



参考文章：[从一道让我失眠的 Promise 面试题开始，深入分析 Promise 实现细节](https://juejin.cn/post/6945319439772434469#heading-5)