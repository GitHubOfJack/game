import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

/**
 * @class ShootingMode
 * @description 射击配对模式实现类
 */
export default class ShootingMode {
  /**
   * @constructor
   * @param {Game} game - 游戏实例
   */
  constructor(game) {
    this.game = game;
    this.scene = game.scene;
    this.camera = game.camera;
    this.config = game.config;
    
    // 泡泡发射器
    this.launcher = null;
    
    // 目标物体
    this.targets = [];
    
    // 发射的泡泡
    this.bubbles = [];
    
    // 当前目标
    this.currentTarget = null;
    
    // 得分
    this.score = 0;
    
    // 是否已完成当前关卡
    this.isLevelCompleted = false;
    
    // 字体
    this.font = null;
    
    // 难度相关
    this.targetSpeed = 1.0;  // 目标移动速度
    this.spawnInterval = 3000;  // 目标生成间隔（毫秒）
    this.spawnTimer = 0;
    
    // 射线检测
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // 事件绑定
    this.boundOnMouseDown = this.onMouseDown.bind(this);
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
      this.setupScene();
    });
    
    // 设置摄像机位置
    this.game.camera.position.set(0, 5, 10);
    this.game.camera.lookAt(0, 0, 0);
    
    // 添加事件监听
    window.addEventListener('mousedown', this.boundOnMouseDown);
    
    // 设置难度
    this.updateDifficulty();
    
    // 设置当前目标
    this.setCurrentTarget();
    
    console.log('射击模式已初始化');
  }
  
  /**
   * @method cleanup
   * @description 清理资源
   */
  cleanup() {
    // 移除事件监听
    window.removeEventListener('mousedown', this.boundOnMouseDown);
    
    // 清理目标
    this.targets.forEach(target => {
      this.scene.remove(target);
    });
    this.targets = [];
    
    // 清理泡泡
    this.bubbles.forEach(bubble => {
      this.scene.remove(bubble);
    });
    this.bubbles = [];
    
    // 清理发射器
    if (this.launcher) {
      this.scene.remove(this.launcher);
      this.launcher = null;
    }
    
    console.log('射击模式已清理');
  }
  
  /**
   * @method setupScene
   * @description 设置场景元素
   */
  setupScene() {
    // 创建背景
    this.createBackground();
    
    // 创建泡泡发射器
    this.createLauncher();
    
    // 生成初始目标
    this.spawnTargets(5);
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
   * @method createLauncher
   * @description 创建泡泡发射器
   */
  createLauncher() {
    // 创建发射器组
    this.launcher = new THREE.Group();
    
    // 底座
    const baseGeometry = new THREE.CylinderGeometry(1, 1.2, 0.5, 16);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0xFF69B4, // 粉色
      roughness: 0.8,
      metalness: 0.2
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.25;
    this.launcher.add(base);
    
    // 发射管
    const tubeGeometry = new THREE.CylinderGeometry(0.5, 0.7, 1.5, 16);
    const tubeMaterial = new THREE.MeshStandardMaterial({
      color: 0x9370DB, // 紫色
      roughness: 0.7,
      metalness: 0.3
    });
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    tube.position.y = 1.2;
    tube.rotation.x = Math.PI / 4; // 倾斜45度
    this.launcher.add(tube);
    
    // 装饰
    const decorGeometry = new THREE.TorusGeometry(0.6, 0.1, 16, 32);
    const decorMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFD700, // 金色
      roughness: 0.5,
      metalness: 0.5
    });
    const decor = new THREE.Mesh(decorGeometry, decorMaterial);
    decor.position.y = 0.6;
    decor.rotation.x = Math.PI / 2;
    this.launcher.add(decor);
    
    // 设置位置
    this.launcher.position.set(0, 0, 7);
    
    // 添加到场景
    this.scene.add(this.launcher);
  }
  
  /**
   * @method spawnTargets
   * @description 生成目标
   * @param {number} count - 目标数量
   */
  spawnTargets(count) {
    // 可能的目标类型
    const targetTypes = ['number', 'letter'];
    
    for (let i = 0; i < count; i++) {
      // 随机选择目标类型
      const type = targetTypes[Math.floor(Math.random() * targetTypes.length)];
      
      // 根据类型创建目标
      let targetValue;
      let textContent;
      
      if (type === 'number') {
        targetValue = this.config.getRandomNumber();
        textContent = targetValue.toString();
      } else { // letter
        targetValue = this.config.getRandomLetter();
        textContent = targetValue;
      }
      
      // 创建目标
      const target = this.createTarget(type, targetValue, textContent);
      
      // 随机位置（不重叠）
      let isOverlap;
      let position;
      
      do {
        isOverlap = false;
        position = new THREE.Vector3(
          Math.random() * 16 - 8,
          Math.random() * 6 + 2,
          Math.random() * 8 - 10
        );
        
        // 检查是否与现有目标重叠
        for (const existing of this.targets) {
          const distance = position.distanceTo(existing.position);
          if (distance < 2) {
            isOverlap = true;
            break;
          }
        }
      } while (isOverlap);
      
      // 设置位置
      target.position.copy(position);
      
      // 随机运动方向
      target.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.04,
        0
      );
      
      // 添加到场景和目标列表
      this.scene.add(target);
      this.targets.push(target);
    }
  }
  
  /**
   * @method createTarget
   * @description 创建目标
   * @param {string} type - 目标类型: 'number' 或 'letter'
   * @param {any} value - 目标值
   * @param {string} textContent - 显示的文本
   * @returns {THREE.Group} 目标组
   */
  createTarget(type, value, textContent) {
    // 创建目标组
    const target = new THREE.Group();
    
    // 创建泡泡（外壳）
    const bubbleGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const bubbleMaterial = new THREE.MeshStandardMaterial({
      color: 0x40E0D0, // 绿松石色
      transparent: true,
      opacity: 0.6,
      roughness: 0.2,
      metalness: 0.1
    });
    const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    target.add(bubble);
    
    // 如果有字体，添加文字
    if (this.font) {
      const textGeometry = new TextGeometry(textContent, {
        font: this.font,
        size: 0.5,
        height: 0.1
      });
      // 居中
      textGeometry.computeBoundingBox();
      const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
      
      const textMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(-textWidth/2, -0.25, 0);
      target.add(textMesh);
    }
    
    // 用户数据
    target.userData = {
      type: type,
      value: value,
      isTarget: this.currentTarget && 
               this.currentTarget.type === type && 
               this.currentTarget.value === value
    };
    
    // 如果是当前目标，添加发光效果
    if (target.userData.isTarget) {
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFF00,
        transparent: true,
        opacity: 0.3
      });
      const glowSphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        glowMaterial
      );
      target.add(glowSphere);
    }
    
    return target;
  }
  
  /**
   * @method shootBubble
   * @description 发射泡泡
   * @param {THREE.Vector3} direction - 发射方向
   */
  shootBubble(direction) {
    // 创建泡泡几何体
    const bubbleGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const bubbleMaterial = new THREE.MeshStandardMaterial({
      color: 0xFF69B4, // 粉色
      transparent: true,
      opacity: 0.7,
      roughness: 0.1,
      metalness: 0.3
    });
    const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    
    // 设置泡泡初始位置（从发射器发出）
    bubble.position.copy(this.launcher.position);
    bubble.position.y += 1;
    
    // 设置运动方向和速度
    bubble.userData = {
      velocity: direction.normalize().multiplyScalar(0.2),
      age: 0
    };
    
    // 添加到场景和泡泡列表
    this.scene.add(bubble);
    this.bubbles.push(bubble);
    
    // 播放发射音效
    console.log('发射泡泡！');
    
    // 在实际应用中，这里会播放音效
    if (this.game.audioManager) {
      this.game.audioManager.playSound('shoot');
    }
  }
  
  /**
   * @method setCurrentTarget
   * @description 设置当前目标
   */
  setCurrentTarget() {
    // 随机选择目标类型
    const targetTypes = ['number', 'letter'];
    const type = targetTypes[Math.floor(Math.random() * targetTypes.length)];
    
    // 根据类型选择值
    let value;
    if (type === 'number') {
      value = this.config.getRandomNumber();
    } else { // letter
      value = this.config.getRandomLetter();
    }
    
    // 设置当前目标
    this.currentTarget = {
      type: type,
      value: value
    };
    
    // 更新UI显示
    if (this.game.uiManager) {
      this.game.uiManager.showTarget(type, value);
    }
    
    // 语音提示
    let instruction = '';
    if (type === 'number') {
      instruction = `请击中数字 ${value}`;
    } else {
      instruction = `请击中字母 ${value}`;
    }
    
    console.log('语音提示:', instruction);
    
    // 在UI上显示提示
    if (this.game.uiManager) {
      this.game.uiManager.showInstruction(instruction);
    }
  }
  
  /**
   * @method updateDifficulty
   * @description 根据当前难度更新游戏参数
   */
  updateDifficulty() {
    const difficulty = this.config.difficulty.current;
    
    // 根据难度调整目标速度和生成间隔
    this.targetSpeed = 1.0 + (difficulty - 1) * 0.2;  // 1.0, 1.2, 1.4...
    this.spawnInterval = 3000 - (difficulty - 1) * 300;  // 3000, 2700, 2400...
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
    
    // 计算从发射器到交点的方向
    const direction = new THREE.Vector3();
    direction.subVectors(planeIntersect, this.launcher.position);
    direction.y = Math.abs(direction.y); // 确保向上发射
    
    // 发射泡泡
    this.shootBubble(direction);
  }
  
  /**
   * @method checkBubbleCollisions
   * @description 检查泡泡与目标的碰撞
   */
  checkBubbleCollisions() {
    // 循环所有泡泡
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const bubble = this.bubbles[i];
      
      // 检查泡泡是否超出边界
      if (bubble.position.y > 15 || 
          bubble.position.x < -15 || bubble.position.x > 15 ||
          bubble.position.z < -15 || bubble.position.z > 15 ||
          bubble.userData.age > 200) {
        // 移除超出边界或过老的泡泡
        this.scene.remove(bubble);
        this.bubbles.splice(i, 1);
        continue;
      }
      
      // 循环所有目标检查碰撞
      for (let j = this.targets.length - 1; j >= 0; j--) {
        const target = this.targets[j];
        
        // 计算距离
        const distance = bubble.position.distanceTo(target.position);
        
        // 如果距离小于两者半径之和，发生碰撞
        if (distance < 0.8 + 0.3) { // 目标半径 + 泡泡半径
          // 检查是否是当前目标
          if (target.userData.isTarget) {
            // 击中正确目标
            this.onTargetHit(target);
          } else {
            // 击中错误目标
            this.onWrongTargetHit(target);
          }
          
          // 移除泡泡
          this.scene.remove(bubble);
          this.bubbles.splice(i, 1);
          
          // 移除目标
          this.scene.remove(target);
          this.targets.splice(j, 1);
          
          // 退出内层循环
          break;
        }
      }
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
    if (this.game.audioManager) {
      this.game.audioManager.playSound('success');
    }
    
    // 增加分数
    this.score += 10;
    
    // 创建爆炸效果
    this.createExplosion(target.position, 0x00FF00);
    
    // 更新UI
    if (this.game.uiManager) {
      this.game.uiManager.updateScore(this.score);
      this.game.uiManager.showSuccess('做得好！');
    }
    
    // 设置新目标
    this.setCurrentTarget();
    
    // 添加奖励
    this.config.addStar(1);
    
    // 更新任务完成计数
    this.config.parentControl.taskCompleted++;
    
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
    if (this.game.audioManager) {
      this.game.audioManager.playSound('wrong');
    }
    
    // 创建爆炸效果
    this.createExplosion(target.position, 0xFF0000);
    
    // 更新UI
    if (this.game.uiManager) {
      this.game.uiManager.showError('不对哦，再试一次');
    }
  }
  
  /**
   * @method createExplosion
   * @description 创建爆炸效果
   * @param {THREE.Vector3} position - 爆炸位置
   * @param {number} color - 爆炸颜色
   */
  createExplosion(position, color) {
    // 创建粒子组
    const explosionGroup = new THREE.Group();
    explosionGroup.position.copy(position);
    
    // 创建多个粒子
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      // 随机方向
      const direction = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ).normalize();
      
      // 随机速度
      const speed = Math.random() * 0.1 + 0.05;
      
      // 设置粒子属性
      particle.userData = {
        velocity: direction.multiplyScalar(speed),
        age: 0,
        maxAge: Math.random() * 30 + 20
      };
      
      explosionGroup.add(particle);
    }
    
    // 添加到场景
    this.scene.add(explosionGroup);
    
    // 存储爆炸效果
    if (!this.explosions) this.explosions = [];
    this.explosions.push(explosionGroup);
  }
  
  /**
   * @method updateExplosions
   * @description 更新爆炸效果
   */
  updateExplosions() {
    if (!this.explosions) return;
    
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const explosion = this.explosions[i];
      let allParticlesRemoved = true;
      
      // 更新所有粒子
      for (let j = explosion.children.length - 1; j >= 0; j--) {
        const particle = explosion.children[j];
        
        // 更新位置
        particle.position.add(particle.userData.velocity);
        
        // 更新年龄和透明度
        particle.userData.age++;
        particle.material.opacity = 1 - (particle.userData.age / particle.userData.maxAge);
        
        // 移除过旧的粒子
        if (particle.userData.age >= particle.userData.maxAge) {
          explosion.remove(particle);
        } else {
          allParticlesRemoved = false;
        }
      }
      
      // 如果所有粒子都被移除，移除整个爆炸效果
      if (allParticlesRemoved) {
        this.scene.remove(explosion);
        this.explosions.splice(i, 1);
      }
    }
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
    this.config.increaseDifficulty();
    
    // 显示完成信息
    if (this.game.uiManager) {
      this.game.uiManager.showLevelComplete(this.score);
    }
    
    // 重置状态
    setTimeout(() => {
      this.score = 0;
      this.isLevelCompleted = false;
      
      // 清理当前目标
      this.targets.forEach(target => {
        this.scene.remove(target);
      });
      this.targets = [];
      
      // 更新难度设置
      this.updateDifficulty();
      
      // 生成新目标
      this.spawnTargets(5);
      
      // 设置新目标
      this.setCurrentTarget();
      
      // 更新UI
      if (this.game.uiManager) {
        this.game.uiManager.updateScore(this.score);
      }
    }, 3000);
  }
  
  /**
   * @method update
   * @description 更新方法，每帧调用
   * @param {number} delta - 时间增量
   */
  update(delta) {
    // 更新泡泡位置
    this.bubbles.forEach(bubble => {
      bubble.position.add(bubble.userData.velocity);
      bubble.userData.age++;
      
      // 添加重力效果
      bubble.userData.velocity.y -= 0.001;
    });
    
    // 更新目标位置
    this.targets.forEach(target => {
      // 移动目标
      target.position.add(target.userData.velocity.clone().multiplyScalar(this.targetSpeed));
      
      // 旋转目标
      target.rotation.x += 0.005;
      target.rotation.y += 0.01;
      
      // 边界检查（反弹）
      if (target.position.x < -8 || target.position.x > 8) {
        target.userData.velocity.x *= -1;
      }
      if (target.position.y < 1 || target.position.y > 8) {
        target.userData.velocity.y *= -1;
      }
    });
    
    // 检查碰撞
    this.checkBubbleCollisions();
    
    // 更新爆炸效果
    this.updateExplosions();
    
    // 生成新目标
    this.spawnTimer += delta * 1000;
    if (this.spawnTimer > this.spawnInterval && this.targets.length < 10) {
      this.spawnTargets(1);
      this.spawnTimer = 0;
    }
  }
} 