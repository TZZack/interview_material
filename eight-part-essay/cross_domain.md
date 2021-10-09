# 跨域

## 同源策略

* 概念：协议、域名、端口任一不一样，都视为不同源，不同源即为跨域
* 同源策略限制的内容：
  * cookie、localStorage、indexedDB等存储性内容（cookie一般为服务器设置的，可设置不同端口都）
  * DOM节点
  * AJAX请求发送后，结果被浏览器拦截了
* 但以下三个标签是允许跨域加载的
  * `<img src="">`
  * `<link href="">`
  * `<script src="">`
* 跨域并不是发不出去请求，服务端也能收到请求并正常返回，只是结果被浏览器拦截了

## 跨域解决

### 1. jsonp

> 原理：
>
> 利用`<script>`标签不受同于限制，加载完`<scritp>`资源后执行回调

### 2. 开启CORS

> 原理：Access-Control-Allow-Origin配置为通配符，即所有网站都可以访问资源

### 3. postMessage

> 原理：
>
> 1. `postMessage`是HTML5 XMLHttpRequest Level 2中的API，且是为数不多可以跨域操作的window属性之一
>
> 2. `postMessage`方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递

### 4. websocket

### 5. node的中间件代理

> 原理：
>
> node作为中间层，对客户端的请求进行转发（通过中间件进行改写）

### 6. nginx反向代理

> 原理：
>
> 类似Node中间件代理，需要搭建一个中专nginx服务器，用于转发请求
>
> `使用nginx反向代理实现跨域，是最简单的跨域方式`
>
> （同源策略对服务器不加限制）

### 7. iframe的方式

> 分别配合`window.name`、`location.hash`、`document.domain`使用