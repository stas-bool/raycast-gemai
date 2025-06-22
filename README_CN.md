# Raycast GemAI - 通用 AI 助手

**Raycast GemAI** 是一个强大的 Raycast 扩展，将 **Google Gemini** 和 **OpenAI GPT** 模型直接集成到您的工作流程中。执行文本处理、复杂推理、图像分析和翻译——所有这些都无需离开 Raycast。

> 🇺🇸 **English version:** [README.md](README.md)
>
> 🇷🇺 **Русская версия:** [README_RUS.md](README_RUS.md)

## ✨ 主要功能

- **🤖 通用 AI 支持：** 在 Google Gemini 和 OpenAI 模型之间无缝切换，自动提供商检测
- **🧠 高级推理：** 完全支持 OpenAI 的 o1-preview 和 o1-mini，具有增强的思维能力
- **🖼️ 图像分析：** 使用 GPT-4o 和 Gemini Vision 进行图像处理，自动模型切换以获得最佳结果
- **💬 聊天室：** 具有持久上下文记忆的交互式对话
- **📝 文本工具：** 用于写作、编辑、翻译和摘要的综合套件
- **📊 使用分析：** 实时令牌跟踪和准确的成本计算
- **🎨 自定义提示：** 使用您自己的 Markdown 文件为每个命令定制 AI 行为

## 🤖 支持的模型和定价

### OpenAI 模型
| 模型 | 类型 | 输入/输出成本（每 100万 令牌） | 最适合 |
|-------|------|--------------------------------|--------|
| **GPT-4o** | 视觉 + 文本 | $2.50 / $10.00 | 通用任务、图像分析 |
| **GPT-4o-mini** | 视觉 + 文本 | $0.15 / $0.60 | 快速、经济的任务 |
| **o1-preview** | 推理 | $15.00 / $60.00 | 复杂问题解决 |
| **o1-mini** | 推理 | $3.00 / $12.00 | 高效推理任务 |

### Google Gemini 模型
| 模型 | 类型 | 输入/输出成本（每 100万 令牌） | 最适合 |
|-------|------|--------------------------------|--------|
| **Gemini 2.0 Flash-Lite** | 视觉 + 文本 | $0.075 / $0.30 | 快速、经济的任务 |
| **Gemini 2.0 Flash** | 视觉 + 文本 | $0.10 / $0.40 | 平衡性能 |
| **Gemini 2.5 Flash** | 视觉 + 文本 | $0.15 / $0.60 | 增强性能 |
| **Gemini 2.5 Flash Thinking** | 视觉 + 文本 | $0.15 / $0.60 + $3.50 思考 | 高级推理 |
| **Gemini 2.5 Pro** | 视觉 + 文本 | $1.25 / $10.00 | 复杂推理和分析 |

## 📋 可用命令

| 命令 | 描述 | 输入类型 | AI 提供商 |
|------|------|----------|-----------|
| **Ask AI** | 使用任何可用模型提问 | 文本/选择 | 通用 |
| **Chat Room** | 具有持久上下文的交互式聊天 | 文本输入 | 通用 |
| **Explain It** | 带上下文的详细解释 | 选择 | 通用 |
| **Summarize It** | 智能文本摘要 | 选择 | 通用 |
| **Rephrase It** | 重写，保持含义 | 选择 | 通用 |
| **Fix Grammar** | 语法和风格纠正 | 选择 | 通用 |
| **Professional/Friendly Tone** | 转换文本语调 | 选择 | 通用 |
| **Make Longer/Shorter** | 扩展或压缩内容 | 选择 | 通用 |
| **Translate** | 多语言翻译 | 选择 | 通用 |
| **Count Tokens** | 估算成本并优化使用 | 文本/选择 | 通用 |
| **Screenshot → Markdown** | 将图像转换为格式化的 Markdown | 截图 | 视觉模型 |
| **Screenshot → Explain** | 分析和描述图像 | 截图 | 视觉模型 |
| **Screenshot → Translate** | 从图像中提取和翻译文本 | 截图 | 视觉模型 |
| **Usage Statistics** | 详细分析和成本 | - | - |

## 🚀 快速开始

### 安装
1. **Raycast Store（推荐）：** 在 Raycast Store 中搜索 "GemAI"
2. **本地开发：**
   ```bash
   git clone https://github.com/smetdenis/raycast-gemai.git
   cd raycast-gemai
   npm install && npm run build
   ```

### 配置
通过 **Raycast Preferences → Extensions → GemAI** 访问设置：

**必需：**
- **Gemini API Key：** 在 [Google AI Studio](https://aistudio.google.com/app/apikey) 获取
- **OpenAI API Key：** 在 [OpenAI Platform](https://platform.openai.com/api-keys) 获取

**可选：**
- **默认模型：** 为所有命令选择首选模型
- **自定义模型：** 添加 OpenAI 兼容模型（Azure、本地部署）
- **温度：** 控制 AI 创造性（0.0 = 专注，1.0 = 创造性）
- **自定义提示：** 指向包含自定义系统提示的目录
- **语言：** 为翻译设置主要/次要语言

## 🎨 自定义系统提示

创建自定义 Markdown 文件以覆盖内置提示：

1. **创建提示目录：** `mkdir ~/Documents/Prompts/Raycast`
2. **创建提示文件**（例如，`AskQuestion.md`）：
   ```markdown
   # 自定义 Ask AI 提示
   
   您是一位专门的技术顾问，在软件开发方面具有专业知识。
   始终提供实用的、可操作的建议，并在适当时提供代码示例。
   ```
3. **在 Raycast 中配置：** 设置 **Prompt Directory** 并为命令指定自定义文件名

**可用提示文件：** `AskQuestion.md`、`ChatRoom.md`、`Explainer.md`、`Grammar.md`、`Professional.md`、`Friend.md`、`Translator.md`、`Screenshot-Explain.md`、`Screenshot-Markdown.md`

## 💡 使用示例

```bash
# 文本处理
选择文本 → Fix Grammar: "there dog is running" → "Their dog is running"
选择文本 → Professional: "hey, can u help?" → "Could you please assist me?"

# 高级推理（o1 系列）
Ask AI → "逐步解决这个微分方程..."

# 视觉和截图
截图 → Screenshot → Markdown: 将 UI 转换为格式化的 Markdown
截图 → Screenshot → Explain: "这张图表中发生了什么？"

# 智能模型切换
o1-mini + 截图 → 自动切换到 GPT-4o 进行图像处理
```

## 🔧 开发

### 主要特性
- **通用架构：** 支持多个 AI 提供商的单一代码库
- **推理模型支持：** 完全兼容 o1 系列
- **视觉自动切换：** 多模态任务的智能模型选择
- **实时分析：** 准确的令牌计数和成本计算

### 构建
```bash
npm install     # 安装依赖
npm run dev     # 开发模式，监视文件变化
npm run build   # 生产构建
```

## 🤝 贡献

1. Fork 仓库
2. 本地克隆：`git clone https://github.com/smetdenis/raycast-gemai.git`
3. 按照 TypeScript 严格模式和向后兼容性进行更改
4. 使用 Gemini 和 OpenAI 模型进行测试
5. 提交详细描述的 pull request

## 🔒 隐私和许可

- **隐私：** API 密钥安全存储在 Raycast 中，不存储或传输数据给第三方
- **许可：** [MIT License](LICENSE)
- **政策：** 受 Google Gemini 和 OpenAI 隐私政策约束

---

**Raycast GemAI** - 您的通用 AI 助手，由 Google 和 OpenAI 的最佳模型提供支持。

支持：[GitHub Issues](https://github.com/smetdenis/raycast-gemai/issues) 