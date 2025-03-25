# 宝宝射击游戏 - 数字与字母配对

这是一个为3岁儿童设计的射击游戏，通过有趣的互动方式帮助幼儿学习数字和字母。

## 主要特性

- 3D泡泡射击游戏，帮助幼儿识别数字和字母
- 逐步增加的难度，适应孩子的学习进度
- 友好的视觉效果和声音反馈

## 开发说明

这个版本是从原始"小小建筑师大冒险"游戏中提取出的射击模式，并进行了以下优化：

1. 修复了泡泡无法向上射击的问题
2. 简化了代码结构，移除了不必要的游戏模式
3. 提高了代码的可维护性和可读性

## 运行游戏

### 方法一：使用批处理文件

直接双击`start-shooting-game.bat`文件即可启动游戏。

### 方法二：手动启动

1. 确保已安装Node.js环境
2. 打开命令行，进入项目目录
3. 复制射击游戏HTML文件：
   ```
   copy src\index.shooting.html src\index.html
   ```
4. 安装依赖：
   ```
   npm install
   ```
5. 启动游戏：
   ```
   npm run dev
   ```

## 游戏操作说明

- 点击屏幕发射泡泡
- 击中与目标匹配的数字或字母泡泡
- 正确击中目标会得到分数和奖励
- 错误击中会有视觉提示

## 技术栈

- Three.js - 3D图形渲染
- JavaScript ES6+ - 游戏逻辑
- Vite - 构建工具和开发服务器

## 项目结构

```
src/
├── game/
│   ├── core/
│   │   └── GameConfig.js        # 游戏配置
│   ├── modes/
│   │   └── ShootingMode.js      # 射击模式主类
│   └── shooting/                # 射击模式组件
│       ├── BubbleManager.js     # 泡泡管理器
│       └── TargetManager.js     # 目标管理器
├── utils/
│   ├── AudioManager.js          # 音频管理器
│   └── UIManager.shooting.js    # UI管理器
├── index.shooting.html          # 射击游戏HTML入口
└── main.shooting.js             # 射击游戏JS入口
```

## 贡献指南

如果您想为此项目做出贡献，请遵循以下步骤：

1. Fork此项目
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request