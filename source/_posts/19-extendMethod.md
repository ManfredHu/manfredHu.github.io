---
title: 对象深复制
date: 2016-06-14 22:59:03
tags:
    - JavaScript
    - 随笔
    - jQuery
    - Zepto
categories:
    - 随笔
    - JavaScript
---

> 作者：ManfredHu
> 链接：http://www.manfredhu.com/2016/06/14/19-extendMethod
> 声明：版权所有，转载请保留本段信息，否则请不要转载

![extend](/images/extend.png)

# 对象深复制
这里主要举例jQuery的`$.extend`方法，首先是对象的深复制的背景：对象和数组是引用的，所以如果你用

```javascript
var arr = [1,2,3,4,5];
var arr2 = arr;
arr2.push(6);
console.log(arr); //[1, 2, 3, 4, 5, 6]
console.log(arr2); //[1, 2, 3, 4, 5, 6]
```

但是有时候这不是我们要的结果，我们要将arr缓存起来，在某个时候重新还原arr为原来的值。这个时候就坑爹了，要复制整个对象或者数组。这个时候深复制就来了。

如果你不用jQuery的，你要自己写的话，还真的挺麻烦的。
jQuery的`$.extend`方法的几种调用方法

1. $.extend(object1)直接扩展jQuery
2. $.extend(target [,object1] [,object2])复制不递归
3. $.extend([deep], target, object1 [,objectN])递归复制

这里的`deep`是一个`Boolean`的值


## 1. $.extend(object1/function)直接扩展jQuery
```javascript
var object1 = {
  apple: 0,
  banana: { weight: 52, price: 100 },
  cherry: 97
};
 
// Merge object2 into object1
$.extend( object1);
 
// Assuming JSON.stringify - not available in IE<8
console.log($.apple) //0
console.log($.banana) //Object {weight: 52, price: 100}
console.log($.fn.cherry) //undefined
console.log($.banana === object1.banana); //true
```

把对象的属性copy到$下了，这里的$可能是`Zepto`或者`jQuery`，一样的。
默认不会递归复制，这里可以看到`banana`还是复制的引用。
`$.extend`这种写法jquery自己也用的很多，可以看到其实代码的后面一堆的`$.extend`或者是`$.fn.extend`这种写法，包括插件也用的很多。

## 2. $.extend(target [,object1] [,object2])复制不递归
```javascript
var object1 = {
  apple: [0],
  banana: { weight: 52, price: 100 },
  cherry: 97
};
var object2 = {
  banana: { price: 200 },
  durian: 100,
  egg: [1,2,3,4]
};

// Merge object2 into object1
$.extend( object1, object2 );

console.log(JSON.stringify( object1 )); 
//{"apple":[0],"banana":{"price":200},"cherry":97,"durian":100,"egg":[1,2,3,4]}

console.log(object1.egg === object2.egg); 
//true
```

这里将`object2`的属性合并到了`object1`中，`object2`和`object1`共有的属性会直接覆盖`object1`的属性，没有的会合并到`object1`里面。没有递归深层的属性，就是简单的复制属性而已。


## 3. $.extend([deep], target, object1 [,objectN])递归复制
```javascript
var object1 = {
  apple: [0],
  banana: { weight: 52, price: 100 },
  cherry: 97
};
var object2 = {
  banana: { price: 200 },
  durian: 100,
  egg: [1,2,3,4]
};

// Merge object2 into object1
$.extend(true, object1, object2 );

console.log(JSON.stringify( object1 )); 
//{"apple":[0],"banana":{"weight":52,"price":200},"cherry":97,"durian":100,"egg":[1,2,3,4]}

console.log(object1.egg === object2.egg); 
//false
```
这里传入了一个`true`的参数开启递归深复制，`object1`和`object2`的属性不会直接拿个引用过去，而是检查不同的地方，将相同的地方覆盖，没有的地方复制，引用的对象数组也被拷贝了一份过去，而不是拷贝引用而已。

## 4.没有源码你说啥呢？

```javascript
// 对$.fn.extend添加方法，之后将引用赋给$.extend
jQuery.extend = jQuery.fn.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {}, //target是最后返回的对象，如果没有就创建一个对象
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
        deep = target;

        // skip the boolean and the target
        target = arguments[ i ] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
        target = {};
    }

    // extend jQuery itself if only one argument is passed
    if ( i === length ) {
        target = this;
        i--;
    }

    for ( ; i < length; i++ ) {
        // Only deal with non-null/undefined values
        if ( (options = arguments[ i ]) != null ) {
            // Extend the base object
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];

                // Prevent never-ending loop
                if ( target === copy ) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && jQuery.isArray(src) ? src : [];

                    } else {
                        clone = src && jQuery.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[ name ] = jQuery.extend( deep, clone, copy );

                // Don't bring in undefined values
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};
```

对象的属性复制是分开的，boolean,number,string这三个和object,array处理是不一样的。

