# 腾讯金融产品体验设计之道

![价值再定义 腾讯金融产品体验设计之道](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/design-fit.jpg)
这本书最近在看，记一些点吧，毕竟基本上 fit 的产品都是在微信钱包九宫格或者是微信支付里面跑的，用户量级很大，所以对于交互、视觉设计来说还是有一定要求的，可能不一定炫酷，但是却很实用。

# 业务相关

## 支付相关业务的要给用户可信任的安全感

重点提到了给用户把控感和确定感，让用户了解信用卡还款的时间、金额、利率之类的。

- 反馈的安全感，成功了（绿色），失败了（错误提示）
- 减少金融术语，站在小白的角度思考产品交互逻辑
- 增加辅助信息，不过分强调但有需求的用户可以了解
- 突出重点，通过颜色、常规交互、文字大小等区分主次
- 合理实用流程导航，告诉用户已经做了什么，下一步需要做什么（主流程 4 步内完成）

# 视觉交互相关

## 视觉路径

如传统的视觉路径是 Z，按照手机号码 1235789 来看，但是如果是签到类的功能，可以通过视觉串联（连线）,把视觉路径更改为 1236987。也可以减少用户在跳跃到下行路径的时间。

## 让信息更加扁平

研究表明，每一次页面的跳转，转化率就会减少 10%。所以我们可以用很多方法去减少页面跳转，虽然从技术上来说流量并没有减少反而可能增大（ajax 预加载之类的）

- 通过同个页面的 Tab 的跳转来减少用户页面跳转，使信息更加趋向扁平。
- 实用弹层，减少交互层级。
- L 型视觉纵线（在 PC 端是 F 型）
- 导航明确，避免双层“返回”
- 保持视觉焦点
- 隐藏二级、次要信息
- 利用选择代替输入
- 自动或模糊填充（记录用户上一次的操作）
- 表单信息一定要分组
- 表单信息分布校验
- 下拉刷新

## 提示方式的区分

- 非阻断式的提示，用户可以继续操作，提示只有看的作用
- 阻断式的提示，用户不能继续操作，例如对话框，提示用户需要关注的重点信息
- 正确的布局操作按钮，重要的操作按钮在移动端要放右边，取消应该放在左边

# APP 和 H5 共存

很多产品有 H5 和 APP 两个版本的产品，迭代是双份的，但是其实两边的目的是不同的，H5 比较普遍，可以内嵌，只要支持浏览器，可以在很多设备打开。而 APP 是针对专业的人士。

这就引申出来几个问题

- 体验一致性的传承，有 H5 在先，APP 要减少用户的学习成本，需要有类似的界面。
- 价值相关，用户为什么要下载 APP 而不是继续使用 H5？有什么优点和好处吗？
- 从使用频率上来说，APP 的使用率会高于 H5，那么用户是否能在 APP 快速获取到他们想要的信息？例如昨日收益之类的。操作方面，APP 是否可以更快的买基金和进行交易？减少验证环节
