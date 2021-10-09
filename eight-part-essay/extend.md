# 继承

## 概念

> 1. 一个类获取另一个或者多个类的属性或者方法。继承可以使得子类具有父类的各种方法和属性，代码复用和更好地进行封装
> 2. 原理：复制父类的方法和属性来重写子类的原型对象

## 继承的方法

### 1. 原型链继承

#### 1.1 实现

```javascript
function Father () {
	this.name = 'zzz';
}
Father.prototype.sayHi = function () {
	console.log('hi');
}
Father.prototype.eyesCount = 2;
function Son () {
    this.name = 'zxx';	// 构造函数里面的值不会被覆盖
}
Son.prototype = new Father();
```

#### 1.2 优点

简单、易操作

#### 1.3 缺点

* 父类使用this声明的属性会被所有子类实例共享，如果是一个引用类型的属性，则一个子类实例修改了，会影响到其它子类实例

* 创建子类实例时，无法向父类构造函数传参，不够灵活

### 2. 借用构造函数（call/apply）
#### 2.1 实现

```javascript
function Father (name, age) {
	this.name = name;
    this.age = age;
}
Father.prototype.sayHi = function () {
	console.log('hi');
}
Father.prototype.eyesCount = 2;
function Son (job, ...fatherParams) {
    Father.apply(this, fatherParams);
    this.job = job;
}
var son1 = new Son('IT', 'zxx', 1);
console.log(son1.name);	// zxx
console.log(son1.age);	// 1
console.log(son1.sayHi);	// undefined
```

#### 2.2 优点

* 可以向父类传参
* 解决父类声明的this引用类型属性被共享的问题

#### 2.3 缺点

* 不能继承父类prototype上的方法/属性
* 父类方法无法复用，每次创建子类实例，都要执行父类函数，重新声明父类定义的方法

### 3. 组合继承（call + new）

>原理：
>
>1. 使用`原型链继承`方法将父类的`this`、`prototype`上的`属性`和`方法`继承至子类的原型对象上
>2. 使用`借用构造函数`方法来继承父类通过`this`声明的`属性`和`方法`到子类的实例属性上

#### 3.1 实现

```javascript
function Father (name) {
    this.name = name;
}
Father.prototype.sayHi = function () {
    console.log('hi');
}
function Son (age, ...fatherParams) {
    Father.apply(this, fatherParams);
    this.age = age;
}
Son.prototype = new Father();
var son1 = new Son(0, 'zxx');
```

#### 3.2 优点

* 解决`原型链继承`父类this声明的属性/方法被共享的问题（可参考new过程，在Son里面借用Father构造函数，重新申请了引用类型属性的地址，然后覆盖掉`原型链继承`来的同名属性，这样就不是共享的了）
* 解决`借用构造函数`解决不能继承父类`prototype`对象上的属性/方法的问题

#### 3.3 缺点

* 调用了父类函数两次（`原型链继承`和`借用构造函数`各一次），可能造成性能问题
* 子类的`prototype`上也多了不必要的属性，比如父类在构造函数中`this.xxx`声明的属性
* 原型链上下文丢失，子类和父类通过`prototype`声明的属性和方法都存在于子类的`prototype`上（--没理解--）

### 4. 原型式继承

> 原理：
>
> 利用一个空对象作为中介，将某个对象直接赋值给空对象构造函数的原型。

#### 4.1 实现

```javascript
function object (Father) {
    function Son () {};
	Son.prototype = Father;	// 浅拷贝了这里，所以会共享引用属性
    return new Son();
}
function Father = function () {
    this.name = 'zzz';
}
var son1 = object(Father);
```

ES5中存在`Object.create()`的方法，能够代替上面的`object`方法

```javascript
function Father = function () {
    this.name = 'zzz';
}
var son1 = Object.create(Father.prototype);
son1 instanceOf Father;	// true
```

#### 4.2 优点

* 兼容性好，最简单的对象继承

#### 4.3 缺点

* 所有实例共享被继承的属性
* 不能传递参数

### 5. 寄生式继承（继承过程封装）

> 原理：
>
> 1. 在原型式继承的基础上进行增强对象
> 2. 创建一个仅用于封装继承过程的函数，该函数主要作用是为构造函数增加属性和方法，以增强函数

#### 5.1 实现

```javascript
function createAnother (constructor) {
    var newObj = object(constructor);
    
    // 增强对象
    newObj.sayHi = function () {
        console.log('hi');
    }
    return newObj;
}
```

#### 5.2 优/缺点：

与原型式继承一致

### 6. 寄生组合式继承（call + 寄生式封装）

> 原理：
>
> 1. 使用`借用构造函数继承`法来继承父类this声明的属性和方法
> 2. 使用`寄生式继承`法来继承父类的属性和方法
>
> __目前最成熟也是最常用的继承方法——__

#### 6.1 实现

```javascript
function Father (name) {
    this.name = name;
}
Father.prototype.sayHi = function () {
    console.log('hi');
}
function Son () {
    Father.apply(this, arguments);
	this.age = 12;
}
Son.prototype = Object.create(Father.prototype);
Son.prototype.constructor = Son;
```

#### 6.2 优点（对比`组合继承`）

* 只调用了一次父类构造函数，节约了性能
* 避免在Son.prototype上生成不必要的属性（比如父类构造函数里面`this.xxx`声明的属性）

### 7. ES6-extends继承

> 原理：
>
> ES6可通过extends关键字实现继承，这比通过ES5修改原型链实现继承，要清晰和方便得多

#### 7.1 实现

```javascript
class Rectangle {
    constructor (width, height) {
        this.width = width;
        this.height = height;
    }
        
    get area () {
        return this.calcArea();
    }
        
    calcArea () {
        return this.width * this.height;
    }
}

class Square extends Rectangle {
    constructor (length) {
        super(length, length);
        this.name = 'Square';
    }
}

const square = new Square(10);
console.log(square.area);
```

extends转换为ES5后的核心代码：(与寄生组合继承方式一致)

```javascript
function _inherits(subClass, superClass) { 
    if (typeof superClass !== "function" && superClass !== null) { 
        throw new TypeError("Super expression must either be null or a function"); 
    } 
    subClass.prototype = Object.create(superClass && superClass.prototype, { 
        constructor: { 
            value: subClass, writable: true, configurable: true 
        } 
    }); 
    if (superClass) _setPrototypeOf(subClass, superClass); 
}
```

#### 7.2 优点

没啥好说的，用就完事了

#### 7.3 与ES5继承的区别

> 1. 函数声明和类声明的区别：函数声明有变量提升，类没有，需要先声明后使用
> 2. 父子顺序
>    * ES5继承实质上是先创建子类的实例对象，然后再将父类的方法添加到this上；
>    * ES6继承实质上是先创建父类的实例对象this，然后再用子类的构造函数修改this，所以子类的constructor需要在使用this前就调用super方法创建父类的this对象，否则会报错（可以理解为子类没有this）





参考文章：[这样回答继承，面试官可能更满意](https://juejin.cn/post/6844904013096288269)