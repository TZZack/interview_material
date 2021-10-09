# new操作符

## 构造函数

### 1. 普通构造函数

> a. 任何函数只要使用`new`操作符调用，就属于构造函数
>
> b. 箭头函数不能作为构造函数，`new`的时候会报错（看下面的`new`过程就知道，箭头函数没有`this`指向，使用`call`或`apply`调用这个函数时，无法对`this`进行绑定；箭头函数也没有`prototype`属性，`new`的过程需要将构造函数的`prototype`赋值给新的对象的`__proto__`）

### 2. 类构造函数

> a. 类构造函数在`Class`里面的构造器`constructor`：使用`new`创建类的新实例时，会调用这个函数

### 3. 构造函数的`return`值的影响

> a. 如果构造函数`return`的值是原始类型，则new XXX()正常返回实例（即构造函数`return`的值无意义）
>
> b. 如果构造函数`return`的值是对象类型，则new XXX()返回的是`return`的对象
>
> ```javascript
> function Person (name, sex) {
>     this.name = name;
>     this.sex = sex;
>     this.getName = function () {
>         return this.name;
>     }
>     return {
>         name: 'test'
>     }
> }
> 
> var aPerson = new Person('zzz', 'boy');
> console.log(aPerson.name) // test
> console.log(aPerson.getName); // undefined
> ```

## new的过程（发生了什么）

> 1. 在内存中创建一个新对象
> 2. 在新对象内部的`[[prototype]]`指针被赋值为`构造函数`的`prototype`属性：`[[prototype]]`属性是隐藏的，不过目前大部分现代浏览器实现方式是用`__proto__`来表示
> 3. 构造函数内部的this被赋值为这个新的对象（即this指向新对象）
> 4. 执行构造函数（即给新对象添加属性）
> 5. 如果构造函数返回为对象，则返回该对象，否则返回新建的对象

## 手写new

```javascript
function _new (fn, ...args) {
    
    // step 1 and 2
    var newObj = Object.create(fn.prototype);	// Object.create：创建一个新对象，并使用现有的对象来提供新对象的__proto__
    
    // step 3 and 4;
    var result = fn.apply(newObj, args);
    
    // step 5
    return result instanceof Object ? result : newObj;
}
```

总结参考：[520， 学废 new 对象的过程](https://juejin.cn/post/6964169557569175565)
