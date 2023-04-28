# 纯CSS画一个树状图
首先是页面平均三等份，直接grid布局走起很简单

```css
display: grid;
grid-template-columns: repeat(3, 1fr);
grid-row-gap: var(--gridmargin);
grid-column-gap: var(--gridmargin);
```

## 画一个树状图
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/u3PN9k.png)

画一个如图的树桩图，这个就有点难度了，不过还是能搞定不是

首先是数的嵌套接口，因为有子树，树的分支数量不定，所以先按照最难的来，简单的做下适配就好了

```html
<template>
  <div class="logic-chart-item">
    <div class="logic-chart-item__title">{{title}}</div>
    <div class="logic-chart-item__chart">
      <SubTree :treeData="mockData" />
    </div>
  </div>
</template>
<script>
Vue.component('SubTree', {
  template: `
    <div>
      <!-- 有子树 -->
      <div v-if="childLen > 0" class="logic-chart-component">
        <div class="logic-tag" v-if="childLen > 1">{{treeData.logicCondition}}</div>
        <div class="logic-line" v-if="childLen > 1">
          <div class="logic-line__top"></div>
          <div class="logic-line__bottom"></div>
        </div>
        <div class="logic-list">
          <div v-for="(item, idx) in treeData.child" :key="idx" ref='childDom'>
            <SubTree :treeData="item"  />
          </div>
        </div>
      </div>
      <!-- 无子树 -->
      <span v-else>
        {{treeData.text}} {{treeData.subConTitle}} {{treeData.opr}} {{treeData.con}}
      </span>
    </div>
  `,
  name: 'SubTree',
  props: {
    treeData: {
      type: [Object, Array],
      default: () => {}
    }
  },
  data() {
    return {
      firstChildHeightHalf: 0,
      lastChildHeightHalf: 0
    }
  },  
  computed: {
    childLen () {
      if (this.treeData && Array.isArray(this.treeData.child)) {
        return this.treeData.child.length
      }
    },
    hasLogicChild () {
      if (this.treeData && Array.isArray(this.treeData.child) && this.treeData.child.length > 1
        && this.treeData.child.some(i => !!i.logicCondition)
      ) {
        return true
      }
      return false
    }
  }
})

export default {
  data () {
    return {
      title: '纯CSS画一个树状图',
      mockData: {
        title: '高消费女性',
        remark: '',
        creator: '系统',
        createTime: 1624504363,
        updateMethod: 'day',
        
        logicCondition: '且',
        // 没有嵌套的
        // child: [{
        //   text: '过去30天有过访问行为',
        //   subConTitle: '总次数',
        //   opr: '>',
        //   con: '10'
        // }]

        // 有嵌套的
        child: [{
          logicCondition: '且',
          child: [{
            text: '过去30天有过访问行为',
            subConTitle: '总次数',
            opr: '>',
            con: '10'
          }, {
            text: '年龄范围包含 10 - 18岁的新访问用户'
          }, {
            text: '',
            subConTitle: '性别',
            opr: '=',
            con: '女'
          }, {
            text: '',
            subConTitle: '下单金额',
            opr: '>',
            con: '1000'
          }]
        },{
          logicCondition: '或',
          child: [{
            text: '过去90天有过下单行为',
            subConTitle: '总次数',
            opr: '>',
            con: '1'
          }, {
            text: '过去90天有过下单行为',
            subConTitle: '总次数',
            opr: '>',
            con: '1'
          }]
        },{
          logicCondition: '或',
          child: [{
            text: '过去90天有过下单行为',
            subConTitle: '总次数',
            opr: '>',
            con: '1'
          }, {
            text: '过去90天有过下单行为',
            subConTitle: '总次数',
            opr: '>',
            con: '1'
          }]
        }]
      }
    }
  }
}
</script>
<style>
.logic-chart-item{
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  height: 240px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.logic-chart-item__title{
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 24px;
}
.logic-chart-item__chart{
  flex: 1;
  overflow-y: auto;
}
.logic-chart-component {
  display: flex;
  align-items: center;
  position: relative;
}
.logic-chart-component .logic-tag {
  height: 24px;
  line-height: 24px;
  width: 32px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  text-align: center;
  margin-right: 24px;
}
.logic-chart-component .logic-line {
  width: 16px;
  position: absolute;
  left: 32px;
  top: 0px;
  bottom: 0px;
}
.logic-chart-component .logic-line__top {
  position: absolute;
  top: 0;
  bottom: 50%;
  width: 100%;
}
.logic-chart-component .logic-line__top::before {
  content: '';
  position: absolute;
  width: 50%;
  top: 0;
  right: 0;
  bottom: 50%;
  border-top: 1px solid #d0d0d0;
  border-left: 1px solid #d0d0d0;
  border-top-left-radius: 6px;
  margin-right: -1px;
}
.logic-chart-component .logic-line__top::after {
  content: '';
  position: absolute;
  width: 50%;
  top: 50%;
  left: 0;
  bottom: 0;
  border-bottom: 1px solid #d0d0d0;
  border-right: 1px solid #d0d0d0;
  border-bottom-right-radius: 6px;
}
.logic-chart-component .logic-line__bottom {
  position: absolute;
  top: 50%;
  bottom: 0;
  width: 100%;
}
.logic-chart-component .logic-line__bottom::before {
  content: '';
  position: absolute;
  width: 50%;
  top: 0;
  left: 0;
  bottom: 50%;
  border-top: 1px solid #d0d0d0;
  border-right: 1px solid #d0d0d0;
  border-top-right-radius: 6px;
}
.logic-chart-component .logic-line__bottom::after {
  content: '';
  position: absolute;
  width: 50%;
  top: 50%;
  right: 0;
  bottom: 0;
  border-bottom: 1px solid #d0d0d0;
  border-left: 1px solid #d0d0d0;
  border-bottom-left-radius: 6px;
  margin-right: -1px;
}
.logic-chart-component .logic-list > div:nth-child(n+2) {
  margin-top: 12px;
}
.logic-chart-component .logic-list .logic-chart-item__chart:nth-child(n+2) {
  margin-top: 24px;
}

</style>
```

直接上代码，可以看到我们是用到了比较hack的模拟方式去模拟上下大括号，然后用圆角做的转角，也就是说一个括弧要4个部分组成

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/5zUuXS.png)

其次是我们用到了组件使用组件自己，达到无限循环多层数据的效果。这里Vue只要写了组件名，就可以直接用了，即`name: 'SubTree',`其次的如果是TS写的，类名就是组件名了。

## border 1像素的问题
细心的同学不知道发现了有margin的负边距的问题没有，如下图

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/jBBUpk.png)

主要是上下两部分的框模型差距，导致的这个1px的像素对不齐，可以看到左边是left: 0,右边是right: 0，这个时候按照框模型，定宽（各自50%）后border部分1px会重叠，但是实际是有1px的偏移
负边距把右侧的盒子模型缩小1px后对齐了

## 括号优化
好了，难题又来了，大家可以对比看下，括号的上下的闭口的地方是顶格的，没有对准中间部分，这里利用到上下括号是用的绝对定位`position: absolute`

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/BnVfym.png)

只要把`{`上面的一半的top值，和底部的bottom值修改一下，就能对齐了。那么这个值取多少合适呢？

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/c2vYGp.png)

脑筋灵活的同学肯定知道了，第一个子元素DOM高度的一半就好了，那如何获取子元素呢？$ref拉，简单。

当$ref用在`v-for`的时候，直接能拿到数组，这个时候数组第一个元素就是第一个子元素，最后一个元素就是最后一个子元素

所以我们写了`getChildHeight`方法，上最后代码


```html
<template>
  <div class="logic-chart-item">
    <div class="logic-chart-item__title">{{title}}</div>
    <div class="logic-chart-item__chart">
      <SubTree :treeData="mockData" />
    </div>
  </div>
</template>
<script>
Vue.component('SubTree', {
  template: `
    <div>
      <!-- 有子树 -->
      <div v-if="childLen > 0" class="logic-chart-component">
        <div class="logic-tag" v-if="childLen > 1">{{treeData.logicCondition}}</div>
        <div class="logic-line" v-if="childLen > 1">
          <div class="logic-line__top" :style="firstChildHeightHalfStyle"></div>
          <div class="logic-line__bottom" :style="lastChildHeightHalfStyle"></div>
        </div>
        <div class="logic-list">
          <div v-for="(item, idx) in treeData.child" :key="idx" ref='childDom'>
            <SubTree :treeData="item"  />
          </div>
        </div>
      </div>
      <!-- 无子树 -->
      <span v-else>
        {{treeData.text}} {{treeData.subConTitle}} {{treeData.opr}} {{treeData.con}}
      </span>
    </div>
  `,
  name: 'SubTree',
  props: {
    treeData: {
      type: [Object, Array],
      default: () => {}
    }
  },
  data() {
    return {
      firstChildHeightHalfStyle: {top: '0px'},
      lastChildHeightHalfStyle: {bottom: '0px'}
    }
  },  
  computed: {
    childLen () {
      if (this.treeData && Array.isArray(this.treeData.child)) {
        return this.treeData.child.length
      }
    },
    hasLogicChild () {
      if (this.treeData && Array.isArray(this.treeData.child) && this.treeData.child.length > 1
        && this.treeData.child.some(i => !!i.logicCondition)
      ) {
        return true
      }
      return false
    }
  },
  methods: {
    getChildHeight(type = 'first') {
      let height = 20 // 普通一行文本高度20
      console.log(`getChildHeight`, this, this.hasLogicChild)
      if (this.$refs.childDom && this.hasLogicChild) {
        if (type === 'first') {
          height = this.$refs.childDom[0].clientHeight
        } else {
          // last
          const len = this.$refs.childDom.length
          height = this.$refs.childDom[len-1].clientHeight
        }
      }
      return Number(height / 2)
    }
  },
  created() {
    
  },
  mounted() {
    // 这里是因为在网页里用vuepress插件渲染代码，不知道为什么初始化拿不到clientHeight，延迟一下渲染出来再拿
    // 正常执行可以把setTimeout去掉
    setTimeout(()=> {
      this.firstChildHeightHalfStyle.top = this.getChildHeight('first') + 'px'
      this.lastChildHeightHalfStyle.bottom = this.getChildHeight('last') + 'px'
    }, 2000)
  }
})

export default {
  data () {
    return {
      title: '纯CSS画一个树状图',
      mockData: {
        title: '高消费女性',
        remark: '',
        creator: '系统',
        createTime: 1624504363,
        updateMethod: 'day',
        
        logicCondition: '且',
        // 没有嵌套的
        // child: [{
        //   text: '过去30天有过访问行为',
        //   subConTitle: '总次数',
        //   opr: '>',
        //   con: '10'
        // }]

        // 有嵌套的
        child: [{
          logicCondition: '且',
          child: [{
            text: '过去30天有过访问行为',
            subConTitle: '总次数',
            opr: '>',
            con: '10'
          }, {
            text: '年龄范围包含 10 - 18岁的新访问用户'
          }, {
            text: '',
            subConTitle: '性别',
            opr: '=',
            con: '女'
          }, {
            text: '',
            subConTitle: '下单金额',
            opr: '>',
            con: '1000'
          }]
        },{
          logicCondition: '或',
          child: [{
            text: '过去90天有过下单行为',
            subConTitle: '总次数',
            opr: '>',
            con: '1'
          }, {
            text: '过去90天有过下单行为',
            subConTitle: '总次数',
            opr: '>',
            con: '1'
          }]
        },{
          logicCondition: '或',
          child: [{
            text: '过去90天有过下单行为',
            subConTitle: '总次数',
            opr: '>',
            con: '1'
          }, {
            text: '过去90天有过下单行为',
            subConTitle: '总次数',
            opr: '>',
            con: '1'
          }]
        }]
      }
    }
  }
}
</script>
<style>
.logic-chart-item{
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  height: 240px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.logic-chart-item__title{
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 24px;
}
.logic-chart-item__chart{
  flex: 1;
  overflow-y: auto;
}
.logic-chart-component {
  display: flex;
  align-items: center;
  position: relative;
}
.logic-chart-component .logic-tag {
  height: 24px;
  line-height: 24px;
  width: 32px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  text-align: center;
  margin-right: 24px;
}
.logic-chart-component .logic-line {
  width: 16px;
  position: absolute;
  left: 32px;
  top: 0px;
  bottom: 0px;
}
.logic-chart-component .logic-line__top {
  position: absolute;
  top: 0;
  bottom: 50%;
  width: 100%;
}
.logic-chart-component .logic-line__top::before {
  content: '';
  position: absolute;
  width: 50%;
  top: 0;
  right: 0;
  bottom: 50%;
  border-top: 1px solid #d0d0d0;
  border-left: 1px solid #d0d0d0;
  border-top-left-radius: 6px;
  margin-right: -1px;
}
.logic-chart-component .logic-line__top::after {
  content: '';
  position: absolute;
  width: 50%;
  top: 50%;
  left: 0;
  bottom: 0;
  border-bottom: 1px solid #d0d0d0;
  border-right: 1px solid #d0d0d0;
  border-bottom-right-radius: 6px;
}
.logic-chart-component .logic-line__bottom {
  position: absolute;
  top: 50%;
  bottom: 0;
  width: 100%;
}
.logic-chart-component .logic-line__bottom::before {
  content: '';
  position: absolute;
  width: 50%;
  top: 0;
  left: 0;
  bottom: 50%;
  border-top: 1px solid #d0d0d0;
  border-right: 1px solid #d0d0d0;
  border-top-right-radius: 6px;
}
.logic-chart-component .logic-line__bottom::after {
  content: '';
  position: absolute;
  width: 50%;
  top: 50%;
  right: 0;
  bottom: 0;
  border-bottom: 1px solid #d0d0d0;
  border-left: 1px solid #d0d0d0;
  border-bottom-left-radius: 6px;
  margin-right: -1px;
}
.logic-chart-component .logic-list > div:nth-child(n+2) {
  margin-top: 12px;
}
.logic-chart-component .logic-list .logic-chart-item__chart:nth-child(n+2) {
  margin-top: 24px;
}

</style>
```