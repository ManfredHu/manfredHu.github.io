# 最好用的shell-ohmyzsh
至今用的macOS里最好的 shell，没有之一。首先你要安装iterm2，然后再安装这个，iterm2安装自行google

安装直接跑[这里](https://github.com/ohmyzsh/ohmyzsh#basic-installation)的命令

```bash
vi ~/.zshrc
```

## 推荐主题

### ys
```bash
ZSH_THEME="ys"
```
简单，如用户名路径时间等都有，关键的是还有git状态，就是下面` o `符号
```bash
# Manfredhu @ Manfredhu-MB1 in ~/Documents/Manfredhu on git:Manfredhu_release o [13:14:03]
```

## 推荐插件

```bash
plugins=(
  copypath
  git
  autojump
  last-working-dir
  zsh-syntax-highlighting
  zsh-autosuggestions
  zsh-better-npm-completion
)
```

## [git](https://github.com/ohmyzsh/ohmyzsh/blob/master/plugins/git)

```bash
alias gst='git status'
alias gaa='git add --all'
alias gc='git commit --verbose'
alias gca='git commit --verbose --all'
alias gcam='git commit --all --message'
alias gco='git checkout'
```

## [copypath](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/copypath)
内置插件，直接输入`copypath`就可以拷贝当前路径，而不用`pwd`输出再去复制


## [autojump](https://github.com/wting/autojump)
记录命令，自动补全，灰常好用，推荐。直接brew就可以装了，会根据目录权重排序，保证你进入的是高频访问的目录

```bash
brew install autojump
```

- `j foo` 直接跳转目录
- `jc bar` 跳转子目录
- `jo music` finder访达打开文件夹music
- `jco images` finder访达打开子文件夹images

## [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting)
高亮语法用

```bash
# https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```



## [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)

```bash
# https://github.com/zsh-users/zsh-autosuggestions/blob/master/INSTALL.md
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

命令预览，有了这个不怕你不会敲命令，而是怕你敲的太快了。一般熟练后无脑`Control + e`快进效率就很高了

## [zsh-better-npm-completion](https://github.com/lukechilds/zsh-better-npm-completion)

```bash
git clone https://github.com/lukechilds/zsh-better-npm-completion ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-better-npm-completion
```

主要是补充前端经常使用的 `npm i xxx`

## .zshrc
如果切换到zsh原来终端的一些命令不会执行，这里强制zsh关联一下一些命令（通常是软件加入全局环境变量的命令，比如`mysql`,`redis-cli`等等，还有你的自定义alias

### .bashrc and .bash_profile
```
source ~/.bash_profile
source ~/.bashrc
```

### nvm
```
# nvm
export NVM_DIR="$HOME/.nvm"
  [ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
  [ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
```