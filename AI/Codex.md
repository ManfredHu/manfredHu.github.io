# Codex

提供
- CLI
- 桌面应用软件
- VSCode插件

## 安装

```bash
sudo npm install -g @openai/codex
```

安装后运行

```bash
# 验证是否安装成功
codex --version

# 启动cli
codex
```

## 使用姿势

配置文件在 `~/.codex`下

- config.toml：Codex 主配置文件，用来配置中转站、模型、推理强度等
- auth.json：认证文件，用来保存你的 API key

1. 没有Slash，可以用Skill + $
Codex CLI 最新版本已经不支持 slash command 的形式了，自定义slash需要转换成了 skills 来承载

可以用 `$` 来触发技能，或者直接输入技能名称来触发技能

### 配置high effort
比如修改 `~/.codex/config.toml` 文件

```bash
# “请用高推理力度/更深入的思考”来处理该请求，让模型在生成代码或解答时投入更多的推理资源（比如更详细的代码分析、更严密的逻辑推断、更谨慎地给出解决方案）
model_reasoning_effort = "high"
```