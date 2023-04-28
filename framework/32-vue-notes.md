# 对Vue的理解

![Vue备忘笔记](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/vue.jpeg)

本文主要记录一些比较容易遗忘的知识点，方便后面查阅。如果对你有帮助，那不胜荣幸。

## 全局视角
vue整体来看可以分为两部分，一部分是将`.vue`文件template编译为render function，就是render里h的写法，这个跟React的JSX最后编译为render function其实是一样的。其次是data经过处理后变为响应式的reactivity，对其的变化会自动更新到视图里，而react的话，单向数据流下需要强制更新update一下。这一块在Vue2/3都是一样的思路

- template -> 编译 -> render function
- data -> reactivity -> reactivity

## Vue3对比Vue2响应式性能提升
通过Proxy+Reflect实现响应式拦截，其中proxy捕获器有这么几个


- #### has捕获器 **has(target, propKey) **拦截操作如  **propKey in proxy**
- #### get捕获器 **get(target, propKey, receiver)**
- #### set捕获器 **set(target,propKey, value,receiver)**

```
/* 深度get */
const get = /*#__PURE__*/ createGetter()
/* 浅get */
const shallowGet = /*#__PURE__*/ createGetter(false, true)
/* 只读的get */
const readonlyGet = /*#__PURE__*/ createGetter(true)
/* 只读的浅get */
const shallowReadonlyGet = /*#__PURE__*/ createGetter(true, true)

// 对应createReactive的Reflect.get的getter
function createGetter(isReadonly = false, shallow = false) {
  return function get(target: object, key: string | symbol, receiver: object) {
    const res = Reflect.get(target, key, receiver)
    /* 浅逻辑 */
    if (shallow) {
      !isReadonly && track(target, TrackOpTypes.GET, key)
      return res
    }
    /* 数据绑定 */
    !isReadonly && track(target, TrackOpTypes.GET, key)
    return isObject(res)
      ? isReadonly
        ?
          /* 只读属性 */
          readonly(res)
          /*  */
        : reactive(res)
      : res
  }
}
```

- **reactive ---------> get**
- **shallowReactive --------> shallowGet**
- **readonly ----------> readonlyGet**
- **shallowReadonly --------------->   shallowReadonlyGet**

**在vue2.0的时候。响应式是在初始化的时候就深层次递归处理了**，但是Vue3是在获取属性时候触发下一级的深度响应式

```js
setup(){
  const state = reactive({ 
    a:{ // 初始化只有a建立了响应式
      b:{} 
    } 
  })

  return {
	  state
  }
}
```
**在初始化的时候，只有a的一层级建立了响应式，b并没有建立响应式，而当我们用state.a的时候，才会真正的将b也做响应式处理，也就是说我们访问了上一级属性后，下一代属性才会真正意义上建立响应式**

1. 初始化的时候不用递归去处理对象，造成了不必要的性能开销
2. 有一些没有用上的state，这里就不需要在深层次响应式处理

下图来源于Vue贡献者对Vue响应式原理简单的描述

![https://www.youtube.com/watch?v=NZfNS4sJ8CI](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/image-20211117160806021.png)

### Vue2响应式

![图解 Vue 响应式原理](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/1c23f770a47243d7a1d25e9e8a5a6482~tplv-k3u1fbpfcp-zoom-crop-mark:1304:1304:1304:734.awebp)

内部通过Dep和Watcher实现响应式监听，包含依赖收集和派发更新两部分。

其中Dep内部实现发布-订阅模式，get的时候建立依赖关系depend，set的时候派发更新notify

# 组件生命周期与方法顺序

## Vue2.0 组件生命周期

![vue生命周期](https://cn.vuejs.org../images/lifecycle.png)

```js
new Vue -> Init Events & Lifecycle ->(1) Init injections & reactivity (2)
    -> no el vm.$mount(el) is called
    -> Has el option
        -> has template option then Compile template into render function
        -> no template option Compile outerHTML as template(整个替换掉)
            -> (3) Create vm.$el and replace (4)
                -> Mouted then (5) Remouted if data changes (6)
                    -> when vm.$destroy() is called (7)
                        -> Teardown watchers,child components and event listeners
                            -> Destroyed (8)

```

所以顺序依次是:

1. beforeCreate
2. Created
3. beforeMount
4. mounted
5. beforeUpdate
6. updated
7. beforeDestroy
8. destroyed

## Vue2.0 方法顺序

`Props -> Methods -> Data ->Computed -> Watch`

具体可以见这里的[源代码](https://github.com/vuejs/vue/blob/dev/src/core/instance/state.js#L45-L53)

如果有同名属性，一般都会报错。so 这里要注意同名属性的存在。

# slot-scope

插槽部分基础文档有说过，如字面意思。你插拔内存，插拔硬盘接口等等。换内存就如同换组件。4G 的、8G 的，对应的就是不同组件的不同功能。

默认的单个插槽（匿名插槽），如下
父组件：

```html
<template>
  <div class="father">
    <h3>这里是父组件</h3>
    <child>
      <div class="tmpl">
        <span>菜单1</span>
      </div>
    </child>
  </div>
</template>
```

子组件：

```html
<template>
  <div class="child">
    <h3>这里是子组件</h3>
    <slot></slot>
  </div>
</template>
```

最后渲染为:

```html
<div class="father">
  <h3>这里是父组件</h3>
  <div class="child">
    <h3>这里是子组件</h3>
    <div class="tmpl">
      <span>菜单1</span>
    </div>
  </div>
</div>
```

而`slot-scope`是带有数据的插槽，数据是通常是子元素传入到插槽内的。

```html
<slot slot-scope="xxx">
  //这里可以获取
</slot>
```

比如子组件异步拉了一个接口，就可以把数据传递给父组件嵌套的组件。
最后渲染为:

```html
<div class="father">
  <h3>这里是父组件</h3>
  <div class="child">
    //这里可以获取到上面传递的数据
  </div>
</div>
```
