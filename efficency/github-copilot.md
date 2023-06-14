# Github Copilot

Github Copilot作为现在最好用的代码提示工具，配合VSCode简直无敌

个人感觉VSCode下比微软的[IntelliCode](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode)和[Tabnice](https://marketplace.visualstudio.com/items?itemName=TabNine.tabnine-vscode)的都好用

## 如何获取？

2022.12.9现在的版本需要$10/月或者$100/年，相当于免费送2个月。那如何免费获取呢？

有Github学生包可以免费使用，具体申请过程详见[如何白嫖Github学生包](../news/2022-12-9.applyGithubStudentPack)

## 如何使用

直接装[Copilot VSCode插件](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)就可以了


![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/jxOAWR.png)

可以看到具体的配置

### 接收和拒绝

- 接受建议：Tab
- 拒绝建议：Esc

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/ezgif.com-gif-maker.gif)

### `Ctrl/Control + Enter` 可以调出 10次代码建议

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/UIFjJp.png)

代码输入时候 `Ctrl/Control + Enter` 可以调出 10次代码建议，选择任意一个点击 **Accept Solution** 即可生效

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/ezgif.com-gif-maker-showSuggest.gif)

### 切换前后建议

- 下一条建议：`Alt/Option + ]`
- 上一条建议：`Alt/Option + [`

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/Copilot-changeToNextSuggest.gif)

## 代理
各大公司都有自己的网络, 下面说的是如何绕过公司网络.

[Github discussions](https://github.com/orgs/community/discussions/29127)

其实Github Copilot就是一个HTTP请求, 只不过模型在Github的服务器上. 所以我们可以通过代理的方式来绕过公司网络.

1. 本地开启代理工具, 至于怎么配置自行搜索科学上网吧
2. 给VSCode设置代理, 比如本地开启了代理工具, 端口1087, 直接配置`http:127.0.0.1:1087`就可以了