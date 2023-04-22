# 微信开发工具使用 vue-devtools

Vue Devtools 是 Vue 官方提供的浏览器插件，可以查看挂载在对应组件的属性。类似 Chrome 开发工具查看元素，最大的功能其实还是查看组件结构和数据。业务开发来说的话一般开发大部分时间都是在看接口，对数据。所以调试工具可以大大提高开发效率

微信开发工具一般我们会用来调试微信的项目，因为登陆态如果是微信的，不用微信开发工具调试就会出现引导到微信打开的情况。

## 安装@vue/devtools

推荐全局安装

```bash
npm install -g @vue/devtools
```

## 运行

```bash
vue-devtools
```

启动后会默认在 8098 端口开启调试工具，之后就是链接项目代码到调试工具上。

## 链接调试工具

### 方法一

在`<head>`标签添加如下代码，就是如果是开发模式就链接 8098 端口的脚本

```html
<% if (NODE_ENV === 'development') { %>
<script src="http://localhost:8098"></script>
<% } %>
```

自定义 IP 和端口可以看[这里](https://github.com/vuejs/vue-devtools/blob/master/shells/electron/README.md)

### 方法二

whistle 是一个代理工具，类似 fiddle，具体可以看[官方文档](https://wproxy.org/whistle/rules/htmlAppend.html)

方法二利用 whistle 的 htmlAppend 载入脚本，譬如

```
xxxxx/index.html http://127.0.0.1:8090/index.html htmlAppend://{vueDevtools.html}
```

vueDevtools.html

```
<script src="http://localhost:8098"></script>
```

## 效果

![vue-devtools in 微信开发工具](https://manfredhu-1252588796.cos.ap-guangzhou.myqcloud.com/1562404842_94_w5006_h2828.png)
