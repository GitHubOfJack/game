import * as THREE from 'three';
import { SceneManager } from './core/SceneManager';
import { ShootingMode } from './modes/ShootingMode.refactored';

/**
 * 游戏主类，负责初始化和管理整个游戏
 * @class Game
 */
export class Game {
  /**
   * 创建游戏实例
   */
  constructor() {
    // 基础场景设置
    this.container = document.getElementById('game-container');
    this.canvas = document.getElementById('game-canvas');
    
    // 初始化渲染器
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    
    // 初始化场景管理器
    this.sceneManager = new SceneManager(this.renderer);
    
    // 当前游戏模式
    this.currentMode = null;
    
    // 音效控制
    this.soundEnabled = true;
    
    // 开始动画循环
    this.animate();
  }
  
  /**
   * 开始特定游戏模式
   * @param {string} mode - 要启动的游戏模式
   */
  startMode(mode) {
    // 清理当前模式
    if (this.currentMode) {
      this.currentMode.cleanup();
    }
    
    // 初始化新模式
    switch (mode) {
      case 'SHOOTING':
        this.currentMode = new ShootingMode(this);
        break;
      default:
        console.error('未知游戏模式:', mode);
        return;
    }
    
    // 初始化新模式
    if (this.currentMode) {
      this.currentMode.init();
    }
  }
  
  /**
   * 设置音效开关状态
   * @param {boolean} enabled - 是否启用音效
   */
  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    // 如果有当前模式，通知它音效状态改变
    if (this.currentMode && this.currentMode.onSoundToggle) {
      this.currentMode.onSoundToggle(enabled);
    }
  }
  
  /**
   * 处理窗口大小变化
   */
  onWindowResize() {
    // 更新相机和渲染器大小
    this.sceneManager.onWindowResize();
    
    // 如果当前模式有处理窗口大小变化的方法，则调用
    if (this.currentMode && this.currentMode.onWindowResize) {
      this.currentMode.onWindowResize();
    }
  }
  
  /**
   * 动画循环
   */
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    // 更新当前模式
    if (this.currentMode && this.currentMode.update) {
      this.currentMode.update();
    }
    
    // 渲染场景
    this.sceneManager.render();
  }
}