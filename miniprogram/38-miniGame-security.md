# 微信小游戏之单机游戏的安全

![微信小游戏](/images/miniGame.jpeg)

首先聊一下，微信小程序，想看安全算法之类的请直接跳到[这里](#单机游戏安全怎么做)

# 小程序安全问题的出现

微信跳一跳这个微信官方推出的 DAU 第一,1 点几亿的小游戏相信大家都玩过，微信用跳一跳游戏内植入广告的方式变现也是一个创新。
但是相信大家看到过很多刷子，有物理硬件辅助作弊的。如机械手+尺子量距离，或者牛逼点的，机械手+图像识别算法加上。

![跳一跳机械手作弊](/images/tiaoyitiao-jixieshou.jpg)

也有基于软件层面的，找到漏洞直接接口刷分数。

刷分软件可以看[这里](https://github.com/wangshub/wechat_jump_game)，当然现在应该被禁了。

张小龙在今年的微信小游戏上说过这么一段话:

> 跳一跳遭遇很多外挂，引发的两点思考
>
> - 第一方面，当我看到我的朋友用外挂打了一个很高的分的时候，我的意识里对他的信任度可能会降低一点点，朋友之间的信任会出现问题；
> - 另外一个角度来说，像在跳一跳这样一个小的游戏里面，如果一个用户看到里面有一堆外挂得了很高的分，对其他一些每天在练习，试图把自己的水平提高，而打一个高分的人就很不公平，他可能就没有动力继续去练习，继续超越自己个人的最高分数。所以这样一个行为，外挂行为其实会破坏整个系统的规则，并且让规则立即变得失效。

用户玩游戏是有攀比，虚荣心的心态在里面的，不然游戏公司也不会赚钱，游戏行业也不会成为暴利行业了。游戏策划会研究用户心理学，让你沉迷，投钱，花费时间跟精力在游戏上，其实大家都从赌场里面学到了很多东西，并用在各个领域。抖音看不到时间，你可以无限刷下去，类似的应用设计还有不少。大家可以多看看观察观察。

言归正传，来说说我们这方面，我们的游戏是一款推冰球的应用，基于 Laya+matterJS，matterJS 可以点[这里](http://brm.io/matter-js/)看下，那个时候 Laya 还没有内置物理引擎，当然现在已经 2.0 了，内置物理引擎，所以**欢乐推冰球这个游戏可能是国内最早基于Laya尝试引入物理引擎实现物理效果相关的微信小游戏**了。

![欢乐推冰球](/images/curling.png)

游戏规则很简单，用户通过将冰球推出到固定得分区域而获得分数，四个关卡下来累计用户的总得分，按照渠道（手Q，微信）分别做排行榜，排名前面的用户获得金钱奖励。

# 物理模型的放置

我们知道，游戏就是一堆贴图在屏幕的物理变换，最后呈现出来就是类似游戏的效果。但是如果游戏里面有物理模型的话，那么除了贴图这一层之外，与之相对的还有物理模型这一层。就如同别人看到你在走路，除了你身上传的衣服在动之外，其实很重要的是，你这个人的物理模型在运动，再把衣服贴上来，就是你整个人在运动，而且是要符合物理规律的运动。走路，是左右脚交替向前走。跑步，脚步交替的频率更快，运动姿势也不一样。

我们做一个有物理模型的游戏，一开始就会进入一个选择，物理模型（战斗逻辑、主要逻辑）是放在前端（客户端）还是后台（服务器）。

## 王者农药&帧同步

这就决定了不同的技术架构，比如王者荣耀，10 个游戏玩家联入了一台游戏服务器。客户端之间无通信，10 个客户端都联入服务器，数据通过服务器转发给其他用户。然后客户端每一帧（16.67ms）去渲染一次画面。但是客户端对用户的输入不是 16.67ms 同步一次，而是根据用户有无操作，操作的频率，用户所在网络的状态（wifi 情况会比 4G,3G 情况发包更多，也就是上传的数据会更多，用户就回觉得操作越流畅）去发送请求。

> 动画的原理就是残留在人眼的时间，一般我们以 60fps 为流畅来份，那么就是 1s/60fps = 16.67ms。也就是说你要 16.667ms 去渲染一个不同的东西（比如人走路），人眼就会觉得这是在运动，而不卡顿

服务器收到 10 个用户的操作指令，去转发数据，比如哪个用户击杀了主宰，获得了多少钱，坐标 XY 值，技能冷却等等。然后再把用户需要的数据推送给用户（不可能转发全局所有数据，太大了也不安全，而是你客户端在这个位置这个时间需要的数据，至于这个预判，大家可以自己想想）。

然后客户端收到服务器的推送之后，做一些平滑过渡，插值处理，让客户端的呈现自然一些不会出现瞬移之类的情况，平滑过度到服务器判定的数据状态去。

大家发现没有，这种情况，战斗逻辑和物理模型（击打小兵，地图任务之间的碰撞）是放在前台，后端只负责转发数据。

所以大家可以了解，为什么绝地求生吃鸡战场里面，有时候你打两枪过去不打，对方没有马上死亡，而是卡了一下才死。这个情况为什么会出现？

其实这个过程是有网络延迟的，你发包出去，可能不会马上收到回应，而是经过服务器转发，谁先打谁，打了多少血，死了没有，最后将判定条件发送到你和对方的机器上。

以上都是属于帧同步内容。也可以看看[这篇](https://zhuanlan.zhihu.com/p/36884005)了解下帧同步跟状态同步的区别。

## 单机游戏

单机游戏就比较有趣了，我们玩过很多单机游戏，比如仙剑之类的角色扮演。可以开作弊器各种 mod，比如 CS 可以本地玩。但是 CS 也可以上网对战。其实小游戏就是单机游戏，大家知道吗？

单机游戏因为开发成本低，开发效率快，也是有很多小游戏是这个类型的。但是我们无法避免的就是，单机游戏如果做排行榜，不可避免的会遇到刷子。

物理模型的作弊防范会很难做，比如跳一跳是用了成长模型，一个低分用户不太可能一下子打到高分这种模型。这种投入太高了，而且需要大量数据去学习这个成长的平滑性。一般小游戏也没有这么大数据量。

**但是我们可以在上报分数部分做安全，也是必须做的。**可以减少刷接口的可能性。

# 单机游戏安全怎么做

其实归结起来就是**游戏最后上报分数过程，如何让用户看不到明文的传输。减少用户刷接口的可能。**

## RSA 算法加密

数字签名并不是加密。他只是将传递的参数进行签名。服务器端可以验签。主要作用有 2 个：

> 1.保证数据不会被篡改 
> 2.保证请求的确是秘钥持有者发送的

RSA 算法可以生成公钥和私钥，我们在 node 服务器根据我们配置的 randomKey 和用户 uid 生成公钥和私钥。具体生成过程不透露了，就是生成一个 RSA 的公钥和秘钥。

RSA 的基本原理可以看下焜哥的[RSA 算法基础详解](https://www.cnblogs.com/hykun/p/RSA.html)

后台 node 端可以看这个库，[node-rsa](https://www.npmjs.com/package/node-rsa)
前端可以看这个库，[jsencrypt](https://www.npmjs.com/package/jsencrypt)

分两个库的原因是因为前端用 node-rsa 的话太重了，而用在 node 的话文件大小可以忽略。都是从本地磁盘读的。
而 jsencrypt 则不支持公秘钥都用 pkcs8 的，jsencrypt 默认的私钥是 pcks1 的，公钥则是 pcks8 的，这个可以从[网站的 demo](http://travistidwell.com/jsencrypt/demo/index.html)看到。

> 肉眼可以区分的方法就是：
> 开头声明有没有 RSA 的字样，有的话是 pkcs1 的，没有则是 pkcs8 的
>
> - pkcs1 的公钥以`-----BEGIN RSA PUBLIC KEY-----`开头，私钥以`-----BEGIN RSA PRIVATE KEY-----`开头
> - pkcs8 的公钥以`-----BEGIN PUBLIC KEY-----`开头，私钥以`-----BEGIN PRIVATE KEY-----`开头

结尾类似，都是看 RSA 字样有无区分 pkcs1 和 pkcs8。pkcs1 和 pkcs8 的区别可以看下[简单了解 PKCS 规范](https://razeen.me/post/introduce-pkcs.html)

具体代码如下

```js
const len = 512 //建议配置文件读取，可以动态控制

// **** 1.node生成一对密钥，把公钥传递给前端
const key = new NodeRSA({ b: len })
// JSEncrypt 的公钥是pkcs8，私钥是pkcs1
const pubKey = key.exportKey('pkcs8-public-pem')
const priKey = key.exportKey('pkcs1-private-pem')

console.log(pubKey)
console.log(priKey)

// **** 2.前端拿到公钥加密数据
const publicKey = pubKey // rsa算法每次得出的公钥也不一样
const gameInfo = { level: 2, ballInfo: {}, score: 66 }
const jencrypt = new JSEncrypt({ default_key_size: len }) // 实例化加密对象
jencrypt.setPublicKey(publicKey)
const encrypted = jencrypt.encrypt(JSON.stringify(gameInfo)) // 加密明文
console.log(encrypted) // rsa每次加密算法得出的密文也不一样

// **** 3.node拿私钥解密前端传来的密文
const newKey = new NodeRSA(priKey)
// 这句必须写，否则按照pkcs8处理，解密会失败
newKey.setOptions({ encryptionScheme: 'pkcs1' })
const result = newKey.decrypt(encrypted, 'utf8')
console.log(result) // {"level":2,"ballInfo":{},"score":66} 与我们定义的gameInfo一样
```

短小精悍其实很简单就几行代码。`newKey.setOptions({encryptionScheme: 'pkcs1'})`要注意下，必须写，否则按照 pkcs8 处理，解密会失败。

## 其他策略方法

比如玩家总共有 10 个球，那么我可以按照 10 个球\*10 分=100 分来设定总分上限，如果有人用超出这个数值来上报分数，那么就认为是作弊

还有的，每一关都上报分数到后台，后台进行累计。并与每次投完的球分布情况进行计算。校验分数的正确性。

这些都是基于游戏逻辑的测算，不同游戏方法不同，但是可以借鉴。

## protobuf

web 方面通常是明文传递的，但是在客户端来说，全部数据加密传输会好得多，一是安全性大大提高，二是传输效率也会很好。

### 什么是 Google Protocol Buffer？

Google Protocol Buffer( 简称 Protobuf) 是 Google 公司内部的混合语言数据标准，目前已经正在使用的有超过 48,162 种报文格式定义和超过 12,183 个 .proto 文件。他们用于 RPC 系统和持续数据存储系统。

Protocol Buffers 是一种轻便高效的结构化数据存储格式，可以用于结构化数据串行化，或者说序列化。它很适合做数据存储或 RPC 数据交换格式。可用于通讯协议、数据存储等领域的语言无关、平台无关、可扩展的序列化结构数据格式。目前提供了 C++、Java、Python 三种语言的 API。

可以举个栗子： [点击这里](http://game.fire2333.com/home/ac?action=/home/game/a/1663/g/200013)
打开控制台,websocket 服务，可以看到`Binary Frame (Opcode 2, mask)`
传递的都是二进制数据，而且是 ws 连接，安全性灰常高的。

![chrome开发工具看protobuf](/images/protobufExample.jpg)

可以发现都是二进制数据，如果你不知道如何解码，完全不知道是什么意思的。所以其实用上这东西，就可以不用上面说的 RSA 加密解密了。

举个 🌰，首先我们要定义一个格式，当然一般是 proto 后缀类型的，如果你想要 JSON 的也可以，但是个人感觉没必要，因为 JSON 类型的也是 proto 类型的转化过去的，所以直接点，就用 proto 类型的走起。

```js
// awesome.proto
package awesomepackage;
syntax = "proto3";

message AwesomeMessage {
    string awesome_field = 1; // becomes awesomeField
}
```

```js
// node
protobuf.load('awesome.proto').then(root => {
  if (err) throw err

  // 这里拿到定义的类型了
  var AwesomeMessage = root.lookupType('awesomepackage.AwesomeMessage')

  // 需要传递的数据
  var payload = { awesomeField: 'AwesomeString' }

  // 校验数据格式
  var errMsg = AwesomeMessage.verify(payload)
  if (errMsg) throw Error(errMsg)

  // 创建传递的消息
  var message = AwesomeMessage.create(payload) // or use .fromObject if conversion is necessary

  // 以下属于解码部分

  // 编码二进制
  var buffer = AwesomeMessage.encode(message).finish()

  // 解码二进制成消息
  var message = AwesomeMessage.decode(buffer)

  // 转化为对象
  var object = AwesomeMessage.toObject(message, {
    longs: String,
    enums: String,
    bytes: String
  })
  // 最后解码出来object  = { awesomeField: "AwesomeString" }
})
```
