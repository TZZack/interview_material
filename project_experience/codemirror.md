# spl语法高亮和智能提示

## Splunk概念

Splunk 是机器数据的引擎，Splunk是一个托管的日志文件管理工具，它的主要功能包括：

> * 搜索功能
>
> * 日志聚合功能
> * 提取意义
> * 对结果进行分组，联合，拆分和格式化

## 语法

* 背景：大数据有一套Splunk语法，不知道是我们部门自己定义的还是业内已有的（在网上没看到有类似的）

* 具体语法：

  > search：集群名.数据库/ES中的索引[.表名]（search cluster.student,cluster.teacher检索名称为student和teacher的index）
  >
  > filter：全文匹配filter "xx"、字段匹配（filter name="xx"）、字段存在匹配（filter EXIST(name)）等等
  >
  > agg：聚合命令（agg count(name) as p计算名称的总数并取别名为p）
  >
  > field：投影命令（field name 对name投影）
  >
  > sort：排序命令（sort age:desc,score）
  >
  > limit：限制命令（limit 10 或 search cluster.student | agg count(name) | limit sex:10,100 表示聚合结果限制为10条，原始数据限制为100条）
  >
  > page：分页命令（page 10,20 取第10页第20条）
  >
  > top：求某个字段的topn（top score:10）
  >
  > highlight：高亮（highlight name）

* 约束：

  > * 命令由`|`分割
  > * 有且仅有一个search
  > * search必须是第一个
  > * filter可以出现多次
  > * 除filter其它命令最多只能出现1次
  > * limit和page不能同时存在

## 实现

### CodeMirror

* 简介：CodeMirror是一个开源的文本编辑器，支持语法高亮和智能提示，其内部封装并提供了很多主流的语言模式，比如sql、javascript、markdown，而且还支持自定义语法
* 模式mode：Mode的主要作用就是对行文本进行词法分析进而进行文本标识，这是主要功能也是基础功能

### 思路

主要是词法分析和联想提示两个主要功能

* 词法分析

  > 1. `大致原理`：拿javascript来讲
  >
  >    * 要完成javascript模式，只需要定义一个词法分析程序就可以了，因为CodeMirror核心程序已经将整个javascript文档按照行做了拆分，在mode里需要做的就是写一个词法分析程序来分析每一行数据
  >    * 对于每一行文本，词法分析程序需要从字符串开始分析到字符串结束，在这过程中，会对需要标识的字符或者字符串做特殊标识（token），并且返回一个css样式对应被标识的字符或者字符串
  >
  > 2. `Codemirror.defineMode`定义模式
  >
  >    * 第一个参数是模式名称
  >    * 第二个参数是回调函数，这个函数有两个入参，分别为CodeMirror的配置对象（传递给CodeMirror构造函数使用）和mode的配置对象（包含哪些属性由具体的mode决定），这个函数需要return一个对象，对象必须包含token函数，模式进行行文本分析时调用，然后返回一个样式字符串（也就是标识），如果返回的是test，对应的样式就是cm-test
  >
  > 3. 词法分析函数：
  >
  >    * `stream`：token函数有一个stream对象参数，CodeMirror内部定义的Stream类的实例，包含了当前行的文本信息，还包好已经分析到的字符位置（字符串分析的时候，是一个个字符顺序分析的），也包含一些列使用的字符串处理方法
  >
  >    * 在分析同一行文本时，token函数会被反复调用，只要是遇到需要标识的子字符串片段或者空白字符，token都会return，直到分析到行尾，比如：
  >
  >      ```javascript
  >      var name = this.name;
  >      ```
  >
  >      > 分析：
  >      >
  >      > a. token从字符串第一个字符开始分析，此时stream.pos为0（pos为分析到的位置），遇到一个关键字var，则返回一个名为keyword的css样式，同时stream.pos移动到2，CodeMirror将会给匹配到的var外面加上span标签，该标签的样式就是cm-keyword
  >      >
  >      > b. 字符串还没结束，第二次调用token分析，遇到一个空格，返回null，也就是说空格不需要高亮，同时stream.pos移动到3
  >      >
  >      > c. 字符串还没结束，第三次调用token分析，遇到name，返回properties，同时stream.pos移动到7
  >      >
  >      > d. 继续调用token，直到整个字符串分析完毕
  >
  >    * d
  >
  > 4. 通过对定义好的文法进行简单的抽象，来定义它的高亮规则，比如说分为4类：
  >
  > `操作符`：> < >= <= == |
  >
  > `关键字`：search、filter、agg（avg、min、range、histogram）、field、sort（asc、desc、as、by）、limit、page
  >
  > `标识符`：field、function、val
  >
  > `值类型`：string、number、date
  >
  > 通过正则识别出上述内容，并写入标记（token），进行着色（codemirror自带mode大部分都是这样实现的），每一类对应一个class

* 联想提示



## 总结

挑战性：

* 当时没用过codemirror，问了架构师说推荐我去看看Codemirror
* 然后发现确实是可以自定义语法高亮，但是对应自定义语法的中文文档比较少，当时弄懂它得整个定义语法模式的原理以及细节上面的参数，都花了不少精力，做了不少尝试，包括分析内置的javascript语法模式、google一些外国资料
* 项目定义的Splunk语法比较复杂，差不多比得上sql语法了，在做设计之前需要掌握整体的语法（设计：分类）
* 最终花费的时间一个星期有多，其实最终写出来的关键代码也才将近1000行吧

