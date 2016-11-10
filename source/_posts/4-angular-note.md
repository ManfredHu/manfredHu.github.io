---
title: AngularJS笔记
date: 2016-01-20 13:00:38
tags: 
    - AnuglarJS
    - 笔记
categories: 
    - 笔记
    - AngularJS
---

![](/images/angular.png)

## AngularJS兼容性

- 1.3.0版本放弃了IE8（官网有兼容的方法）
- 引入了单向数据绑定

## AngularJS的MVVM的原理
与传统的MVC不同，这里的view不是jsp或者aspx之类的。M也不一样，这里是ViewModel。
AngularJS通过**Binder/Data-binding engine**(通常称为Binder)将模板Template与ViewModel关联起来
且通过**dirty-checking**来实现实时的更新

## 指令的执行过程

### 加载阶段
从angular.js下载到客户端开始执行进入引导阶段，AngularJS会初始化自身需要的组件，查看`ng-app`边界，然后加载模块，使用依赖注入来注入依赖。

### 编译阶段(compile)
编译阶段模板将被搜索指令，然后指令会链接到AngularJS内置库或自定义指令代码相应的部分上。指令`detective`与作用域`scope`相结合产生实时视图。

### 链接阶段(link)
当引导和编译阶段完成之后，AngularJS进入运行时数据绑定阶段。这个阶段的特点是任何在作用域的更改都会反映在视图上，并且视图的更改也会更新到作用域。也称为双向绑定。

## AngularJS的MVVM是借助$scope实现的
- $scope有事件机制，如$emit("EventName")向上传播和$broadcast("EventName")向下传播
- $scope是一个普通的JS对象（POJO----plain old javascript object普通JS对象）
- $scope提供了一些工具方法 $watch() / $apply()
- $scope是表达式的执行环境（或者叫作用域）
- $scope是一个平行DOM结构的树形结构的对象
- 子$scope对象会继承父$scope上的属性和方法
- 每个应用都有且只有一个rootScope的对象，通常是在 ng-app 上
- 这样子层标签就可以继承父级标签的方法（个人猜测$scope是挂载在DOM结构的一组JS对象，映射关- 系，与jQ的data数据缓存原理类似）

## Angular默认的请求头

```
Accept: application/json,text/plain,
X-Requested-With: XMLHttpRequest
```

设置请求头的第一种方法，如果想把请求头设置到每一个发送出去的请求上，则可以将其设置为AngularJS的默认值，可以通过`$httpProvider.defaults.headers`配置对象来设置

```javascript
angular.module('MyApp',[]).config(function($httpProvider) {
    //删除AngularJS默认的X-Request-With头
    delete $httpProvider.default.headers.common['X-Requested-With'];
    //为所有GET请求设置DO NOT TRACK
    $httpProvider.default.headers.get['DNT'] = '1';
});
```
第二种方法是不将其作为默认值，则可以将头信息作为配置对象的一部分传递给$http服务


## Angular转换请求和响应

### 转换请求

如果请求的配置对象属性中包含JS对象，那么就把这个对象序列化成JSON格式

### 转换响应

如果检测到了XSRF（Cross Site Request Forgery）跨站请求伪造，则直接丢弃，如果检测到了JSON响应，则使用JSON解析器对其进行反序列化

如果想自定义转换规则则设置`transformRequest`和`transformResponse`作为key来配置转换函数

```
var module = angular.module('myApp');
module.config(function($httpProvider){
    $httpProvider.defaults.transformRequest = function(data) {
        //使用jQuery的param方法
        //把JSON数据转化成字符串形式
        return $.param(data);
    }
});
```














