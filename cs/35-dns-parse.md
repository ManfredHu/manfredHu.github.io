# DNS解析和配置(dig nslookup)

![DNS](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/dns.png)

# 从面试题说起

经典的问题，用户在浏览器输入网址按下回车到网页呈现在用户面前中间经历了什么。
比如输入了`www.qq.com`，第一步肯定是本地查找 DNS 记录或者递归 DNS 服务器一级一级往上找，最后拿到一个 IP 地址。

> 所以 DNS 可以理解为，域名 => IP 地址 的过程。

# DNS 解析配置

![DNS记录](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/dns-parse-1.png)

我们可以看到，访问`www.manfredhu.com`和`manfredhu.github.io`最后返回的 IP 都是一样的。
我们看下我们配置的 DNS 解析配置。

![DNS解析](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/dns-parse-2.png)

可以看到只有两条记录，这里起作用的是下面那条

```bash
www	CNAME	默认	manfredhu.githu
```

## DNS 记录的含义

A记录和CNAM记录:
- A (Address) 记录是用来指定域名对应的 IP 地址记录。用户可以将该域名下的网站服务器指向到自己的 web server 上。同时也可以设置您域名的二级域名。
- CNAME：别名记录。这种记录允许您将多个名字映射到另外一个域名。通常用于同时提供 WWW 和 MAIL 服务的计算机。例如，有一台计算机名为“host.mydomain.com”（A 记录）。它同时提供 WWW 和 MAIL 服务，为了便于用户访问服务。


所以这里看 A 记录和 CNAME 记录是平等同级的，一个是指定 IP，一个可以指定这个域名是另一个域名的别名，访问这个域名相当于访问另一个域名。如上面，我们访问了`www.manfredhu.com`其实就是访问的`manfredhu.github.io`了。


> manfredhu.github.io 是 git page 生成的静态网页，经常用来做为项目介绍或者个人博客。具体的可以自行 Google 搜下，一般看后缀，如果是 github.io，一般都是 git page 页面。

但其实 A 记录和 CNAME 记录还是有点不太一样的。

比如这里`www.manfredhu.com`是要映射到`manfredhu.github.io`的，但是`manfredhu.github.io`其实也是个域名，最后还是要转化为 ip，如上图，其实也可以把添加 A 记录，把`www.manfredhu.com`解析到`185.199.111.153`。

但是这里因为`manfredhu.github.io`的解析不归我们控制可能会变化，所以这里填写 CNAME 记录的话会很稳定，因为我访问`www.manfredhu.com`走的还是`manfredhu.github.io`，github 如果改了 ip，我这里没感知的。

但是如果我添加 A 记录，把`www.manfredhu.com`解析到`185.199.111.153`，如果`185.199.111.153`这个 IP 的机器挂了，那我的网站就挂了。

但是 A 记录有它自己的好处，例如可以在输入域名时不用输入`www.`前缀

从 SEO 优化角度来看，一些搜索引擎如 alex 或一些搜索查询工具网站等等则默认是自动去掉 `www.`前缀来辨别网站，CNAME 记录是必须有如：WWW(别名)前缀的域名，有时候会遇到这样的麻烦，前缀去掉了默认网站无法访问。

### A记录和CNAME记录的区别

所以其实 A 记录和 CNAME 记录都有自己的作用，如果单纯的 git page 域名解析，即访问`www.manfredhu.com`你可以加下面这条记录

| 主机记录 | 记录类型 | 线路类型 | 记录值              |
| -------- | -------- | -------- | ------------------- |
| www      | CNAME    | 默认     | manfredhu.github.io |


如果访问的是`manfredhu.com`你可以加下面这条记录，这样的话访问`manfredhu.com`和`www.manfredhu.com`都会到`manfredhu.github.io|`去了。

| 主机记录 | 记录类型 | 线路类型 | 记录值              |
| -------- | -------- | -------- | ------------------- |
| @        | CNAME    | 默认     | manfredhu.github.io |


## dig 命令查看 DNS 解析过程

- dig 命令一般就用来看域名=>IP 这个过程的，可以自己打下`dig -help`看下. 比如 `nslookup quic.nginx.org`, 注意这里不能要协议
- window 可以使用 nslookup 命令.  比如 `nslookup quic.nginx.org`, 注意这里不能要协议


### 百度 DNS 一个有趣的现象

```bash
[root@VM_16_14_centos ~]# dig www.baidu.com

; <<>> DiG 9.9.4-RedHat-9.9.4-50.el7_3.1 <<>> www.baidu.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 2979
;; flags: qr rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;www.baidu.com.   IN A

;; ANSWER SECTION:
www.baidu.com.  764 IN CNAME www.a.shifen.com.
www.a.shifen.com. 12 IN A 61.135.169.121
www.a.shifen.com. 12 IN A 61.135.169.125

;; Query time: 0 msec
;; SERVER: 183.60.83.19#53(183.60.83.19)
;; WHEN: Thu Oct 25 15:27:35 CST 2018
;; MSG SIZE  rcvd: 101
```

你可以看到`www.baidu.com`CNAME 到一个`www.a.shifen.com`去了。关于这个域名有个很有趣的故事,戳[这里](https://www.zhihu.com/question/20100901)
