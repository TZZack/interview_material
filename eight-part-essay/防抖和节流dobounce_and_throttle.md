# 防抖和节流

**解决问题：input、scroll、resize等事件触发频率高，会加重浏览器负担，用户体验差**

## 防抖

> 概念：事件触发后，等待n秒，n秒内没再触发事件，再去执行事件绑定的操作

**实现**

```javascript
// 使用闭包的思路，共享timeoutId这个参数
function debounce (fn, delay) {
    var timeoutId = null;
	return timeoutFn = function () {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(fn, delay);
    }
}
```



## 节流

> 概念：同一个高频事件，在n秒内只会执行一次，稀释函数执行的频率

**实现**

```javascript
function throttle (fn, interval) {
    var isRunning = false;
    return function () {
        if (isRunning) {
            return;
        }
        isRunning = true;
        setTimeout(() => {
            fn();
            isRunning = false;
        }, interval);
    }
}
```

