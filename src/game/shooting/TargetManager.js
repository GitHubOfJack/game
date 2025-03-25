import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

/**
 * @class TargetManager
 * @description 管理射击模式中的目标生成和行为
 */
export default class TargetManager {
  /**
   * @constructor
   * @param {ShootingMode} shootingMode - 射击模式实例
   * @param {THREE.Scene} scene - 场景对象
   * @param {Object} config - 配置对象
   */
  constructor(shootingMode, scene, config) {
    this.shootingMode = shootingMode;
    this.scene = scene;
    this.config = config;
    
    // 目标列表
    this.targets = [];
    
    // 当前目标
    this.currentTarget = null;
    
    // 目标移动速度
    this.targetSpeed = 1.0;
    
    // 生成间隔
    this.spawnInterval = 3000; // ms
    this.spawnTimer = 0;
    
    // 字体引用
    this.font = null;
  }
  
  /**
   * @method setFont
   * @description 设置字体
   * @param {Font} font - 字体对象
   */
  setFont(font) {
    this.font = font;
  }
  
  /**
   * @method updateDifficulty
   * @description 根据难度更新目标参数
   * @param {number} difficulty - 难度等级
   */
  updateDifficulty(difficulty) {
    // 根据难度调整目标速度和生成间隔
    this.targetSpeed = 1.0 + (difficulty - 1) * 0.2;  // 1.0, 1.2, 1.4...
    this.spawnInterval = 3000 - (difficulty - 1) * 300;  // 3000, 2700, 2400...
  }
  
  /**
   * @method getRandomNumber
   * @description 获取随机数字
   * @returns {number} 1-9之间的随机数字
   */
  getRandomNumber() {
    return Math.floor(Math.random() * 9) + 1;
  }
  
  /**
   * @method getRandomLetter
   * @description 获取随机字母
   * @returns {string} A-Z之间的随机字母
   */
  getRandomLetter() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
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
      value = this.getRandomNumber();
    } else { // letter
      value = this.getRandomLetter();
    }
    
    // 设置当前目标
    this.currentTarget = {
      type: type,
      value: value
    };
    
    return this.currentTarget;
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
        targetValue = this.getRandomNumber();
        textContent = targetValue.toString();
      } else { // letter
        targetValue = this.getRandomLetter();
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
          if (distance < 2.5) { // 增加间距
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
    
    // 创建泡泡（外壳） - 增大尺寸
    const bubbleGeometry = new THREE.SphereGeometry(1.2, 32, 32); // 尺寸1.2
    const bubbleMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF, // 改为白色背景，使文字更明显
      transparent: true,
      opacity: 0.8, // 增加不透明度
      roughness: 0.2,
      metalness: 0.1
    });
    const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    target.add(bubble);
    
    // 内部底色 - 添加内部彩色底色
    const innerGeometry = new THREE.SphereGeometry(1.0, 32, 32);
    const innerColor = type === 'number' ? 0x4CAF50 : 0x2196F3; // 绿色或蓝色
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: innerColor,
      transparent: true,
      opacity: 0.9,
      roughness: 0.4,
      metalness: 0.1
    });
    const innerBubble = new THREE.Mesh(innerGeometry, innerMaterial);
    target.add(innerBubble);
    
    // 如果有字体，添加文字 - 改进文字显示
    if (this.font) {
      // 增大文字大小和厚度
      const textGeometry = new TextGeometry(textContent, {
        font: this.font,
        size: 1.0,  // 更大的字号
        height: 0.3, // 更厚的凸起
        curveSegments: 12, // 更高质量的曲线
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 5
      });
      
      // 居中
      textGeometry.computeBoundingBox();
      const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
      const textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;
      
      // 使用白色材质使文字更明显
      const textMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      
      // 中心定位
      textMesh.position.set(-textWidth/2, -textHeight/2, 0.5);
      
      // 使文字始终面向摄像机
      textMesh.rotation.x = -0.2; // 轻微向上倾斜
      
      target.add(textMesh);
      
      // 添加文字边缘，使其更立体
      const textOutlineMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const outlineGeometry = textGeometry.clone();
      const textOutline = new THREE.Mesh(outlineGeometry, textOutlineMaterial);
      textOutline.position.copy(textMesh.position);
      textOutline.position.z -= 0.02; // 略微在文字后面
      textOutline.rotation.copy(textMesh.rotation);
      textOutline.scale.multiplyScalar(1.05); // 略大于文字本身
      target.add(textOutline);
    }
    
    // 用户数据
    target.userData = {
      type: type,
      value: value,
      isTarget: this.currentTarget && 
               this.currentTarget.type === type && 
               this.currentTarget.value === value
    };
    
    // 如果是当前目标，添加明显的发光效果
    if (target.userData.isTarget) {
      // 增加三重发光效果，使目标更明显
      for (let i = 0; i < 3; i++) {
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0xFFFF00,
          transparent: true,
          opacity: 0.3 - i * 0.08
        });
        const glowSize = 1.5 + i * 0.3; // 逐层增大
        const glowSphere = new THREE.Mesh(
          new THREE.SphereGeometry(glowSize, 32, 32),
          glowMaterial
        );
        target.add(glowSphere);
      }
      
      // 添加脉动动画
      target.userData.pulseDirection = 1;
      target.userData.pulseValue = 0;
      
      // 添加明显的"目标"标识箭头
      this.addTargetIndicator(target);
    }
    
    return target;
  }
  
  /**
   * @method addTargetIndicator
   * @description 为目标添加标识箭头
   * @param {THREE.Group} target - 目标对象
   */
  addTargetIndicator(target) {
    // 创建箭头指示
    const arrowGeometry = new THREE.ConeGeometry(0.3, 0.8, 16);
    const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    
    // 上方箭头
    const topArrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    topArrow.position.set(0, 2.0, 0);
    topArrow.rotation.x = Math.PI; // 指向下方
    target.add(topArrow);
    
    // 添加动画效果
    topArrow.userData = {
      isIndicator: true,
      originalY: 2.0,
      phase: 0
    };
  }
  
  /**
   * @method removeTarget
   * @description 从场景中移除目标
   * @param {THREE.Group} target - 目标对象
   */
  removeTarget(target) {
    const index = this.targets.indexOf(target);
    if (index !== -1) {
      this.scene.remove(target);
      this.targets.splice(index, 1);
    }
  }
  
  /**
   * @method update
   * @description 更新所有目标
   * @param {number} delta - 时间增量
   */
  update(delta) {
    // 更新目标位置
    this.targets.forEach(target => {
      // 移动目标
      target.position.add(target.userData.velocity.clone().multiplyScalar(this.targetSpeed));
      
      // 旋转目标（但确保文字始终朝向摄像机）
      if (!target.userData.isTarget) {
        target.rotation.y += 0.01;
      } else {
        // 目标不旋转，保持文字朝向
        target.rotation.y = 0;
      }
      
      // 对当前目标添加脉动效果
      if (target.userData.isTarget && target.children.length > 1) {
        // 更新脉动值
        target.userData.pulseValue += 0.02 * target.userData.pulseDirection;
        if (target.userData.pulseValue > 1) {
          target.userData.pulseValue = 1;
          target.userData.pulseDirection = -1;
        } else if (target.userData.pulseValue < 0) {
          target.userData.pulseValue = 0;
          target.userData.pulseDirection = 1;
        }
        
        // 应用脉动效果
        for (let i = 4; i < target.children.length; i++) {
          const glow = target.children[i];
          if (!glow.userData.isIndicator) {
            glow.scale.set(
              1 + target.userData.pulseValue * 0.2,
              1 + target.userData.pulseValue * 0.2,
              1 + target.userData.pulseValue * 0.2
            );
          }
        }
        
        // 更新箭头指示器
        for (let i = 0; i < target.children.length; i++) {
          const child = target.children[i];
          if (child.userData && child.userData.isIndicator) {
            child.userData.phase += 0.05;
            child.position.y = child.userData.originalY + Math.sin(child.userData.phase) * 0.3;
          }
        }
      }
      
      // 边界检查（反弹）
      if (target.position.x < -8 || target.position.x > 8) {
        target.userData.velocity.x *= -1;
      }
      if (target.position.y < 1 || target.position.y > 8) {
        target.userData.velocity.y *= -1;
      }
    });
    
    // 生成新目标
    this.spawnTimer += delta * 1000;
    if (this.spawnTimer > this.spawnInterval && this.targets.length < 8) {
      this.spawnTargets(1);
      this.spawnTimer = 0;
    }
  }
}