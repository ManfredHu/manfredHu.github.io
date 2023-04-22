# promise 的错误处理

`Promise.all()`接受一个由 promise 任务组成的数组，可以同时处理多个 promise 任务，当所有的任务都执行完成时，`Promise.all()`返回 resolve，但当有一个失败(reject)，则返回失败的信息，即使其他 promise 执行成功，也会返回失败。可以用一句话来说`Promise.all()`，要么全有要么全无。注意这里的全部的概念。跟我一起念：粤语，全家富贵。

## 单一 promise 错误处理

先写函数 mock 一下 primise, resolve 的时候

### 正常 resolve

```js
const promiseResove = (n = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(n)
    }, n * 100)
  })
}

promiseResove().then(data => console.log(data)) // 0
```

### 没有 reject 处理只有 catch

不指定 reject 的处理

```js
const promiseReject = (n = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(n)
    }, n * 100)
  })
}
promiseReject()
  .then(data => console.log('resolve', data))
  .catch(err => console.error('something error', err)) // something error 0
```

这个也是正常的理解，一般懒得写 reject 的时候,catch 会捕获整条链的错误。

### reject 后 catch 不捕获

reject 的时候

```js
const promiseReject = (n = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(n)
    }, n * 100)
  })
}
promiseReject()
  .then(
    data => console.log('resolve', data),
    msg => console.info('reject', msg) // reject 0
  )
  .catch(err => console.error('something error', err))
```

这种可能有同学也会写出来，注意这里 reject 已经处理了 err，默认返回的是 undefined. 所以后面的 catch 没有执行。如果在 reject 里面又返回了一个`Promise.reject`。catch 才会执行

### reject 返回 Promise.reject 的 catch

不指定 reject 的处理

```js
const promiseReject = (n = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(n)
    }, n * 100)
  })
}
promiseReject()
  .then(
    data => {
      console.log('resolve', data)
      return data
    },
    errmsg => {
      console.info('reject', errmsg) // reject 0
      return Promise.reject(errmsg)
    }
  )
  .catch(err => console.error('something error', err)) // something error 0
```

## 多 promise 并发的处理

多 promise 并发，指的就是`Promise.all`方法

### 正常的 resolve

```js
const promiseResove = (n = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(n)
    }, n * 100)
  })
}

const promiseReject = (n = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(n)
    }, n * 100)
  })
}

const promiseArray = []
promiseArray.push(promiseResove(1))
promiseArray.push(promiseResove(2))
promiseArray.push(promiseResove(3))

const handlePromise = Promise.all(promiseArray)
handlePromise
  .then(function(values) {
    console.log('all promise are resolved', values) // all promise are resolved (3) [1, 2, 3]
  })
  .catch(function(reason) {
    console.log('promise reject failed reason', reason)
  })
```

### 有 reject 的情况

如文章开头所说，只要有一个 reject，`Promise.all` 就为 reject

```js
const promiseResove = (n = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(n)
    }, n * 100)
  })
}

const promiseReject = (n = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(n)
    }, n * 100)
  })
}

const promiseArray = []
promiseArray.push(promiseResove(1))
promiseArray.push(promiseReject(2))
promiseArray.push(promiseResove(3))

const handlePromise = Promise.all(promiseArray)
handlePromise
  .then(function(values) {
    console.log('all promise are resolved', values)
  })
  .catch(function(reason) {
    console.log('promise reject failed reason', reason) // promise reject failed reason 2
  })
```

### Promise.all 的 catch

这种写法与上面类似，因为`Promise.all`返回的还是一个 Promise。所以其实可以链式调用。

```js
const promiseResove = (n = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(n)
    }, n * 100)
  })
}

const promiseReject = (n = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(n)
    }, n * 100)
  })
}

const promiseArray = []
promiseArray.push(promiseResove(1))
promiseArray.push(promiseReject(2))
promiseArray.push(promiseResove(3))

Promise.all(promiseArray).catch(reason => {
  console.log('promise reject failed reason', reason) // promise reject failed reason 2
})
```

## 与 async/await 结合如何处理

除开 Promise 的各种 reject 处理和 catch 处理。async 返回的本来就是一个 promise。所以其实针对 async/await，可以有多种处理方法

### 正常的 await

```js
const promiseResove = (n = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(n)
    }, n * 100)
  })
}

const result = await promiseResove()
console.log(result) // 0
```

### 出现错误时候的 await

```js
const promiseReject = (n = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(n)
    }, n * 100)
  })
}

async function main() {
  const result = await promiseReject().catch(err => {
    console.log('发生了错误', err) // 发生了错误 0
    return 123
  })
  console.log(result) // 123
}

main()
```

此时 promise 的方式还是正常执行，但是注意这里 await 作为操作符，会等到后面的`promiseReject().catch`全部执行完成，而 catch 返回的又是一个 promise.await 一个 promise 会阻止执行，等待 promise 状态由 pending 转化为 resolve 或者 reject。所以这里 catch 到 error，而且 catch 返回了 123，所以这里 await 等到一个返回值 123。最后赋值给 result

可以思考一下，如果没有 catch，如何处理错误呢？

答案是 try/catch

### try/catch 与 async/await

```js
const promiseReject = (n = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(n)
    }, n * 100)
  })
}

async function main() {
  try {
    const result = await promiseReject()
    console.log(result) // 123
  } catch (err) {
    console.log('try/catch 到错误', err) // try/catch 到错误 0
  }
}

main()
```

所以这里 await 等到一个 reject，会被`try/catch`的 catch 处理到。