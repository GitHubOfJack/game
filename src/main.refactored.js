import GameManager from './game/core/GameManager.js';

/**
 * 游戏主入口
 * 使用重构后的架构，代码更加模块化和可维护
 */

// 当页面加载完成后启动游戏
window.addEventListener('DOMContentLoaded', () => {
  // 获取游戏画布
  const canvas = document.getElementById('game-canvas');
  
  // 创建游戏管理器
  const gameManager = new GameManager(canvas);
  
  // 将游戏管理器实例存储在全局对象中，方便调试
  window.gameManager = gameManager;
  
  console.log('游戏已初始化并准备就绪');
});