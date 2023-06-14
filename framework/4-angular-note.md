# AngularJS 弃疗

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/angular.png)

## AngularJS 兼容性

- 1.3.0 版本放弃了 IE8（官网有兼容的方法）
- 引入了单向数据绑定

## AngularJS 的 MVVM 的原理

与传统的 MVC 不同，这里的 view 不是 jsp 或者 aspx 之类的。M 也不一样，这里是 ViewModel。
AngularJS 通过**Binder/Data-binding engine**(通常称为 Binder)将模板 Template 与 ViewModel 关联起来
且通过**dirty-checking**来实现实时的更新

## 指令的执行过程

### 加载阶段

从 angular.js 下载到客户端开始执行进入引导阶段，AngularJS 会初始化自身需要的组件，查看`ng-app`边界，然后加载模块，使用依赖注入来注入依赖。

### 编译阶段(compile)

编译阶段模板将被搜索指令，然后指令会链接到 AngularJS 内置库或自定义指令代码相应的部分上。指令`detective`与作用域`scope`相结合产生实时视图。

### 链接阶段(link)

当引导和编译阶段完成之后，AngularJS 进入运行时数据绑定阶段。这个阶段的特点是任何在作用域的更改都会反映在视图上，并且视图的更改也会更新到作用域。也称为双向绑定。

## AngularJS 的 MVVM 是借助\$scope 实现的

- $scope有事件机制，如$emit("EventName")向上传播和\$broadcast("EventName")向下传播
- \$scope 是一个普通的 JS 对象（POJO----plain old javascript object 普通 JS 对象）
- $scope提供了一些工具方法 $watch() / \$apply()
- \$scope 是表达式的执行环境（或者叫作用域）
- \$scope 是一个平行 DOM 结构的树形结构的对象
- 子$scope对象会继承父$scope 上的属性和方法
- 每个应用都有且只有一个 rootScope 的对象，通常是在 ng-app 上
- 这样子层标签就可以继承父级标签的方法（个人猜测\$scope 是挂载在 DOM 结构的一组 JS 对象，映射关- 系，与 jQ 的 data 数据缓存原理类似）

## Angular 默认的请求头

```
Accept: application/json,text/plain,
X-Requested-With: XMLHttpRequest
```

设置请求头的第一种方法，如果想把请求头设置到每一个发送出去的请求上，则可以将其设置为 AngularJS 的默认值，可以通过`$httpProvider.defaults.headers`配置对象来设置

```javascript
angular.module('MyApp', []).config(function($httpProvider) {
  //删除AngularJS默认的X-Request-With头
  delete $httpProvider.default.headers.common['X-Requested-With']
  //为所有GET请求设置DO NOT TRACK
  $httpProvider.default.headers.get['DNT'] = '1'
})
```

第二种方法是不将其作为默认值，则可以将头信息作为配置对象的一部分传递给\$http 服务

## Angular 转换请求和响应

### 转换请求

如果请求的配置对象属性中包含 JS 对象，那么就把这个对象序列化成 JSON 格式

### 转换响应

如果检测到了 XSRF（Cross Site Request Forgery）跨站请求伪造，则直接丢弃，如果检测到了 JSON 响应，则使用 JSON 解析器对其进行反序列化

如果想自定义转换规则则设置`transformRequest`和`transformResponse`作为 key 来配置转换函数

```js
var module = angular.module('myApp')
module.config(function($httpProvider) {
  $httpProvider.defaults.transformRequest = function(data) {
    //使用jQuery的param方法
    //把JSON数据转化成字符串形式
    return $.param(data)
  }
})
```
