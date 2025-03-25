import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import BuildingMode from './game/modes/BuildingMode.js';
import ShootingMode from './game/modes/ShootingMode.js';
import PuzzleMode from './game/modes/PuzzleMode.js';
import GameConfig from './game/core/GameConfig.js';
import AudioManager from './utils/AudioManager.js';
import UIManager from './utils/UIManager.js';

/**
 * @class Game
 * @description 游戏主类，负责初始化和管理游戏
 */
class Game {
  constructor() {
    // 基础设置
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      canvas: document.getElementById('game-canvas')
    });
    this.clock = new THREE.Clock();
    
    // 游戏配置
    this.config = new GameConfig();
    
    // 游戏模式
    this.currentMode = null;
    this.buildingMode = null;
    this.shootingMode = null;
    this.puzzleMode = null;
    
    // 工具类
    this.audioManager = null;
    this.uiManager = null;
    
    // 初始化
    this.init();
  }
  
  /**
   * @method init
   * @description 初始化游戏
   */
  init() {
    console.log('游戏初始化开始...');
    
    // 设置渲染器
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x87CEEB); // 天蓝色背景
    this.renderer.shadowMap.enabled = true;
    
    // 设置摄像机位置
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);
    
    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    this.scene.add(directionalLight);
    
    // 控制器（便于开发调试，发布版本可禁用）
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    
    // 初始化工具类
    this.audioManager = new AudioManager();
    // 播放背景音乐
    this.audioManager.playBackgroundMusic();
    
    // 创建地面
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8BF36B,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
    
    // 初始化游戏模式
    this.buildingMode = new BuildingMode(this);
    this.shootingMode = new ShootingMode(this);
    this.puzzleMode = new PuzzleMode(this);
    
    // 监听窗口大小变化
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
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
    
    // 开始动画循环
    this.animate();
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
        this.currentMode = this.buildingMode;
        break;
      case 'shooting':
        this.currentMode = this.shootingMode;
        break;
      case 'puzzle':
        this.currentMode = this.puzzleMode;
        break;
      default:
        console.error('未知的游戏模式:', mode);
        return;
    }
    
    // 初始化新模式
    this.currentMode.init();
    
    console.log(`已切换到${mode}模式`);
  }
  
  /**
   * @method onWindowResize
   * @description 处理窗口大小变化
   */
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  /**
   * @method animate
   * @description 动画循环
   */
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    const delta = this.clock.getDelta();
    
    // 更新控制器
    this.controls.update();
    
    // 更新当前模式
    if (this.currentMode) {
      this.currentMode.update(delta);
    }
    
    // 渲染场景
    this.renderer.render(this.scene, this.camera);
  }
}

// 当页面加载完成后启动游戏
window.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
}); 