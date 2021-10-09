# 类Class

## 概念

* 语法糖，让对象原型的写法更加清晰、更像面向对象的编程
* 与构造函数生成实例的用法一致
* 内部定义方法不需要function关键字，方法间不需要分好，必须使用new调用
* 类的所有方法都定义到该类的prototype原型对象上
* this指向类的实例对象，在this上显式定义的属性（constructor）即定义在实例对象上
* 类和模块的内部，默认就是严格模式（所以如果直接调用类的方法，会报错，this丢失）
* 静态方法static：可以和prototype方法重名，不能被实例继承，可以被其它类继承，只能通过类来调用

```javascript
class Person {
    constructor (name) {
        this.name = name;
    }
    getName () {
        return this.name;
    }
}
const { getName } = Person
getName();	// 报错，this为undefined
```



## 与ES5的区别

* 类不存在变量提升（为继承考虑）
* 类的内部所有定义的方法，都是不可枚举的，ES5中可以

```javascript
class Point {
    constructor () {
        
    }
    toString () {}
}
Object.keys(Point.prototype);	// []
Object.getOwnPropertyNames(Point.prototype);	// ['constructor', 'toString']

// ES5
let Point = function () {
    
}
Point.prototype.toString = function () {};
Object.keys(Point.prototype);	// ['toString']
Object.getOwnPropertyNames(Point.prototype);	// ['constructor', 'toString']
```

