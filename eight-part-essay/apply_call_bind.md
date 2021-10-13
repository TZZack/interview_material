# bind的实现方式

## 概念

> `MDN`：
>
> __`bind()`__ 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。



## 手写call/apply、bind

### 手写call

```javascript
Function.prototype.myCall = function (context, ...arr) {
    if (context === null || context === undefined) {
        context = window;
    } else {
        
        // 这层的处理是防止context为原始类型，会报错
        // 这样处理后原始值会指向这个原始值的实例对象（就是转成一个对象）
        context = Object(context);
    }
    
    const uuid = Symbol('uuid');	// 防止跟上下文的原属性冲突
    context[uuid] = this;	// 这样函数的this就指向了context上
    let result = context[uuid](...arr);	// 变成了context去调用这个函数
    delete context[uuid];
    return result;
}
```

### 手写apply

与call的区别，参数为数组或`类数组`（需要判断是否为`类数组`）

```javascript
// 判断是否为类数组：来自Javascript权威指南
function isArrayLike(o) {
    if (o &&                                    // o不是null、undefined等
        typeof o === 'object' &&                // o是对象
        isFinite(o.length) &&                   // o.length是有限数值
        o.length >= 0 &&                        // o.length为非负值
        o.length === Math.floor(o.length) &&    // o.length是整数
        o.length < 4294967296)                  // o.length < 2^32
        return true
    else
        return false
}
Function.prototype.myApply = function (context) {
    if (context === null || context === undefined) {
        context = window;
    } else {
        context = Object(context);
    }
    
    const uuid = Symbol('uuid');
    context[uuid] = this;
    let args = arguments[1]
    if (args) {
        if (Array.isArray(args) || isArrayLike(args)) {
            args = Array.from(args);	// 把类数组转成数组
        } else {
            throw new TypeError('第二个参数不是数组或类数组');
        }
    } else {
		args = [];
    }
	let result = context[uuid](...args);
    
    delete context[uuid];
    return result;
}
```

### 手写bind

```javascript
// 利用call实现，返回一个新函数，新函数里面去执行调用bind的函数，执行时用call绑定上下文和参数
// 最后把原函数的原型对象给到新函数
Function.prototype.myBind = function (objThis, ...params) {
    const thisFn = this;	// 存储原函数
    let newFn = function (...otherParams) {
        let isNew = this instanceOf newFn;	// 这个返回的函数是否被new调用
        let context = isNew ? this : objThis;
        return thisFn.call(context, ...params, ...otherParams);
    };
    
    // 复制原函数的原型对象给新函数（因为bind是完整拷贝一个函数，要拷贝全了）
    // 箭头函数没有原型对象，不处理
    if (thisFn.prototype) {
        newFn.prototype = Object.create(thisFn.prototype);
    }
    return newFn;
}
```

