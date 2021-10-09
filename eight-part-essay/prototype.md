# 原型链

## 原型

> 1. 隐式原型：每个引用类型/对象，都有一个隐式原型`__proto__`（看不见的叫`[[prototype]]`，现在浏览器都用`__proto__`显示出来）
> 2. 显式原型：每个构造函数都有一个显式类型`prototype`（也是一个对象，也就是说显示类型也会有`__proto__`）
> 3. 应用类型/对象的隐式原型`__proto__`指向它构造函数的显式原型`prototype`
>
> 
>
> 注意：
>
> a. new的过程就有一步是让新建的对象的`__proto__`指向构造函数的`prototype`
>
> b. `__proto__`是非标准属性（即未来可能会修改或移除该属性），不建议直接访问，建议使用ES6新增的`Reflect.getPrototypeOf`或者`Object.getPrototypeOf()`方法

## 原型链

访问一个对象的某个属性时，如果这个对象没有这个属性，则会去`__proto__`隐式原型（也就是构造函数的显式原型`prototype`）查找，如果没有，则继续往上查找构造函数的显式原型也有`__proto__`，就这样一直找，最终找到`Object.prototype.__proto__`为`null`（设计上为了避免死循环），不再继续找，这就是原型链的概念了，例如：

```javascript
function Person (name) {
    this.name = name;
}
var personA = new Person('zzz');
personA.toString();
```

> 原型链分析：
>
> 1. `personA`对象下面没有`toString`方法，则去找构造函数的`prototype`
> 2. 很明显`Person`的`prototype`也没有`toString`，`Person.prototype`是一个对象，对象的构造函数就是`Object`，最终在`object.prototype`下找到`toString`方法

## 手写instanceOf

## 手写instanceOf

```javascript
function _instanceOf (ins, con) {
    if (typeof ins !== 'object') {
        return false;
    }
    let insProto = ins.__proto__;
    while (true) {
        if (insProto === null) {
            return false;
        }
    	if (insProto === con.prototype) {
            return true;
        }
        insProto = insProto.__proto__;
    }
}
```





参考文章：[面不面试的，你都得懂原型和原型链](https://juejin.cn/post/6934498361475072014)