# this指向问题

## this是什么

> 1. this就是一个指针，指向调用函数的对象
> 2. this的绑定规则有
>
> * 默认绑定
> * 隐式绑定
> * 显式绑定
> * new绑定
>
> 优先级：new > 显式绑定 > 隐式绑定 > 默认绑定

## 默认绑定

> 1. 在不能应用其它绑定规则时使用，通常是独立函数的调用
> 2. 非严格模式下，this指向全局对象（window）
> 3. 严格模式下，this指向undefined，会报错

```javascript
function getName () {
    console.log('My name is', this.name);
}
var name = 'zzz';	// 在浏览器中执行，name会绑定window对象上
getName();	// My name is zzz
```

## 隐式绑定

1. 函数调用是在某个对象上触发的，即调用位置存在上下文对象：典型的形式为xxx.fn()

```javascript
function getName () {
    console.log(this.name);
}
var person = {
    name: 'hyx',
    getName		// 不管getName是声明在外面，还是在Person对象这里才声明，Person.getName()调用时最终的this指向都是Person对象
};
var name = 'zzz';
person.getName();	// hyx
```

2. 不管调用函数时有多少层，this都是指向最后一层（即直接调用this的那层）

```javascript
function getName () {
    console.log(this.name);
}
var person1 = {
    name: 'hyx',
    getName
};
var person2 = {
    name: 'zzz',
    wife: Person1
}
person2.wife.getName();	// hyx
```

3. 隐式绑定的缺陷，绑定很容易丢失（通常是使用时不经意间导致），下面看两种丢失的情况

* 赋值丢失

```javascript
function getName () {
    console.log(this.name);
}
var prson1 = {
    name: 'hyx',
    getName
};
var name = 'zzz';

var prson1GetName = prson1.getName;

prson1GetName();	// zzz
```

> 分析：这个person1GetName指向了getName的引用地址，后面调用时，已经跟Person1这个对象没关系了，所以this指向全局

* 回调丢失

```javascript
function getName () {
    console.log(this.name);
}
var person1 = {
    name: 'zzz',
    getName: function () {
        setTimeout(function () {
            console.log(this.name);
        }, 100);
    }
};
var person2 = {
    name: 'hyx',
    getName
};
var name = 'zxx';
person1.getName();	// zxx，回调函数中，使用了默认绑定
setTimeout(person2.getName, 100);	// zxx，类似上面的赋值丢失，只是把函数引用传过去了
setTimeout(function () {
    person2.getName();
}, 100);	// hyx，有隐式绑定
```

> 分析：`person.getName()`回调函数中，使用了默认绑定；`setTimeout(person2.getName, 100)`这里是赋值丢失了隐式绑定；最后一个是执行时就是用的隐式绑定

## 显示绑定

1. 通过call、apply、bind的方式，显式绑定this的指向

```javascript
function getName () {
    console.log(this.name);
}
var person1 = {
    name: 'zzz',
    getName
};
var name = 'hyx';
var getPerson1Name = person1.getName;
getPerson1Name.call(person1);	// zzz
```

2. 绑定丢失

```javascript
function getName () {
    console.log(this.name);
}
var person1 = {
    name: 'zzz',
    getName
};
var name = 'hyx';
var getPerson1Name = function (fn) {
    fn();
};
getPerson1Name.call(person1, person1.getName);	// hyx
```

> 分析：call把person1绑定到getPerson1Name的this里面，但是getName是以参数穿进去的，相当于是赋值，fn执行时就丢失了隐式绑定，就只能是默认绑定了
>
> 优化：想要不丢失this绑定，只需要fn执行时也显示绑定上this，即`fn.call(this);`

## new绑定

即new一个实例出来，这个就没啥好说的了，具体可以看[new](./new.md)



总结参考: [嗨，你真的懂this吗？](https://juejin.cn/post/6960839686755450894)

