# JS 正则终极篇

![郑则仕](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/zhengzeshi.jpg)

香港有一个叫郑则仕的演员，就是上面这个了，每次我打正则式，都是联想的他的名字。

从开始学习正则到逐渐熟悉，偶尔不用经常会忘记。常常要翻出来查着用，遇到高深的用法常常不知所措，如果你也是这样，那就快快保存这篇博文吧，想不出来了，从头看一遍，保证你回想起全部正则的知识。

装逼 OK，开始开车。

# 创建 RegExp 对象

## 直接量

> /pattern/attributes

```js
var reg = /\d+/g
var a = { a: 1 }
```

这种写法如同直接对象

## new 一个

> new RegExp(pattern, attributes);

```js
var reg = new RegExp(/\d/, 'i')
var a = new Object({ a: 1 })
```

这种写法如同使用构造函数构建

## 参数 i/g/m/s 的作用

attributes 作为模式选择，有下面几种可以选择。

| 参数 | 含义      | 作用       |
| ---- | --------- | ---------- |
| i    | ignore    | 区分大小写 |
| g    | global    | 全局匹配   |
| m    | multiline | 多行匹配   |
| s    | dotAll | 正则表达式中点.匹配除回车外的任何单字符，标记s改变这种行为，允许匹配回车换行  |

其中dotAll模式是ES9新加的，具体可以看[这里](https://coffe1891.gitbook.io/frontend-hard-mode-interview/1/1.1.1#zheng-ze-biao-da-shi-dotall-mo-shi)

举个栗子：

```js
var reg = /[a-z]/
var reg2 = /[a-z]/g
console.log('abcdefg'.match(reg)) //["a", index: 0, input: "abcdefg"]
console.log('abcdefg'.match(reg2)) //["a", "b", "c", "d", "e", "f", "g"]

// dotAll
/hello.world/.test('hello\nworld');  // false
/hello.world/s.test('hello\nworld'); // true
console.log(/hello.world/s.test(`hello
world`))   //>> true
```

这里用到了 Sting 下的 match 方法，稍后会说道。这里先看着

# RegExp 下的一些方法

## 方法：test()

**返回值：** Boolean 类型，true 或 false
**举例：**

```js
var reg = /\d+/
reg.test({ a: 123 }) //false
reg.test(123) //true
reg.test('manfredhu') //false
```

**不难看出，test 方法用在一些测试环境下，比如检测某个字符串是否存在某个特定字符的时候**
如上栗子，要监测字符串是否具有数字，只有第二个符合。

## 方法：exec()

**返回值：**

- 被匹配的值，返回一个数组，数组为
  - 匹配串
  - 下标
  - 整个串
- 没有发现匹配，则返回**null**

**举例：**

```js
var reg = /\d+/
reg.exec('d123') //["123", index: 1, input: "d123"]
reg.exec('manfredhu') //null
```

### 参数 g 在 exec()方法的工作原理

**没有 g 参数的 exec()方法只会执行一次**

```js
var reg = /\d+/
var str = 'd123d123d123'
var result = reg.exec(str)
console.log(result, reg)
//["123", index: 1, input: "d123d123d123"] /\d+/
result = reg.exec(str)
console.log(result, reg)
//["123", index: 1, input: "d123d123d123"] /\d+/
```

**而拥有 g 参数的 exec()方法却是不一样的，工作原理如下**

- 找到第一个 "e"，并存储其位置
- 如果再次运行 exec()，则从存储的位置开始检索，并找到下一个 "e"，并存储其位置

```js
var reg = /\d+/g
var str = 'd123d123d123'
var result = reg.exec(str)
console.log(result, reg)
//["123", index: 1, input: "d123d123d123"] /\d+/
result = reg.exec(str)
console.log(result, reg)
//["123", index: 5, input: "d123d123d123"] /\d+/
```

这里加了 g 参数，第一次匹配返回匹配开头的下标 1，第二次返回下标 5.

## 方法：compile()

**返回值：** 无
compile() 方法用于改变 RegExp。
compile() 既可以改变检索模式，也可以添加或删除第二个参数。

```js
var patt1 = new RegExp('e')
console.log(patt1.test('The best things in life are free')) //true
patt1.compile('d', 'g')
console.log(patt1) // /d/g
console.log(patt1.test('The best things in life are free')) //false
```

# 正则表达式

正则符号比较多，常用的如下:

## 常用元字符

| 符号   | 含义                             |
| ------ | -------------------------------- |
| [abc]  | 查找方括号之间的任何字符         |
| [^abc] | 查找不属于 abc 的任何字符        |
| [A-z]  | 查找任何从大写 A 到大写 z 的字符 |
| \w     | 查找单词字符。                   |
| \W     | 查找非单词字符。                 |
| \d     | 查找数字。                       |
| \D     | 查找非数字字符。                 |
| \s     | 查找空白字符。                   |
| \S     | 查找非空白字符。                 |
| \b     | 匹配单词边界。                   |
| \B     | 匹配非单词边界。                 |
| \n     | 匹配换行键。                 |
| \r     | 匹配回车键。 |
| \t     | 匹配制表符 tab（U+0009）。 |
| \v     | 匹配垂直制表符（U+000B）。 |
| \f     | 匹配换页符（U+000C）。 |
| \0     | 匹配null字符（U+0000）。 |
| \xhh   | 匹配一个以两位十六进制数（\x00-\xFF）表示的字符。 |
| \uhhhh | 匹配一个以四位十六进制数（\u0000-\uFFFF）表示的 Unicode 字符。 |
| \需要转义的符号 | 正则表达式中，需要反斜杠转义的，一共有12个字符：^、.、[、$、(、)、|、*、+、?、{和\
。需要特别注意的是，如果使用RegExp方法生成正则对象，转义需要使用两个斜杠，因为字符串内部会先转义一次。 |

```js
(new RegExp('1\+1')).test('1+1')
// false
(new RegExp('1\\+1')).test('1+1')
// true
```

## 量词

如字面意思，就是描述匹配的数量的。

| 量词   | 描述                                                                              |
| ------ | --------------------------------------------------------------------------------- |
| n+     | 匹配任何包含至少一个 n 的字符串。                                                 |
| n\*    | 匹配任何包含零个或多个 n 的字符串。                                               |
| n?     | 匹配任何包含零个或一个 n 的字符串。                                               |
| n{X}   | 匹配包含 X 个 n 的序列的字符串。                                                  |
| n{X,Y} | 匹配包含 X 至 Y 个 n 的序列的字符串。                                             |
| n{X,}  | 匹配包含至少 X 个 n 的序列的字符串。                                              |
| n\$    | 匹配任何结尾为 n 的字符串。                                                       |
| ^n     | 匹配任何开头为 n 的字符串。                                                       |
| ?=n    | 匹配任何其后紧接指定字符串 n 的字符串,但是不会出现在匹配结果的字符串里面          |
| ?:n    | 匹配任何其后紧接指定字符串 n 的字符串,并出现在匹配结果字符里面,不作为子匹配返回。 |
| ?!n    | 匹配任何其后没有紧接指定字符串 n 的字符串。                                       |

这里的量词还是比较重要的，最后两个估计有的同学没见过。

## 贪婪匹配与懒惰匹配
贪婪匹配就是尽可能多的匹配，懒惰匹配就是尽可能少的匹配. 

```js
const regexp  = /\d+/;  //贪婪匹配，默认
const regexp2 = /\d+?/; //懒惰匹配，通常会有?号在数量词之后
const str = "11111111111";
console.log(regexp.exec(str));  //["11111111111", index: 0, input: "11111111111"]
console.log(regexp2.exec(str)); //["1", index: 0, input: "11111111111"]
```

上面的例子很明确，贪婪模式匹配了整个字符串，因为是从整个字符串来逐个减少字符来匹配的。而非贪婪模式是从最小的字符一个个开始匹配的。
这里要特别注意 `?` 这个问号的位置，**通常会跟在限定数量长度的符号之后**。

| 懒惰限定符   | 描述                                                                              |
| ------ | --------------------------------------------------------------------------------- |
| *?     | 重复任意次，但尽可能少重复                                       |
| +?     | 重复1次或更多次，但尽可能少重复                                   |
| ??     | 重复0次或1次，但尽可能少重复                                     |
| {n,m}? | 重复n到m次，但尽可能少重复                                       |
| {n,}?  | 重复n次以上，但尽可能少重复                                       |

再比如下面的例子

```js
const greedyRegex = /a{1,3}/;
const nonGreedyRegex = /a{1,3}?/;
const str = "aaaa";

console.log(str.match(greedyRegex)); // ['aaa', index: 0, input: 'aaaa', groups: undefined]
console.log(str.match(nonGreedyRegex)); // ['a', index: 0, input: 'aaaa', groups: undefined]
```

## 预查（断言assertion）
预查又叫断言，英文assertion。正向(positive)或反向(negative)预查都是非获取匹配，不进行存储供以后使用。简单说就是知道会出现，但是你拿不到结果。ES9支持反向预查，这里先介绍一下基本概念
如零宽正向先行断言(zero-width positive lookahead assertion)，这里又两个概念，一个是正向和反向，一个是先行和后行

正向(positive)与反向(negative，也叫负向)的区别：正向预测会出现什么东西，反向预测不会出现什么东西
先行(lookahead)与后行(lookbehind)的区别: 与匹配位置有关系，可以看[先行后行的区别](#先行后行的区别)

### 正向预查
- (?:pattern) 
  - 匹配结果。`Java(?:6|7)`等效于`Java6|Java7`，结果**Java6 Java7**
- (?=pattern) 零宽正向先行断言(zero-width positive lookahead assertion), 有的也叫前瞻运算符
  - 正向匹配。`Java(?=6)`，匹配后面跟着6的Java，即第一个Java，结果**Java**6 Java7
- (?!pattern) 零宽负向先行断言(zero-width negative lookahead assertion)
  - 正向不匹配。`Java(?!6)`，匹配后面不跟着6的Java，即第二个Java，结果Java6 **Java**7

#### ?=和?:的区别

这两个都是正向的,区别是(?=)不会作为匹配校验,也不会被捕获而出现在匹配结果字符串里面。或者可以叫**前瞻**, 也就是**从这个位置往前看, 但是不消耗匹配字符**
而(?:)会作为匹配校验,并被捕获出现在结果字符串里面
(?:)跟(.)不同的地方在于,不被捕获作为子匹配返回.如果想要不捕获字符串值的话,(?=)和(?:)这两个都可以用.

```js
var data = 'windows 98 is ok'
console.log(data.match(/windows (?=\d+)/))
console.log(data.match(/windows (?:\d+)/))
console.log(data.match(/windows (\d+)/))
//["windows ", index: 0, input: "windows 98 is ok"]
//["windows 98", index: 0, input: "windows 98 is ok"]
//["windows 98", "98", index: 0, input: "windows 98 is ok"]

[...'Java6 Java7'.matchAll(/Java(?:6|7)/g)] 
// ["Java6", index: 0, input: "Java6 Java7", groups: undefined],["Java7", index: 6, input: "Java6 Java7", groups: undefined]
[...'Java6 Java7'.matchAll(/Java(?=6)/g)]
// ["Java", index: 0, input: "Java6 Java7", groups: undefined]
```

### 反向预查
- (?<=pattern) 零宽正向后行断言(zero-width positive lookbehind assertion)
  - 反向匹配。`(?<=J)a`，匹配紧跟字母J后面的a，结果J**a**va6 J**a**va7
- (?<!pattern) 零宽负向后行断言(zero-width negative lookbehind assertion)
  - 反向不匹配.`(?<!J)a`，不匹配紧跟字母J后面的a，结果Jav**a**6 Jav**a**7


### 先行(lookahead)与后行(lookbehind)的区别

```js
const re= /(?<=\D)[\d\.]+/,
    match1 = re.exec("123.45"),
    match2 = re.exec("12345");
console.log(match1 && match1[0]); //>> 45
console.log(match2 && match2[0]); //>> null
```

可以看到match1匹配到的是`45`,这是由于在`.`前面没有任何符合`\D`的匹配内容，它会一直找到符合`\D`的内容，也就是`.`然后返回后面的内容。而`match2`若是没有满足前面肯定反向断言的条件的话，则结果返回null

# RegExp 下的一些属性

| 属性               | 描述                                     |
| ------------------ | ---------------------------------------- |
| global             | RegExp 对象是否具有标志 g。              |
| ignoreCase         | RegExp 对象是否具有标志 i。              |
| multiline          | RegExp 对象是否具有标志 m。              |
| lastIndex or index | 一个整数，标示开始下一次匹配的字符位置。 |
| source             | 正则表达式的源文本。                     |

## lastIndex 属性

- 该属性存放一个整数，它声明的是上一次匹配文本之后的第一个字符的位置。
- 上次匹配的结果是由方法 RegExp.exec() 和 RegExp.test() 找到的，它们都以 lastIndex 属性所指的位置作为下次检索的起始点。这样，就可以通过反复调用这两个方法来遍历一个字符串中的所有匹配文本。
- 该属性是可读可写的。只要目标字符串的下一次搜索开始，就可以对它进行设置。当方法 exec() 或 test() 再也找不到可以匹配的文本时，它们会自动把 lastIndex 属性重置为 0。

提示和注释
**重要事项：不具有标志 g 和不表示全局模式的 RegExp 对象不能使用 lastIndex 属性。**
**提示：如果在成功地匹配了某个字符串之后就开始检索另一个新的字符串，需要手动地把这个属性设置为 0。**

栗子翻上去看 2.2.1. 参数 g 在 exec()方法的工作原理

# String 对象下的一些正则方法

## 方法：search(regexp)

**用途：** 检索与正则表达式相匹配的值，可以对比 String.indexOf(string,fromIndex)方法，但是不同的是这里可以传入一个正则表达式作为参数。
**参数：** 接受一个正则表达式作为参数

**返回值：**

- 匹配首字母的下标
- 没有匹配返回-1

**举例：**

```js
var str = 'Visit W3School!'
console.log(str.search(/W3School/)) //6
console.log(str.search(/w3school/)) // -1
```

## 方法：match(str|regexp)

**用途：** 找到一个或多个正则表达式的匹配。
**参数：** 接受一个字符串或者正则式作为参数。
**返回值：** 返回存放匹配结果的数组。该数组的内容依赖于 regexp 是否具有全局标志 g。

举例:

```js
var str = 'For more information, see Chapter 3.4.5.1'
var re = /(chapter \d+(\.\d)*)/i
var found = str.match(re)
console.log(found)
//["Chapter 3.4.5.1", "Chapter 3.4.5.1", ".1", index: 26, input: "For more information, see Chapter 3.4.5.1"]
```

这个例子的返回值可以看看，返回的数组的第一个值为正则式的匹配串，第二个值开始为()捕获的捕获串，这里的正则有两对小括号，所以应该有 2 个捕获串，就是返回值数组的第二个和第三个。倒数第二个参数为第一个捕获串的首字母的下标。倒数第一个参数为整个字符串。

### 带有 g 参数

```js
var str = '1 plus 2 equal 3'
console.log(str.match(/\d+/g)) //["1", "2", "3"]
```

### 综合起来

```js
var str = 'For more information, see Chapter 3.4.5.1 chapter'
var re = /(chapter \d+(\.\d)*)/gi
var found = str.match(re)
console.log(found) //["Chapter 3.4.5.1"]
```

**可以看到带有 g 参数的，返回值只有匹配串。**

## 方法：split(separator,howmany)

**用途：** 把字符串分割为字符串数组，String.split() 执行的操作与 Array.join 执行的操作是相反的。

**参数：**

- 参数 separator 为必需，字符串或正则表达式，从该参数指定的地方分割 string。
- 参数 howmany 为可选。该参数可指定返回的数组的最大长度。如果设置了该参数，返回的子串不会多于这个参数指定的数组。如果没有设置该参数，整个字符串都会被分割，不考虑它的长度。

**返回值：** 分割后的字符串数组。

**举例:**

```js
var str = 'How are you doing today?'
console.log(str.split(' ')) //["How", "are", "you", "doing", "today?"]
console.log(str.split('')) //["H", "o", "w", " ", "a", "r", "e", " ", "y", "o", "u", " ", "d", "o", "i", "n", "g", " ", "t", "o", "d", "a", "y", "?"]
console.log(str.split(' ', 3)) //["How", "are", "you"]
```

## 方法：replace(regexp,func)

**用途：** replace() 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。

**参数：**

- 第一个参数为规定子**字符串**或要替换的模式的 **RegExp 对象**。
- 第二个参数为一个**字符串**值。规定了替换文本或生成替换文本的**函数**。

从参数组合来看有四种组合，下面举例四种情况。

**返回值：** 处理后的字符串。

**举例:**

### 参数为字符串、字符串的替换功能

```js
var str = 'Visit Microsoft!'
console.log(str.replace('Microsoft', 'W3School')) //Visit W3School!
```

### 参数为正则表达式、字符串的更高级的替换功能

```js
var str = 'Visit Microsoft!'
console.log(str.replace(/Microsoft/, 'W3School')) //Visit W3School!
```

#### 特殊标识

replace方法的第二个参数可以使用美元符号$，用来指代所替换的内容。

- $&：匹配的子字符串
- $`：匹配结果前面的文本
- $'：匹配结果后面的文本
- $n：匹配成功的第n组内容，n是从1开始的自然数
- $$：指代美元符号$(转义)

```js
// $n：匹配成功的第n组内容，n是从1开始的自然数
"Hello, World!".replace(/o/, "21($&)12") // 'Hell21(o)12, World!'
"Hello, World!".replace(/o/, "21($`)12") // 'Hell21(Hell)12, World!'
"Hello, World!".replace(/o/, "21($')12") // 'Hell21(, World!)12, World!'
'hello world'.replace(/(\w+)\s(\w+)/, '$2 $1') // "world hello"
"Hello, World!".replace(/o/, "$$") // 'Hell$, World!'
"Hello, World!".replace(/o/, "$¥") // 'Hell$¥, World!'
```

### 参数为正则表达式、函数

```js
var str = '<p><a href="{0}">{1}</a><span>{2}</span></p>'
str.replace(/\{(\d+)\}/gi, function(a, b) {
  console.log(arguments)
})
//["{0}", "0", 12, "<p><a href="{0}">{1}</a><span>{2}</span></p>"]
//["{1}", "1", 17, "<p><a href="{0}">{1}</a><span>{2}</span></p>"]
//["{2}", "2", 30, "<p><a href="{0}">{1}</a><span>{2}</span></p>"]
```

这里可以看出，接受函数作为第二个参数的时候，函数会收到的参数：

- 第一个参数是正则表达式的匹配串
- 第二个是正则表达式的捕获串，实际上，中间的参数具体有多少个取决于正则表达式中子表达式的个数
- 倒数第二个参数是捕获到的部分的首字母在整个字符串中的位置索引，从 0 开始
- 最后一个参数是调用 replace()方法的字符串本身

## `?!` 零宽负向先行断言的实践
```bash
# 提示
# 1.匹配不含有EIC的
# 2.匹配含有-LC-|-CUF-|-GWLC-|-GPULC-|-CAF-的
# 如下，第一行含有EIC不符合，第二行符合

XA-XXQSEIC-0403-A18-H9850-LC-02
XJP-YYLR-0201-F05-H12504AF-GWLC-004
```

`?!xxx`可以匹配不含有xxx的情况, 如下需要精确匹配小写的javascript，而不是`JavaScript`或`javaScript`，可以发现其实我们就是不要大写Script而已，其其他都符合
```
Java
javascript
javaScript
JavaScript
```

代码如下
```js
['Java','javascript','javaScript','JavaScript'].map(_=>/^[Jj]ava((?!Script).)+$/.test(_))
// [false, true, false, false]
```
发现用到了`?!Script`

回到前面的，不包含`EIC`对应正则就是`(?!EIC).)*`, 所以大概可以这么写 `^((?!EIC).)*[(\-LC\-|\-CUF\-|\-GWLC\-|\-GPULC\-|\-CAF\-]+((?!EIC).)*$`

```js
['XA-XXQSEIC-0403-A18-H9850-LC-02','XJP-YYLR-0201-F05-H12504AF-GWLC-004'].map(_=>/^((?!EIC).)*[(\-LC\-|\-CUF\-|\-GWLC\-|\-GPULC\-|\-CAF\-]+((?!EIC).)*$/.test(_))
// [false, true]
```

# 应用
## 常见的使用
```js
const regexEnum = {
  intege: /^-?[1-9]*$/, //整数  
  intege1: /^[1-9]*$/, //正整数  
  intege2: /^-[1-9]*$/, //负整数  
  num: /^([+-]?)\d*\.?\d+$/, //数字  
  num1: /^([1-9]*|0)$/, //正数（正整数 + 0）  
  num2: /^-[1-9]*|0$/, //负数（负整数 + 0）  
  decmal: /^([+-]?)\d*\.\d+$/, //浮点数  
  decmal1: /^[1-9]*.\d*|0.\d*[1-9]\d*$/, //正浮点数  
  decmal2: /^-([1-9]*.\d*|0.\d*[1-9]*)$/, //负浮点数  
  decmal3: /^-?([1-9]*.\d*|0.\d*[1-9]*|0?.0+|0)$/, //浮点数  
  decmal4: /^[1-9]*.\d*|0.\d*[1-9]*|0?.0+|0$/, //非负浮点数（正浮点数 + 0）  
  decmal5: /^(-([1-9]*.\d*|0.\d*[1-9]*))|0?.0+|0$/, //非正浮点数（负浮点数 + 0）  
  email: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/, //邮件  
  color: /^[a-fA-F0-9]{6}$/, //颜色  
  url: /^http[s]?:\/\/([\w-]+\.)+[\w-]+([\w-./?%&=]*)?$/, //url  
  chinese: /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/, //仅中文  
  ascii: /^[\x00-\xFF]+$/, //仅ACSII字符  
  zipcode: /^\d{6}$/, //邮编  
  mobile: /^(13|15|18)[0-9]{9}$/, //手机  
  notempty: /^\S+$/, //非空  
  picture: /(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/, //图片  
  rar: /(.*)\.(rar|zip|7zip|tgz)$/, //压缩文件  
  date: /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/, //日期  
  qq: /^[1-9]*[1-9][0-9]*$/, //QQ号码  
  tel: /^(([0+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/, //电话号码的函数(包括验证国内区号,国际区号,分机号)  
  username: /^\w+$/, //用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串  
  letter: /^[A-Za-z]+$/, //字母  
  letter_u: /^[A-Z]+$/, //大写字母  
  letter_l: /^[a-z]+$/, //小写字母  
  idcard: /^[1-9]([0-9]{14}|[0-9]{17})$/ //身份证  
}
```

## 微信appid
腾讯的小程序appid是小程序的唯一id, 其实公众号也有appid. 跟身份证代表一个人一样, 小程序appid代表一个小程序. 

- 微信公众号APPID由18位数字和小写字母组成，并且以字母wx开头，字母和数字必须存在
- 微信小程序APPID由18位数字和小写字母组成，并且以字母wx开头，字母和数字必须存在

```js
/^wx(?=.*\d)(?=.*[a-z])[\da-z]{16}$/.test(`wxad3150031786d672`) // true
/^wx(?=.*\d)(?=.*[a-z])[\da-z]{16}$/.test(`wx77c2f24cf44a7eef`) // true 
```

## 数字分隔符

比如格式化数字 '123456789.12' 输出 '123,456,789.12'. 这在国际化场景很常见

那如何通过正则来格式化这种字符串呢? 答案是前瞻运算符 `?=`

```js
'123456789'.replace(/\B(?=(\d{3})+$)/g, ',') // '123,456,789'
```

第一层是 `?=`, 说明后面的匹配不消耗字符
第二层是 `$`, 也就是说从匹配需要末尾跟着结束符
第三层是 `(\d{3})+` 匹配3个数字为一组, 匹配多组
第四层是 `\B` 也就是不匹配边界, 

单词边界可以看下面的例子, 这种写法就是`cat`必须出现在字符串中间而不是开头和结尾

```js
const regex = /\Bcat\B/;
console.log("cat".match(regex)); // null
console.log("concatenation".match(regex)); // ['cat', index: 3, input: 'concatenation', groups: undefined]
console.log("a cat".match(regex)); // null
console.log("bobcat".match(regex)); // null
```

## 密码强度校验

- 6-12位
- 包含数字, 大写字母, 小写字母, 特殊字符($@,_.)之一

```js
/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$@,_.])[\da-zA-Z$@,_.]{6,12}$/.test('2aA.$1') // true
```

这里 `(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$@,_.])` 可以看成下面四组的集合, 都是任意字符`.*`, 只是其中包含的内容不一样. `?=`是前瞻运算符, 匹配不消耗字母(位置不移动)

- `(?=.*\d)`, 包含数字
- `(?=.*[a-z])`, 包含小写字母
- `(?=.*[A-Z])`, 包含大写字母
- `(?=.*[$@,_.])`, 包含特殊字符

而 `[\da-zA-Z$@,_.]{6,12}` 是最后实际匹配的过程, 要求符合要求的字符里6到12位长

# 新特性
## [u修饰符 && RegExp.prototype.unicode 属性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode)

u修饰符在ES2018也就是ES9后支持

引入用来正确的处理大于\uFFFF的 Unicode 字符。也就是说，会正确处理四个字节的 UTF-16 编码。

```js
const r1 = /^\uD83D/u;
const r2 = /^\uD83D/;

r1.test('\uD83D\uDC2A') // false
r2.test('\uD83D\uDC2A') // true

r1.unicode // false
r2.unicode // true
```

在引入u修饰符之后, `\p`Unicode 属性转义（Unicode Property Escapes）也可以生效。比如

```js
/\p{Script=Han}/u.test('汉') // true
/[\p{Script=Latin}&&[^\p{ASCII}]]/v.test('café') // true
```

`\p` 支持的参数类型有3种

1. General Categories（常用类别）
2. Binary Properties（布尔类属性）
3. Script 属性（字符所属书写系统）

### \p 的 General Categories（常用类别）

| 属性名              | 简写  | 描述                            |
|---------------------|-------|---------------------------------|
| `Letter`            | `L`   | 所有字母字符（大写、小写等）     |
| `Uppercase_Letter`  | `Lu`  | 大写字母                         |
| `Lowercase_Letter`  | `Ll`  | 小写字母                         |
| `Titlecase_Letter`  | `Lt`  | 首字母大写字母                   |
| `Modifier_Letter`   | `Lm`  | 修饰用字母，如 ˚、ʰ              |
| `Other_Letter`      | `Lo`  | 其他字母类（如汉字）              |
| `Mark`              | `M`   | 发音/音调标记（附加在主字符上）  |
| `Nonspacing_Mark`   | `Mn`  | 不占位标记（如重音符）           |
| `Spacing_Mark`      | `Mc`  | 占位标记                         |
| `Enclosing_Mark`    | `Me`  | 环绕字符的标记                   |
| `Number`            | `N`   | 所有数字字符                     |
| `Decimal_Number`    | `Nd`  | 十进制数字（如 0–9）             |
| `Letter_Number`     | `Nl`  | 如罗马数字 Ⅲ                    |
| `Other_Number`      | `No`  | 上标/分数等                      |
| `Punctuation`       | `P`   | 所有标点符号                     |
| `Connector_Punctuation` | `Pc` | 下划线类标点，如 `_`          |
| `Dash_Punctuation`  | `Pd`  | 连接线，如 `-`, `—`              |
| `Open_Punctuation`  | `Ps`  | 开括号类                         |
| `Close_Punctuation` | `Pe`  | 闭括号类                         |
| `Initial_Punctuation` | `Pi` | 开引号等                         |
| `Final_Punctuation` | `Pf`  | 闭引号等                         |
| `Other_Punctuation` | `Po`  | 其他标点                         |
| `Symbol`            | `S`   | 所有符号类字符                   |
| `Math_Symbol`       | `Sm`  | 数学符号，如 `+`, `=`           |
| `Currency_Symbol`   | `Sc`  | 货币符号，如 `$`, `¥`           |
| `Modifier_Symbol`   | `Sk`  | 修饰符号，如 `^`, `~`           |
| `Other_Symbol`      | `So`  | Emoji 等其他符号                 |
| `Separator`         | `Z`   | 空格、换行等                     |
| `Space_Separator`   | `Zs`  | 普通空格                         |
| `Line_Separator`    | `Zl`  | 行分隔符                         |
| `Paragraph_Separator` | `Zp` | 段落分隔符                      |
| `Other`             | `C`   | 控制符、未定义、私有用途字符     |
| `Control`           | `Cc`  | 控制字符（如 `\n`, `\t`）        |
| `Format`            | `Cf`  | 格式控制符（如 ZWJ）             |
| `Surrogate`         | `Cs`  | 代理对字符（UTF-16内部编码）     |
| `Private_Use`       | `Co`  | 私有区字符                       |
| `Unassigned`        | `Cn`  | 尚未定义的字符                   |


属性茫茫多，你说W3C不做事吧。但是人家某个特性干了这么多事😩

```js
/\p{Math_Symbol}/u.test('+') // true
/\p{Math_Symbol}/u.test('−') // 注意这里不是破折号而是数学的减号，'\u2212' 
/\p{Math_Symbol}/u.test('×') // true，注意不能是 *
/\p{Math_Symbol}/u.test('÷') // true，注意不能是 /
```

### \p 的 Binary Properties（布尔类属性）

| 属性名             | 含义 / 匹配内容                             |
|----------------------|--------------------------------------------|
| `Alphabetic`         | 是否为字母字符（含多语种）                  |
| `Uppercase`          | 是否为大写字母                              |
| `Lowercase`          | 是否为小写字母                              |
| `White_Space`        | 是否为空白字符（空格、换行、Tab等）         |
| `Hex_Digit`          | 是否为十六进制数字（0–9, A–F, a–f）         |
| `Dash`               | 是否为连接号（`-`、`—`等）                  |
| `Math`               | 是否为数学符号（如 `+`, `×`, `∑`）         |
| `Emoji`              | 是否为 Emoji 字符（😂, 🚀, 💡 等）          |
| `Emoji_Presentation` | 是否可作为 Emoji 呈现（部分字体敏感）       |
| `ID_Start`           | 是否可以作为变量名的开头字符（JS 变量）     |
| `ID_Continue`        | 是否可以作为变量名的组成字符（非开头）      |
| `Default_Ignorable_Code_Point` | 格式控制/零宽空格等               |
| `Pattern_Syntax`     | 是否为正则语法符号（如 `(`, `|`, `*`）     |
| `Pattern_White_Space`| 是否为正则空白字符（`\s` 中定义）          |

几个🌰

```js
/\p{White_Space}/u.test('\n') // true
/\p{Emoji}/u.test('🔥')       // true
/\p{Math}/u.test('∑')         // true
```

### \p 的 Script 属性（字符所属书写系统）

| Script 名称     | 说明                   | 示例字符        |
|------------------|------------------------|------------------|
| `Latin`          | 拉丁字母               | A, b, z          |
| `Han`            | 汉字（中文、日文、韩文用） | 中, 文, 漢       |
| `Hiragana`       | 日文平假名             | あ, い, う        |
| `Katakana`       | 日文片假名             | カ, タ, メ        |
| `Hangul`         | 韩文                   | 가, 나, 다        |
| `Cyrillic`       | 西里尔文（俄文等）     | Д, Ж, Я          |
| `Greek`          | 希腊文                 | α, β, Ω          |
| `Arabic`         | 阿拉伯文               | ش, م, ل           |
| `Devanagari`     | 天城文（印地语）       | क, म, अ           |
| `Hebrew`         | 希伯来文               | א, ב, ג           |
| `Thai`           | 泰文                   | ก, ข, ง           |
| `Bengali`        | 孟加拉文               | অ, আ, ই           |
| `Georgian`       | 格鲁吉亚文             | ა, ბ, გ           |
| `Ethiopic`       | 埃塞俄比亚文           | ሀ, ሁ, ሂ          |
| `Armenian`       | 亚美尼亚文             | Ա, Բ, Գ           |
| `Tibetan`        | 藏文                   | ཀ, ཁ, ག          |

语言在国际化中常用，可以多关注下。比如要求用户只能输入中文(包含简体中文和繁体中文)

```js
/\p{Han}/u.test('你')
/\p{Latin}/u.test('A')
```

## [y修饰符 && RegExp.prototype.sticky 属性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky)

除了u修饰符，ES6 还为正则表达式添加了y修饰符，叫做“粘连”（sticky）修饰符
y修饰符的作用与g修饰符类似，也是全局匹配，后一次匹配都从上一次匹配成功的下一个位置开始。不同之处在于，g修饰符只要剩余位置中存在匹配就可，而y修饰符确保匹配必须从剩余的第一个位置开始，这也就是“粘连”的涵义。

```js
var s = 'aaa_aa_a';
var r1 = /a+/g;
var r2 = /a+/y;

r1.exec(s) // ["aaa"]
r2.exec(s) // ["aaa"]

r1.exec(s) // ["aa"]
r2.exec(s) // null

r2. sticky // true
```

## s 修饰符：dotAll 模式
```js
/foo.bar/.test('foo\nbar')
// false
```

上面代码中，因为.不匹配\n，所以正则表达式返回false。
但是，很多时候我们希望匹配的是任意单个字符，这时有一种变通的写法。[^] 是一个字符类，它匹配除了空字符串之外的任何单个字符。这是因为在字符类 [] 内，^ 的否定作用不生效，而是表示匹配字符类中的任何字符。

```js
/foo[^]bar/.test('foo\nbar')
// true
```

这种解决方案毕竟不太符合直觉，ES2018 引入s修饰符，使得.可以匹配任意单个字符。
```js
/foo.bar/s.test('foo\nbar') // true
```

## v 修饰符：启用命名组与更严格语法

使用 `v` 修饰符后，正则可以支持交集和差集的运算

```js
// 交集运算
const reIntersaction = /[\p{Alphabetic}&&\p{Lowercase}]/v;
console.log(reIntersaction.test('a')); // true
console.log(reIntersaction.test('A')); // false
// 差集运算
const reSubtraction = /[a-z--[aeiou]]/v;
console.log(reSubtraction.test('b')); // true
console.log(reSubtraction.test('a')); // false
```

这个正则表示从 `\w` 所代表的字符集合中去除 `_` , 也就是差集运算。运算符号`--`表示差集运算，`&&` 表示交集运算。




## 引用某个“具名组匹配”
如果要在正则表达式内部引用某个“具名组匹配”，可以使用\k<组名>的写法。

```js
const reg = /^(?<word>[a-z]+)!\k<word>$/;
reg.test('abc!abc') // true
reg.test('abc!ab') // false
```

数字引用（\1）依然有效。

```js
const RE_TWICE = /^(?<word>[a-z]+)!\1$/;
RE_TWICE.test('abc!abc') // true
RE_TWICE.test('abc!ab') // false
```

这两种引用语法还可以同时使用。

```js
const RE_TWICE = /^(?<word>[a-z]+)!\k<word>!\1$/;
RE_TWICE.test('abc!abc!abc') // true
RE_TWICE.test('abc!abc!ab') // false
```