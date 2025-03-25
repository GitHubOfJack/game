import SceneManager from './SceneManager.js';
import GameConfig from './GameConfig.js';
import LevelManager from './LevelManager.js';
import AudioManager from '../../utils/AudioManager.js';
import UIManager from '../../utils/UIManager.js';
import BuildingMode from '../modes/BuildingMode.js';
import ShootingMode from '../modes/ShootingMode.refactored.js';
import PuzzleMode from '../modes/PuzzleMode.js';

/**
 * @class GameManager
 * @description 游戏管理器，负责管理游戏状态和模式切换
 */
export default class GameManager {
  /**
   * @constructor
   * @param {HTMLCanvasElement} canvas - 游戏画布
   */
  constructor(canvas) {
    // 场景管理器
    this.sceneManager = new SceneManager(canvas);
    
    // 游戏配置
    this.config = new GameConfig();
    
    // 关卡管理器
    this.levelManager = new LevelManager(this.config);
    
    // 音频管理器
    this.audioManager = new AudioManager();
    
    // UI管理器
    this.uiManager = new UIManager(this);
    
    // 游戏模式
    this.currentMode = null;
    this.modes = {
      building: null,
      shooting: null,
      puzzle: null
    };
    
    // 初始化
    this.init();
  }
  
  /**
   * @method init
   * @description 初始化游戏
   */
  init() {
    console.log('游戏初始化开始...');
    
    // 播放背景音乐
    this.audioManager.playBackgroundMusic();
    
    // 初始化游戏模式
    this.initModes();
    
    // 监听游戏模式切换事件
    this.setupEventListeners();
    
    // 开始动画循环
    this.startAnimationLoop();
    
    console.log('游戏初始化完成');
  }
  
  /**
   * @method initModes
   * @description 初始化所有游戏模式
   */
  initModes() {
    // 创建游戏模式实例
    this.modes.building = new BuildingMode(this);
    this.modes.shooting = new ShootingMode(this);
    this.modes.puzzle = new PuzzleMode(this);
  }
  
  /**
   * @method setupEventListeners
   * @description 设置事件监听
   */
  setupEventListeners() {
    // 监听游戏模式切换事件
    document.addEventListener('startGame', (event) => {
      const mode = event.detail.mode;
      if (mode === 'building-mode') {
        this.switchMode('building');
      } else if (mode === 'shooting-mode') {
        this.switchMode('shooting');
      } else if (mode === 'puzzle-mode') {
        this.switchMode('puzzle');
      }
    });
  }
  
  /**
   * @method switchMode
   * @description 切换游戏模式
   * @param {string} mode - 模式名称：'building', 'shooting', 'puzzle'
   */
  switchMode(mode) {
    // 清除当前模式
    if (this.currentMode) {
      this.currentMode.cleanup();
    }
    
    // 设置新模式
    switch(mode) {
      case 'building':
        this.currentMode = this.modes.building;
        break;
      case 'shooting':
        this.currentMode = this.modes.shooting;
        break;
      case 'puzzle':
        this.currentMode = this.modes.puzzle;
        break;
      default:
        console.error('未知的游戏模式:', mode);
        return;
    }
    
    // 初始化新模式
    this.currentMode.init();
    
    // 更新UI
    if (this.uiManager) {
      this.uiManager.updateModeUI(mode);
    }
    
    console.log(`已切换到${mode}模式`);
  }
  
  /**
   * @method startAnimationLoop
   * @description 开始动画循环
   */
  startAnimationLoop() {
    const animate = () => {
      requestAnimationFrame(animate);
      
      // 获取时间增量
      const delta = this.sceneManager.getDelta();
      
      // 更新当前模式
      if (this.currentMode) {
        this.currentMode.update(delta);
      }
      
      // 渲染场景
      this.sceneManager.render();
    };
    
    animate();
  }
  
  /**
   * @method get scene
   * @description 获取场景对象
   * @returns {THREE.Scene} 场景对象
   */
  get scene() {
    return this.sceneManager.scene;
  }
  
  /**
   * @method get camera
   * @description 获取相机对象
   * @returns {THREE.Camera} 相机对象
   */
  get camera() {
    return this.sceneManager.camera;
  }
  
  /**
   * @method get renderer
   * @description 获取渲染器对象
   * @returns {THREE.WebGLRenderer} 渲染器对象
   */
  get renderer() {
    return this.sceneManager.renderer;
  }
}