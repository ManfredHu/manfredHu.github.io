---
title: string.Replace用法
date: 2016-03-06 10:45:26
tags: 
    - JavaScript
    - 笔记
categories: 
    - 笔记
    - JavaScript
---


![查找替换](/images/replace.png)

> replace() 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。

```javascript
var str="Manfred Hu"
document.write(str.replace(/Manfred/, "WenFeng")); //页面输出WenFeng Hu
```

这是比较基本的用法，还有一种是第二个参数不是`"WenFeng"`而是一个函数的时候。

```javascript
//define
(function(window){
    //构造函数fn
    function fn(str){
        this.str=str;
    }

    fn.prototype.format = function(){
        var arg = arguments;
        return this.str.replace(/\{(\d+)\}/ig,function(a,b){
             return arg[b]||"";
      });
    }
    window.fn = fn;
})(window);
 
//use
(function(){
    var t = new fn('<p><a href="{0}">{1}</a><span>{2}</span></p>'); //类似参数化的输出
    console.log(t.format('http://www.alibaba.com','Alibaba','Welcome')); //<p><a href="http://www.alibaba.com">Alibaba</a><span>Welcome</span></p>
})();
```

你可以能会奇怪这里`a和b`到底是什么。分析下：

1. 两个都是立即执行函数，所以顺序执行先定义后执行。fn.prototype.format是添加在原型的方法，可以让所有实例共享，然后向全局环境window挂载fn
2. fn是全局的构造函数，下面一个立即执行函数创建了一个实例，传入字符串为参数，然后用console.log()输出调用format的结果
3. format函数执行，传入三个参数。到了原型的format函数的执行
4. arg为arguments[3],是上面传来的三个参数。this为`var t = new fn('<p><a href="{0}">{1}</a><span>{2}</span></p>');`的t
5. 因为正则式有ignore和global，所以可以全局匹配并且忽略大小写。重点来了
6. 这里的a是匹配串，b是捕获串，返回值会用来替换匹配串

这里记录下程序执行过程。

1. a为{0},b为0。返回值为arg[0]就是http://www.alibaba.com
2. 因为是全局匹配，所以有第二次替换匹配串。
3. a为{1},b为1。返回值为arg[0]就是Alibaba
4. 省略

replace后面是function的用法比较少见，有第二个参数的就更少见了。

这里顺手输出了replace中function的arguments来看看。

```javascript
arguments
["{1}", "1", 17, "<p><a href="{0}">{1}</a><span>{2}</span></p>"]
```

所以function有四个参数，分别是

**stringObject.replace(regexp/substr,replacement)**

1. 匹配串 
2. 捕获串
3. 匹配串(这里是从'{'开始)在 stringObject 中出现的位置
4. 原来的字符串

> 注意：ECMAScript v3 规定，replace() 方法的参数 replacement 可以是函数而不是字符串。在这种情况下，每个匹配都调用该函数，它返回的字符串将作为替换文本使用。该函数的第一个参数是匹配模式的字符串。接下来的参数是与模式中的子表达式匹配的字符串，**可以有 0 个或多个这样的参数**。接下来的参数是一个整数，声明了匹配在 stringObject 中出现的位置。最后一个参数是 stringObject 本身。
