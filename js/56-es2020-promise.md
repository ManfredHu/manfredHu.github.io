# ES2020 Promise

Broswer API: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise

比较原始的API有这么几个，主要是`await/async`出来后大量的普及，现在已经原生支持了。一句话解释Promise就是：为了描述网页请求中中间的状态而设计的，为了减少函数嵌套和回调地狱而设计的语法糖。
你永远不会知道，不用Promise而是一直嵌套函数回调有多可怕，记得16年刚实习的时候，看到公司的代码，没有思维导图整理一遍那个业务逻辑嵌套请求回调有多绕。一层套一层，你以为你在第一层，其实你在第18层。

- Promise.resolve
- Promise.reject
- Promise.all

后面增加了
- Promise.allSettled
- Promise.race

## status
Promise的状态有下面几种

- pending: 初始状态
- fulfilled: 成功完成
- rejected: 失败
- Settled： Promise要么被完成，要么被拒绝。Promise一旦达成，它的状态就不再改变。简答说就是包含上面的fulfilled和rejected

## simple demo for kidding Promise.all
跟手写算法一样，手写不出来Promise的例子，那也是要被鄙视的
```js
const a = new Promise((resolve, reject ) => {
  setTimeout(() => {
    console.log('resolve')
    return resolve(2)
  }, 2000)
})
const b = new Promise((resolve, reject ) => {
  setTimeout(() => {
    return reject('error')
  }, 2000)
})
async function main() {
  const rst = await Promise.all([a, b]).then(result => {
    console.log('then', result)
  }).catch(err => {
    console.log('catch', err)
  })
}
main()
```

这里会输出下面的输入，第二个reject虽然catch住，但是大家会发现then是不会执行的，rst为undefined，所以这里就坑爹了，由此出现了`Promise.allSettled`

```
resolve
catch error
```

## Promise.allSettled
```js
const a = new Promise((resolve, reject ) => {
  setTimeout(() => {
    console.log('resolve')
    return resolve(2)
  }, 2000)
})
const b = new Promise((resolve, reject ) => {
  setTimeout(() => {
    return reject('error')
  }, 2000)
})
async function main() {
  const rst = await Promise.allSettled([a, b]).then(result => {
    console.log('then', result)
  }).catch(err => {
    console.log('catch', err)
  })
}
main()
```

输出如下，这里catch不执行了，不管是resolve还是reject都得到了，而且then执行了，重要的事情看这里!!then执行了,then执行了,then执行了
```
resolve
then [{0: {status: "fulfilled", value: 2}}, {status: "rejected", reason: "error"}]
```

## Promise.race
如字面意思，这是一个竞速API，就是有时间先后顺序的

```js
const a = new Promise((resolve, reject ) => {
  setTimeout(() => {
    console.log('resolve')
    return resolve(2)
  }, 2000)
})
const b = new Promise((resolve, reject ) => {
  setTimeout(() => {
    return reject('error')
  }, 1999)
})
async function main() {
  const rst = await Promise.race([a, b]).then(result => {
    console.log('then', result)
  }).catch(err => {
    console.log('catch', err)
  })
  console.log('rst', rst)
}
main()
```

输出如下，这里setTimeout为1999的先执行，返回reject后catch住了，之后a的Promise才执行，但是注意这里Promise已经先执行输出rst了，也就是说Promise里面有一个Promise状态已经为Settled了。且这里then永远不会执行
```
catch error
rst undefined
resolve
```