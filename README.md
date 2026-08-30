# 肾眼智能体离线模型网页

这是一个无依赖的静态网页原型，支持三个基于逻辑回归的模型：

- IgAN-uBASE
- IgAN-BASE
- IgAN-OxT

## 本地运行

可以直接双击 `index.html` 打开，也可以在当前目录启动静态服务：

```powershell
python -m http.server 8080
```

然后访问 <http://localhost:8080>。

页面中的计算均在浏览器本地完成，不会上传输入数据。部署到 GitHub Pages 时，可以直接使用静态文件或配置 GitHub Actions 发布。

界面默认使用 English，可在右上角切换中文、Deutsch、Français、Italiano 或 日本語。三个模型的年龄输入范围统一为 0–90 岁，结果运行后才会展开风险分层、列线图和变量解释。

> 重要：模型结果仅作临床辅助评估，不能替代医生诊断。正式临床使用前，应完成模型外部验证、适用人群确认、输入范围校验和医学伦理/合规评估。
