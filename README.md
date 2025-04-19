# 发票识别助手

这是一个油猴脚本，用于自动识别网页中的发票图片并提取信息。

## 功能特点

- 自动识别网页中的发票图片
- 使用Tesseract.js进行OCR文字识别
- 提取发票关键信息（发票代码、发票号码、金额、日期等）
- 通过通知显示识别结果
- 支持中文识别

## 安装方法

1. 安装油猴插件（Tampermonkey）
2. 下载脚本文件 `dist/invoice-helper.user.js`
3. 在油猴插件中导入脚本

## 使用方法

1. 安装脚本后，访问任何包含发票图片的网页
2. 脚本会自动识别页面中的发票图片
3. 识别完成后会通过通知显示提取的发票信息

## 开发说明

### 项目结构

```
invoice-helper/
├── src/
│   └── invoice-helper.js  # 源代码
├── dist/
│   └── invoice-helper.user.js  # 编译后的脚本
├── package.json  # 项目配置
└── rollup.config.js  # 构建配置
```

### 开发环境设置

1. 安装依赖：
```bash
npm install
```

2. 开发模式（实时编译）：
```bash
npm run dev
```

3. 构建：
```bash
npm run build
```

## 注意事项

- 需要浏览器支持WebAssembly（现代浏览器都支持）
- 首次加载可能需要下载OCR模型文件
- 识别效果受图片质量影响

## 版本历史

- v1.0.0 (2024-03-21)
  - 初始版本发布
  - 实现基本的发票识别功能

## 反馈与支持

如有问题或建议，请提交Issue或Pull Request。 