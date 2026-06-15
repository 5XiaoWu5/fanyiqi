GitHub Pages 发布说明

一、上传哪些文件

把仓库里的 docs 文件夹上传到 GitHub。

docs 文件夹里必须有：
index.html
styles.css
script.js
learning-data.js

二、GitHub Pages 设置

进入 GitHub 仓库：
Settings -> Pages

设置：
Source: Deploy from a branch
Branch: main
Folder: /docs

保存后等待 1 到 3 分钟。

三、访问地址

GitHub 会生成类似：
https://你的用户名.github.io/仓库名/

四、重要说明

GitHub Pages 只能发布静态页面，不能安全保存 DeepSeek API Key，也不能运行后端接口。

所以这个 GitHub Pages 版本可以使用：
- 学习手册
- 搜索
- 随机练习
- 翻译前后朗读按钮
- 页面展示

但 AI 聊天和 DeepSeek 翻译不能直接在 GitHub Pages 上运行。

如果以后要恢复 AI 翻译，需要使用能运行后端的平台，或者自己准备一个后端 API 地址。
