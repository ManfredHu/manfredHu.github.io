# Object.defineProperties 的实际作用（MEAN 开发 Model 层的写法）

![MEAN层次开发表示](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/mean-stack.png)

## Object.defineProperties 是什么？有什么用？

这个问题比较听起来可能比较难以理解，确实我也是在项目中遇到的才会去想。以前看到《高级程序设计》的时候，有这么一种东西，定义一个对象。
大概第几章忘了，看下下面的代码估计能想起来是什么。

```javascript
var User = {} //声明一个空对象
Object.defineProperties(User, {
  //填充对象属性
  _id: {
    writable: true, //设置属性是否可写，默认为true
    configurable: false, //设置属性是否可以配置，默认为true。当设置为false时不能用delete删除
    enumerable: false, //设置属性是否可以枚举，默认为true.即for-in循环对象的时候可以输出属性
    value: 0 //默认值
  },
  id: {
    set: function(value) {
      if (value > 0) {
        this._id = value //数据库设置的为主键从0开始递增
      }
    },
    get: function() {
      return this._id
    }
  }
})

var privateId = Object.getOwnPropertyDescriptor(User, '_id')
console.log(privateId.value) //0

var userId = Object.getOwnPropertyDescriptor(User, 'id')
console.log(userId.get()) //还没设置呢，输出undefined

userId.set(10) //设置id为10
console.log(userId.get()) //输出10，设置有效

userId.set(-10)
console.log(userId.get()) //输出10，设置无效
```

大概就是`Object.defineProperties`这个东西吧，可以定义属性。定义一个属性用的是`Object.defineProperty`。不过通常对象都是多个属性的啦，所以基本用的都是`Object.defineProperties`。

其实刚开始我看到这个属性觉得——嗯，有这个东西。但是具体哪里会用到，有什么作用，还真的没去思考太多。只是知道有这个东西，但是普通的前端开发，貌似也没怎么用到这个东西，直到——做项目的时候遇到了-\_-!!

## MEAN 开发 Model 层的写法

副标题扯到 MEAN 开发了，之前做的项目里面，前端用的是 AngularJS，后台用的是 ExpressJS+node.js
数据交互不用想都知道是 Ajax 啦。

所以从第一天开始就开开心心撸代码啦，嗯，差不多就这样。^\_^

写后台的时候遇到了几个坑爹的问题吧，首先是登陆模块。
AngularJS 用`$http`post 到`/loginData`一个表单到后台

比如是下面这样的

```javascript
var json = {
  username: 'ManfredHu',
  password: '123456'
}
```

后台用 ExpressJS 的路由监听这个 URI

```javascript
app.post('/loginData', function(req, res) {
  console.log('接受到login页面的登陆信息')
  //调用login控制器传入req,res
  UserCtrl.login(req, res)
})
```

这个 ExpressJS 的路由其实类似 JavaWeb 里面的`web.xml`那个配置 servlet 的东西。就是一个请求过来，你到底要调用哪个 Controller 到处理。
这里专门为 User 写了个 Controller 取名 UserCtrl，通过 CMD 的形式组织，exports 暴露了一个 login 的方法专门处理 request/response。

然后问题就坑爹了，前端数据的验证怎么做？如果直接将 JSON 传入`Dao`层执行数据库的查找等等的匹配操作。那么其实问题其实还挺大的，你要考虑如果有人专门来 POST 数据测试你的服务器呢？当然我相信大家都是好人不会去干这种事，不过从安全性来讲，应该是要有一层验证的，而且后面的`Dao`层也会接受一个对象去执行增删查改等等操作

**这里讲的是后台的数据验证**

所以上面的**Object.defineProperties**就派上用场了，应该要将这个`json`组装成一个 Model，且这个 Model 应该有类似 C#、Java 一样的私有属性 private、公有方法 public 等等。

C#的属性的概念其实相比字段就是多了一层过滤层，因为属性都是合法的字段。

```c
public class Student
{
    private string name;  //字段
    public string Name    //属性
    {
        set
        {
            name=value; //这里是给私有属性name赋值
        }
        get
        {
            return name; //这里取出私有属性name的值
        }
    }
}
```

Java 的类似，不过没有 C#属性的概念，所有的都称为方法。

```java
public class Student {
    private String name;
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
```

所以其实 JavaScript 要模仿这些传统的后台，也要有一个类似类的概念的东西——**Object.defineProperties**

上面的代码类似声明了一个类，定义了私有的属性`_id`,公有的方法 id,里面有`set`和`get`方法。
那其实思路就变得很简单了，将 POST 的 JSON 数据包装成 Model（这个过程会检验属性的正确性），然后对 Model 进行`DAO`操作。
JavaScript 模拟传统后台的东西就完全出来了。

当然其实这部分包装成 Model 的过程完全可以不考虑，但是验证的过程你要写在 Controller 或者其他地方，既然都要写的，那还不如像传统后台一样多一层 Model 层。
而且运行 node.js 的 Chrome 的 V8 解析器完全可以忽略**Object.defineProperties**的兼容性问题。

**综上所述**,**Object.defineProperties**在开发后台的时候，用处非常大。可以用来创建实体类。
