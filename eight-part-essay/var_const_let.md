# var/const/let对比

## var

> 变量提升：提升到当前作用域顶部
>
> 注意：用var，有一种行为会把变量挂载到window对象下，使用不慎会覆盖掉window下原来的值，例如：
>
> ```javascript
> let value2 = "李四"
> const value3 = "王五"
> console.log(window.value1) // 张三
> console.log(window.value2) // undefined
> console.log(window.value3) // undefined
> ```

## let

> 块级作用域变量声明，没有变量提升，es6新增

## const

> 常量声明，注意：
>
> 1. 不能修改（但如果常量是个引用类型，则可以修改值，因为常量的值为该对象的引用地址，一般编码中不要修改值，容易出错）
> 2. 没有变量提升（可以看看`暂时死区`的概念，TDZ）



## 一个经典的问题

> __for循环中用let声明的迭代变量每次都是新的变量__
>
> ```javascript
> // var
> var a = [];
> for (var i = 0; i < 10; i++) {
>     a[i] = function () {
>         console.log(i);
>     }
> }
> a[6]();	// 10 所有都是10
> ```
>
> ```javascript
> // let
> var a = [];
> for (let i = 0; i < 10; i++) {
>     a[i] = function () {
>         console.log(i);
>     }
> }
> a[6]();	// 6，都能对应上
> ```
>
> 解释：
>
> 变量i是let声明的，当前的i只在本轮循环有效，所以每一次循环的i其实都是一个`新的变量`，所以最后输出的是6
>
> ```javascript
> // 可以看做是下面这样
> var a = [];
> {
>     let k;
>     for (k = 0; k < 10; k++) {
>       let i = k; //注意这里，每次循环都会创建一个新的i变量
>       a[i] = function () {
>         console.log(i);
>       };
>     }
> }
> a[6](); // 6
> ```
>
> 

