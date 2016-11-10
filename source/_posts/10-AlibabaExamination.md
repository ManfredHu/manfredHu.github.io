---
title: 2015年阿里巴巴校招题目
date: 2016-03-24 20:17:37
tags: 
    - 杂文
categories: 
    - 随笔
    - JavaScript
---



![Alibaba](/images/alibaba.jpg)


以下题目是阿里巴巴2015校招的题目，纯粹个人恶趣味发作写着玩的。
有错的地方欢迎联系交流^_^

```javascript
//第一题
var array1 = [1,2];
var array2 = array1;
array1[0] = array2[1];
array2.push(3);
console.log(array1) //[2 2 3]
console.log(array2) //[2 2 3]
```

```javascript
//第二题
function a(x, y) {
    return function() {
        y = function() {
            x = 2;
        };
        var x = 3;
        y();
        console.log(x); //2
    }.apply(this.arguments);
}

a();
```


```javascript
//第三题
var name = 'World!';

(function() {
    if(typeof name === 'undefined') {
        var name = 'Jack';
        console.log('Goodbye' + name); //Goodbye Jack
    }else{
        console.log('Hello' + name);
    }
})();
```

```javascript
//第四题
下面那些语句的结果是true

Function instanceof Object //true
Object instanceof Function //true
typeof Object.prototype === 'object' //true
typeof Function.prototype === 'object' //false
```

```javascript
//第六题
一个页面存在A元素和B元素;B元素浮在A元素之上;在B元素上绑定了touchstart事件，在touchstart事件处理函数中的哪些操作会导致A元素触发click事件？（这里是HTML5的点击穿透BUG，click事件会在touchstart和touchend后面发生，所以如果在touchstart将B元素移除则A元素会受到click触发）

A.设置B元素CSS属性display为none //Yes
B.设置B元素CSS颜色
C.将B元素从DOM树上删除 //Yes
D.设置B元素CSS属性visibility为hidden
```

```javascript
//第八题
编写一个javascript函数，可以在页面上异步加载js,在加载结束后执行callback，并在IE和Chrome下都能执行

//方法一
function loadScript(url,callback) { 
    //兼容IE和Chrome获取XMLHttpRequest对象
    var xhr = (function() {
        if(window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }else if(window.ActiveXObject) {
            return new ActiveXObject('Microsoft.XMLHTTP');
        }else{
            throw new Error("loadScript():XMLHttpRequest Init Error");
        }
    })();
    
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4) {
            if((xhr.status >= 200 && xhr.status < 300 ) || xhr.status == 304){
                callback();    
            }
        }
    }

    //用GET方式异步加载JavaScript代码
    xhr.open('GET',url,true);

    xhr.send(null);
}

//方法二
function loadScript(url, callback) { //同步

    var script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState) { //IE
        script.onreadystatechange = function() {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function() {
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

```

```javascript
//第十题
//为字符串实现一个render方法，实现下面的变量替换功能
(function() {

    String.prototype.render = renderFunc;

    function renderFunc(obj) {
        if(typeof obj !== 'object') throw new Error('The arguments must be obj');

        return this.replace(/\$\{([^}]+)\}/gi, function(a, b) {
            //这里的a是 ${name}
            //b是name
            return obj[b] ? obj[b] : '';
        });
    }

    var greeting = 'my name is ${name},age ${age}';
    var result = greeting.render({
        name: 'XiaoMing',
        age: 11
    });
    console.log(result); //my name is XiaoMing,age 11
})();
```

```javascript
//第十二题
//用JS实现随机选取10-100之间的不同的10个数字，存入一个数组并降序排序
(function() {
    function creatNumber(num) {
        if(typeof num !== 'number') return;

        var arr = [];
        for (var i = 0; i < num; i++) {
            arr.push(parseInt(Math.random() * 90 + 10));
        }
        return arr;
    }
    //降序排列
    function sortOrder(a,b) {
        return b-a;
    }

    function getIsArray() {
        return Array.isArray ? Array.isArray : function(arr) {
            return Object.prototype.toString.call(arr).slice(8, -1) === 'Array';
        }
    }

    var arr = creatNumber(10);
    var isArray = getIsArray();
    if(!isArray(arr)) throw new Error("init Array Error");
    console.log(arr.sort(sortOrder));
})();
```




