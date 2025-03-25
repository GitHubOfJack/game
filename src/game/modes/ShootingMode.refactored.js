import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import TargetManager from '../shooting/TargetManager.js';
import BubbleManager from '../shooting/BubbleManager.js';

/**
 * @class ShootingMode
 * @description 射击配对模式实现类（重构版）
 */
export class ShootingMode {
  /**
   * @constructor
   * @param {Game} game - 游戏实例
   */
  constructor(game) {
    this.game = game;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.config = {
      difficulty: {
        current: 1
      },
      addStar: function(num) {
        console.log(`添加了 ${num} 颗星`);
      },
      parentControl: {
        taskCompleted: 0
      }
    };
    
    // 组件管理器
    this.targetManager = new TargetManager(this, this.scene, this.config);
    this.bubbleManager = new BubbleManager(this, this.scene);
    
    // 得分
    this.score = 0;
    
    // 是否已完成当前关卡
    this.isLevelCompleted = false;
    
    // 字体
    this.font = null;
    
    // 射线检测
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // 事件绑定
    this.boundOnMouseDown = this.onMouseDown.bind(this);
    
    // 十字准星
    this.crosshair = null;
    
    // UI管理器
    this.uiManager = {
      showTarget: function(type, value) {
        // 更新目标显示
        const targetValue = document.getElementById('target-value');
        if (targetValue) {
          targetValue.textContent = value;
          targetValue.style.backgroundColor = type === 'number' ? '#4CAF50' : '#2196F3';
          targetValue.classList.add('pulse-animation');
        }
      },
      updateScore: function(score) {
        // 更新分数显示
        const scoreValue = document.getElementById('score-value');
        if (scoreValue) {
          scoreValue.textContent = score;
        }
      },
      showInstruction: function(text) {
        // 创建或获取指令显示元素
        let instruction = document.querySelector('.game-instruction');
        if (!instruction) {
          instruction = document.createElement('div');
          instruction.className = 'game-instruction';
          document.body.appendChild(instruction);
        }
        
        // 设置内容和显示
        instruction.textContent = text;
        instruction.style.opacity = '1';
        
        // 3秒后隐藏
        setTimeout(() => {
          instruction.style.opacity = '0';
        }, 3000);
      },
      showSuccess: function(text) {
        // 创建浮动成功消息
        this.showFloatingMessage(text, 'success');
      },
      showError: function(text) {
        // 创建浮动错误消息
        this.showFloatingMessage(text, 'error');
      },
      showLevelComplete: function(score) {
        // 创建关卡完成提示
        this.showFloatingMessage(`关卡完成！得分：${score}`, 'level-complete');
      },
      showFloatingMessage: function(text, type) {
        // 创建浮动消息元素
        const message = document.createElement('div');
        message.className = `floating-message ${type}`;
        message.textContent = text;
        
        // 样式设置
        Object.assign(message.style, {
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px 40px',
          borderRadius: '30px',
          fontSize: '2rem',
          fontWeight: 'bold',
          zIndex: '100',
          opacity: '0',
          transition: 'opacity 0.3s, transform 0.5s',
          pointerEvents: 'none'
        });
        
        // 根据类型设置不同样式
        if (type === 'success') {
          Object.assign(message.style, {
            backgroundColor: 'rgba(76, 175, 80, 0.9)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          });
        } else if (type === 'error') {
          Object.assign(message.style, {
            backgroundColor: 'rgba(244, 67, 54, 0.9)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          });
        } else if (type === 'level-complete') {
          Object.assign(message.style, {
            backgroundColor: 'rgba(255, 193, 7, 0.9)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            fontSize: '2.5rem',
            padding: '30px 60px'
          });
        }
        
        // 添加到文档
        document.body.appendChild(message);
        
        // 显示动画
        setTimeout(() => {
          message.style.opacity = '1';
          message.style.transform = 'translate(-50%, -50%) scale(1.1)';
          
          // 2秒后开始隐藏
          setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translate(-50%, -100%) scale(0.9)';
            
            // 完全隐藏后移除元素
            setTimeout(() => {
              document.body.removeChild(message);
            }, 500);
          }, 2000);
        }, 10);
      }
    };
    
    // 音频管理器
    this.audioManager = {
      playSound: function(sound) {
        console.log(`播放音效: ${sound}`);
      }
    };
  }
  
  /**
   * @method init
   * @description 初始化射击模式
   */
  init() {
    // 加载字体
    const fontLoader = new FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      this.font = font;
      this.targetManager.setFont(font);
      this.setupScene();
    });
    
    // 设置摄像机位置
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);
    
    // 添加事件监听
    window.addEventListener('mousedown', this.boundOnMouseDown);
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    
    // 设置难度
    this.updateDifficulty();
    
    // 设置当前目标
    this.setCurrentTarget();
    
    // 创建十字准星
    this.createCrosshair();
    
    console.log('射击模式已初始化');
  }
  
  /**
   * @method cleanup
   * @description 清理资源
   */
  cleanup() {
    // 移除事件监听
    window.removeEventListener('mousedown', this.boundOnMouseDown);
    
    // 清理组件
    this.targetManager.targets.forEach(target => {
      this.scene.remove(target);
    });
    this.targetManager.targets = [];
    
    this.bubbleManager.cleanup();
    
    // 移除十字准星
    if (this.crosshair) {
      document.body.removeChild(this.crosshair);
      this.crosshair = null;
    }
    
    console.log('射击模式已清理');
  }
  
  /**
   * @method createCrosshair
   * @description 创建十字准星
   */
  createCrosshair() {
    // 创建十字准星DOM元素
    this.crosshair = document.createElement('div');
    this.crosshair.className = 'crosshair';
    
    // 设置样式
    Object.assign(this.crosshair.style, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '40px',
      height: '40px',
      marginLeft: '-20px',
      marginTop: '-20px',
      pointerEvents: 'none',
      zIndex: '1000',
      backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'><circle cx=\'20\' cy=\'20\' r=\'18\' stroke=\'red\' stroke-width=\'2\' fill=\'none\' stroke-opacity=\'0.7\'/><line x1=\'20\' y1=\'10\' x2=\'20\' y2=\'30\' stroke=\'red\' stroke-width=\'2\' stroke-opacity=\'0.7\'/><line x1=\'10\' y1=\'20\' x2=\'30\' y2=\'20\' stroke=\'red\' stroke-width=\'2\' stroke-opacity=\'0.7\'/></svg>")',
      backgroundSize: 'cover'
    });
    
    // 添加到文档
    document.body.appendChild(this.crosshair);
  }
  
  /**
   * @method setupScene
   * @description 设置场景元素
   */
  setupScene() {
    // 创建背景
    this.createBackground();
    
    // 生成初始目标
    this.targetManager.spawnTargets(5);
  }
  
  /**
   * @method createBackground
   * @description 创建背景
   */
  createBackground() {
    // 创建天空背景
    const skyGeometry = new THREE.SphereGeometry(50, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
      color: 0x87CEEB,
      side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    this.scene.add(sky);
    
    // 创建云朵
    for (let i = 0; i < 15; i++) {
      this.createCloud(
        Math.random() * 40 - 20,
        Math.random() * 10 + 10,
        Math.random() * 40 - 20,
        Math.random() * 0.5 + 0.5
      );
    }
  }
  
  /**
   * @method createCloud
   * @description 创建云朵
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   * @param {number} z - Z坐标
   * @param {number} scale - 缩放比例
   */
  createCloud(x, y, z, scale) {
    const cloudGroup = new THREE.Group();
    
    // 云朵材质
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.9,
      metalness: 0.1
    });
    
    // 创建几个球体组成云朵
    const positions = [
      { x: 0, y: 0, z: 0, radius: 1 },
      { x: 1, y: 0.2, z: 0, radius: 0.8 },
      { x: -1, y: -0.1, z: 0, radius: 0.7 },
      { x: 0, y: 0.5, z: 0.5, radius: 0.7 },
      { x: 0.5, y: -0.3, z: -0.5, radius: 0.6 }
    ];
    
    for (const pos of positions) {
      const cloudPartGeometry = new THREE.SphereGeometry(pos.radius, 16, 16);
      const cloudPart = new THREE.Mesh(cloudPartGeometry, cloudMaterial);
      cloudPart.position.set(pos.x, pos.y, pos.z);
      cloudGroup.add(cloudPart);
    }
    
    // 设置位置和缩放
    cloudGroup.position.set(x, y, z);
    cloudGroup.scale.set(scale, scale, scale);
    
    // 添加到场景
    this.scene.add(cloudGroup);
    
    return cloudGroup;
  }
  
  /**
   * @method setCurrentTarget
   * @description 设置当前目标
   */
  setCurrentTarget() {
    // 设置当前目标
    const currentTarget = this.targetManager.setCurrentTarget();
    
    // 更新UI显示
    if (this.uiManager) {
      this.uiManager.showTarget(currentTarget.type, currentTarget.value);
    }
    
    // 语音提示
    let instruction = '';
    if (currentTarget.type === 'number') {
      instruction = `请狙击数字 ${currentTarget.value}`;
    } else {
      instruction = `请狙击字母 ${currentTarget.value}`;
    }
    
    console.log('语音提示:', instruction);
    
    // 在UI上显示提示
    if (this.uiManager) {
      this.uiManager.showInstruction(instruction);
    }
    
    return currentTarget;
  }
  
  /**
   * @method updateDifficulty
   * @description 根据当前难度更新游戏参数
   */
  updateDifficulty() {
    const difficulty = this.config.difficulty.current;
    this.targetManager.updateDifficulty(difficulty);
  }
  
  /**
   * @method onMouseMove
   * @description 鼠标移动事件处理
   * @param {MouseEvent} event - 鼠标事件
   */
  onMouseMove(event) {
    // 更新鼠标位置
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // 从摄像机发射射线
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // 计算射线与XZ平面的交点
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const planeIntersect = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(plane, planeIntersect);
    
    // 更新狙击手瞄准方向
    if (this.bubbleManager.sniper) {
      this.bubbleManager.sniper.aimAt(planeIntersect);
    }
  }
  
  /**
   * @method onMouseDown
   * @description 鼠标按下事件处理
   * @param {MouseEvent} event - 鼠标事件
   */
  onMouseDown(event) {
    // 更新鼠标位置
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // 从摄像机发射射线
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // 计算射线与XZ平面的交点
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const planeIntersect = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(plane, planeIntersect);
    
    // 使用狙击手射击
    this.bubbleManager.shootAt(planeIntersect);
    
    // 播放发射音效
    if (this.audioManager) {
      this.audioManager.playSound('shoot');
    }
  }
  
  /**
   * @method onTargetHit
   * @description 击中正确目标时的处理
   * @param {THREE.Group} target - 被击中的目标
   */
  onTargetHit(target) {
    console.log('击中正确目标!');
    
    // 播放成功音效
    if (this.audioManager) {
      this.audioManager.playSound('success');
    }
    
    // 增加分数
    this.score += 10;
    
    // 创建爆炸效果
    this.bubbleManager.createExplosion(target.position, 0x00FF00);
    
    // 更新UI
    if (this.uiManager) {
      this.uiManager.updateScore(this.score);
      this.uiManager.showSuccess('完美命中！');
    }
    
    // 设置新目标
    this.setCurrentTarget();
    
    // 添加奖励
    this.config.addStar(1);
    
    // 更新任务完成计数
    this.config.parentControl.taskCompleted++;
    
    // 移除目标
    this.targetManager.removeTarget(target);
    
    // 检查是否完成关卡
    if (this.score >= 50) {
      this.completeLevel();
    }
  }
  
  /**
   * @method onWrongTargetHit
   * @description 击中错误目标时的处理
   * @param {THREE.Group} target - 被击中的目标
   */
  onWrongTargetHit(target) {
    console.log('击中错误目标');
    
    // 播放失败音效
    if (this.audioManager) {
      this.audioManager.playSound('wrong');
    }
    
    // 创建爆炸效果
    this.bubbleManager.createExplosion(target.position, 0xFF0000);
    
    // 更新UI
    if (this.uiManager) {
      this.uiManager.showError('目标错误！再试一次');
    }
    
    // 移除目标
    this.targetManager.removeTarget(target);
  }
  
  /**
   * @method completeLevel
   * @description 完成关卡
   */
  completeLevel() {
    if (this.isLevelCompleted) return;
    
    this.isLevelCompleted = true;
    console.log('恭喜！关卡完成！');
    
    // 更新难度
    this.config.difficulty.current++;
    
    // 显示完成信息
    if (this.uiManager) {
      this.uiManager.showLevelComplete(this.score);
    }
    
    // 重置状态
    setTimeout(() => {
      this.score = 0;
      this.isLevelCompleted = false;
      
      // 清理当前目标
      this.targetManager.targets.forEach(target => {
        this.scene.remove(target);
      });
      this.targetManager.targets = [];
      
      // 更新难度设置
      this.updateDifficulty();
      
      // 生成新目标
      this.targetManager.spawnTargets(5);
      
      // 设置新目标
      this.setCurrentTarget();
      
      // 更新UI
      if (this.uiManager) {
        this.uiManager.updateScore(this.score);
      }
    }, 3000);
  }
  
  /**
   * @method onWindowResize
   * @description 处理窗口大小变化
   */
  onWindowResize() {
    // 更新相机
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
  
  /**
   * @method onSoundToggle
   * @description 处理声音开关变化
   * @param {boolean} enabled - 是否启用声音
   */
  onSoundToggle(enabled) {
    console.log(`声音已${enabled ? '开启' : '关闭'}`);
  }
  
  /**
   * @method render
   * @description 渲染方法，被Game类调用
   */
  render() {
    if (this.game.renderer) {
      this.game.renderer.render(this.scene, this.camera);
    }
  }
  
  /**
   * @method update
   * @description 更新方法，每帧调用
   * @param {number} delta - 时间增量
   */
  update(delta) {
    // 更新组件
    this.bubbleManager.update();
    this.targetManager.update(delta);
  }
}