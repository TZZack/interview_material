# 字节跳动

## 技术一面

> 时间：2021-10-18 15:00:00
>
> 方式：飞书视频会议面试

### 面试类容

1. 自我介绍：自我介绍产出个文字版的，记忆一下

2. 项目经验，有挑战性的说一下

   * 先说一下项目背景：`这个要重新准备下，讲得不够熟练`

   * CodeMirror自定义语法：语法分析列举了javascript的例子给面试官讲，然后讲了实现Splunk自定义语法高亮的问题
   * 登录认证问题解决：其实就是跨域了，然后使用脚手架提供的express中间件去对登录请求进行转发，然后处理302的location，修改域名为localhost，然后面试官问了个CROS

   综合：讲得还不错，也有考虑面试官听不明白的地方，有询问是否自己有讲清楚，面试官也都了解，然后是面试官都

3. 如何保证小组的代码质量：从代码提交到代码审核、到模块编码完成的功能验收和代码走读，还有平时积累的业务编码规范，都讲清楚了

4. 缓存、http缓存：未准备

5. http和http2的区别：未准备

6. webpack的loader和plugin的区别：未准备

7. 事件循环：从同步任务和异步任务开始讲，然后面试官拓展到宏任务和微任务，也都讲得很清楚

   `但是宏任务有哪些临时遗忘了，只说了setTimeout，微任务的都说齐了`

8. Vue.$nextTick实现原理：只回答了使用mutationObserver实现，但其实还有其它情况

9. 编码题：类似ES6的模板字符串实现

   ```javascript
   // 输入strHandler ('my name is { name }, my age is { age }', {name: 'zzz', age: 12})
   // 输出my name is zzz, my age is 12
   function strHandler (str, obj) {
   	let reg1 = /({.*?})/g;	// 在两次后面加问号，取消捕获时候的贪婪性
       let reg2 = /{\s*(.*?)\s*}/;
       let match1 = str.match(reg1);
       match1.forEach(matchStr => {
           let match2 = matchStr.match(reg2);
           let key = match2[1];
           if (obj[key]) {
               let index = str.indexOf(matchStr);
               str = str.substr(0, index) + obj[key] + str.substr(index+matchStr.length);
           }
       });
       console.log('str', str);
   }
   ```

### 有什么想问的

问了面试官关于字节BFF（用node做中间层）的事情，了解到字节目前BFF很普遍了，也还在继续推广中，也说道自己目前所在公司没有一个产品线是有用到的，然后说到前端处理数据特别是大数据产品的问题，跟面试官也交流得很愉快