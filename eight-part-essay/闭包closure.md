# 闭包

## 概念/定义

> * `JS忍者秘籍`(P90)中对闭包的定义：闭包允许函数访问并操作函数外部的变量。
> * `红宝书`上对于闭包的定义：闭包是指有权访问另外一个函数作用域中的变量的函数。
> * `MDN`对闭包的定义为：闭包是指那些能够访问自由变量的函数。这里的自由变量是外部函数作用域中的变量。

> 概述上面的话，**闭包是指有权访问另一个函数作用域中变量的函数**

## 闭包的作用

* 保护函数的私有变量不受外部的干扰。形成不销毁的栈内存
* 把一些函数内的值保存下来。闭包可以实现方法和属性的私有化

## 经典场景

> * 函数返回函数：节流防抖
> * 函数作为参数

## 缺点

* 容易造成内存泄露：闭包会携带包含其它的函数作用于，因此会比其它函数占用更多的内存。
* 如何分析内存泄露：参考文章[js 内存泄漏场景、如何监控以及分析](https://juejin.cn/post/6844904048961781774#comment)