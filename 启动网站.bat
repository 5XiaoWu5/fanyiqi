@echo off
chcp 65001 >nul
cd /d "%~dp0"

if not exist ".env" (
  copy ".env.example" ".env" >nul
  echo 已创建 .env 文件。请先用记事本打开 .env，填写 DEEPSEEK_API_KEY。
  notepad ".env"
  pause
  exit /b
)

if not exist "node_modules" (
  echo 正在安装网站依赖，第一次会稍等一会儿...
  npm install
  if errorlevel 1 (
    echo 依赖安装失败，请确认电脑已安装 Node.js。
    pause
    exit /b 1
  )
)

start "" "http://localhost:8787"
npm start
