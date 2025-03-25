@echo off
echo 正在启动狙击训练游戏...

rem 安装依赖
npm install

rem 复制射击游戏HTML文件
copy src\index.shooting.html src\index.html

rem 启动游戏
npm run dev

pause