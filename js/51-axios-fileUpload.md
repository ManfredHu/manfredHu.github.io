# axios 文件上传的坑

[axios](https://github.com/axios/axios)是一个 http 调用库，随着 Vue 的作者尤雨溪放弃`vue-resource`而投入 Axios 的怀抱而被大家熟知，但是其实还是有很多坑的

基本用法各个 http 库都差不多，主要说坑的地方。类似 get/post 的用法大家看下文档基本就知道了

故事起源于一场浪漫的邂逅，某天在写一个发布工具，本着不限包大小怎么爽怎么用的逻辑，直接上手了[request](https://github.com/request/request)。完美运行没有 bug，唯一有点遗憾的就是不支持 promise 要自己写。

某天灵机一动，处女座的心里犯做，想要换成支持 promise 的库耍耍。一顿操作猛如虎，找到了 request-promise，写法大同小异。参数完美匹配。好了，TMD 居然跪了。。。

嗯，这个库好像很好，但是不熟悉，算了，我还是用回熟悉的 axios。毕竟写法都烂熟于心了。

说换就换，换完后发现，前端发出了请求，后台没收到文件。一句 MMP 不知道该不该说，遂 google 一波。结果发现大家走的路都差不多，具体如[关于 axios 在 node 中的 post 使用](https://cnodejs.org/topic/57e17beac4ae8ff239776de5)所写。遇到的问题一摸一样。

我们复习下 post 请求的几种模式，根据`Content-Type`的设置不同有几种选择

- application/x-www-form-urlencoded 默认表单提交形式
- multipart/form-data 不对字符编码，在使用包含文件上传控件的表单时，必须使用该值。
- application/json 传递的是 JSON 数据
- text/plain 空格转换为 "+" 加号，但不对特殊字符编码
- text/xml

其实对应的 curl 命令也是不一样的，可以看[这里](https://ifttl.com/send-http-post-request-with-curl/)

## application/x-www-form-urlencoded

这种就是浏览器默认的表单提交形式，如果不设置[`enctype`属性](https://www.w3school.com.cn/tags/att_form_enctype.asp)，参数会以`hello=world&abc=123`的形式传递，跟 get 很像，如

```
POST http://www.example.com HTTP/1.1
Content-Type: application/x-www-form-urlencoded;charset=utf-8

title=test&sub%5B%5D=1&sub%5B%5D=2&sub%5B%5D=3
```

## application/json

就是以 JSON 数据的形式传输，如

```
var data = {'title':'test', 'sub' : [1,2,3]};
$http.post(url, data).success(function(result) {
    ...
});
```

最终发送的请求是：

```
POST http://www.example.com HTTP/1.1
Content-Type: application/json;charset=utf-8

{"title":"test","sub":[1,2,3]}
```

## text/plain

如上所述，空格转换为 "+" 加号，但不对特殊字符编码。就是传输的文本，不做编解码，数据都是普通文本

## text/xml

不想多说，很少用了，用到再去查吧，写了也记不住

## multipart/form-data

常用于文件上传，也可以文件和表单数据一起 post 上传。万金油的传输方式，但是坑比较多，趟过了坑就爽歪歪。本文就是解决这种模式下的上传方式的坑

axios 默认的`Content-Type`是`'Content-Type': 'application/x-www-form-urlencoded'`，可见于[https://github.com/axios/axios/blob/master/lib/defaults.js#L7](https://github.com/axios/axios/blob/master/lib/defaults.js#L7)

1. 当检测到 post 数据是 URL 的时候，修改为为`'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'`
2. 当检测到 post 数据是 Object 的时候，修改为为`'Content-Type': 'application/json;charset=utf-8'`
3. axios 没有内置 FormData 支持，需要的同学自己引入对应模块如[form-data](https://www.npmjs.com/package/form-data)

### form-data 的秘密

众所周知，TCP 传输是可靠的，包是有序的，传送者会把包打上 1234 的序号传输，接受者也会在收到包后按照 1234 的顺序排好。但是包于包之间是有分割的，特别是在传输文件这种，大小不确定，可能是 1K，也可能是 100M 的情况下。请求是需要分包的，而 form-data 就帮你做了这部分工作。

```
{
    method: 'POST',
    url: '/',
    header: {
        host: '127.0.0.1:3000',
        'content-type': 'multipart/form-data; boundary=--------------------------949095406788084443059291',
        'content-length': '186610',
        connection: 'close'
    }
}
```

boundary 就是分割上传文件部分的参数，同时不只是文件部分，参数部分也是通过 boundary 分割，可以看下面

```
"----------------------------987225910971603516694680\r\nContent-Disposition: form-data; name=\"tid\"\r\n\r\n",
"MC5d70503cbae320002x",
null,
"----------------------------987225910971603516694680\r\nContent-Disposition: form-data; name=\"env\"\r\n\r\n",
"idc",
null,
"----------------------------987225910971603516694680\r\nContent-Disposition: form-data; name=\"desc\"\r\n\r\n",
"",
null,
"----------------------------987225910971603516694680\r\nContent-Disposition: form-data; name=\"local_0\"; filename=\"addAddress.112bf494.js\"\r\nContent-Type: application/javascript\r\n\r\n",
		{
			"source": {
				"_readableState": {
					"objectMode": false,
					"highWaterMark": 65536,
					"buffer": {
						"head": null,
						"tail": null,
						"length": 0
					},
					"length": 0,
					"pipes": null,
					"pipesCount": 0,
					"flowing": false,
					"ended": false,
					"endEmitted": false,
					"reading": false,
					"sync": true,
					"needReadable": false,
					"emittedReadable": false,
					"readableListening": false,
					"resumeScheduled": false,
					"paused": true,
					"emitClose": false,
					"destroyed": false,
					"defaultEncoding": "utf8",
					"awaitDrain": 0,
					"readingMore": false,
					"decoder": null,
					"encoding": null
				},
				"readable": true,
				"_events": {},
				"_eventsCount": 3,
				"path": "/Volumes/guo/xxx/dist/js/addAddress.112bf494.js",
				"fd": null,
				"flags": "r",
				"mode": 438,
				"end": null,
				"autoClose": true,
				"bytesRead": 0,
				"closed": false
			},
			"dataSize": 0,
			"maxDataSize": null,
			"pauseStream": true,
			"_maxDataSizeExceeded": false,
			"_released": false,
			"_bufferedEvents": [
				{
					"0": "pause"
				}
			],
			"_events": {},
			"_eventsCount": 1
		},
		null,
		"----------------------------987225910971603516694680\r\nContent-Disposition: form-data; name=\"remote_0\"\r\n\r\n",
		"/data/xxx/dist/js/addAddress.112bf494.js",
		null,
        ……
```

最后记录下本次趟坑结果

```js
const FormData = require('form-data')
const fileData = new FormData()

function getHeaders = form => {
  return new Promise((resolve, reject) => {
    form.getLength((err, length) => {
      if (err) reject(err)
      // 合并两个报头如
      // 'Content-Length': 2082,
      // 'content-type': 'multipart/form-data; boundary=--------------------------328780933148383978239325'
      let headers = Object.assign({
        'Content-Length': length
      }, form.getHeaders())
      resolve(headers)
    })
  })
}

const formData = {
  type: 1
}

// 这里是合并表单数据到formData里面，因为也是boundary分割，所以也是append方法
for (let i in formData) {
  fileData.append(i, formData[i])
}

const fileLsit = [
  [
    '/Volumes/guo/xxx/dist/js/addAddress.112bf494.js',
    '/data/xxx/dist/js/addAddress.112bf494.js'
  ],
  [
    '/Volumes/guo/xxx/dist/js/app.9ff8bcee.js',
    '/data/xxx/dist/js/app.9ff8bcee.js'
  ]
]
fileLsit.forEach(function(item) {
  if (item[1]) {
    fileData.append('local_' + m, fs.createReadStream(item[0]))
    // formData['local_' + m] = fs.createReadStream(item[0])
    // 修复windows下路径问题，如
    // 因linux/macos下path.sep为'/'(代码正常)
    // windows下path.sep为'\'
    fileData.append('remote_' + m, item[1].split(path.sep).join('/'))
    m++
  }
})

const headers = await getHeaders(fileData)
axios.post(`http://host:port/path`, fileData, {
  headers
}).then(({data}) => {
  if (+data.retCode === 0) {
    // 成功
  } else {
    // 失败
  }
}, (err) => {
  // 失败
})
```

# 参考

- [关于 axios 在 node 中的 post 使用](https://cnodejs.org/topic/57e17beac4ae8ff239776de5)
- [四种常见的 POST 提交数据方式](https://imququ.com/post/four-ways-to-post-data-in-http.html)
- [使用 curl 发送 POST 请求的几种方式](https://ifttl.com/send-http-post-request-with-curl/)
