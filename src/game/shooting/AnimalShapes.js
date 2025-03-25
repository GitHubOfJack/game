import * as THREE from 'three';

/**
 * @class AnimalShapes
 * @description 生成各种动物形状的辅助类
 */
export default class AnimalShapes {
  /**
   * @method createRabbit
   * @description 创建兔子形状
   * @param {number} color - 颜色
   * @param {number} scale - 缩放比例
   * @returns {THREE.Group} 兔子形状组
   */
  static createRabbit(color = 0xFFCCCC, scale = 1) {
    const group = new THREE.Group();
    
    // 身体（椭球）
    const bodyGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    bodyGeometry.scale(1, 1.2, 0.8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: color,
      roughness: 0.6,
      metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);
    
    // 头部
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ 
      color: color,
      roughness: 0.6,
      metalness: 0.1
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 0.4, 0);
    group.add(head);
    
    // 耳朵
    const earGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
    earGeometry.scale(1, 1, 0.5);
    const earMaterial = new THREE.MeshStandardMaterial({ 
      color: color,
      roughness: 0.6,
      metalness: 0.1
    });
    
    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(-0.12, 0.7, 0);
    leftEar.rotation.z = -Math.PI / 12;
    group.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(0.12, 0.7, 0);
    rightEar.rotation.z = Math.PI / 12;
    group.add(rightEar);
    
    // 眼睛
    const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.1, 0.45, 0.2);
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.1, 0.45, 0.2);
    group.add(rightEye);
    
    // 鼻子
    const noseGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const noseMaterial = new THREE.MeshBasicMaterial({ color: 0xFF7777 });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0, 0.35, 0.24);
    group.add(nose);
    
    // 整体缩放
    group.scale.set(scale, scale, scale);
    
    return group;
  }
  
  /**
   * @method createCat
   * @description 创建猫形状
   * @param {number} color - 颜色
   * @param {number} scale - 缩放比例
   * @returns {THREE.Group} 猫形状组
   */
  static createCat(color = 0xDDAA77, scale = 1) {
    const group = new THREE.Group();
    
    // 身体（椭球）
    const bodyGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    bodyGeometry.scale(1, 0.9, 0.8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: color,
      roughness: 0.6,
      metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);
    
    // 头部
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ 
      color: color,
      roughness: 0.6,
      metalness: 0.1
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 0.3, 0);
    group.add(head);
    
    // 耳朵
    const earGeometry = new THREE.ConeGeometry(0.1, 0.2, 4);
    const earMaterial = new THREE.MeshStandardMaterial({ 
      color: color,
      roughness: 0.6,
      metalness: 0.1
    });
    
    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(-0.15, 0.55, 0);
    leftEar.rotation.z = -Math.PI / 6;
    group.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(0.15, 0.55, 0);
    rightEar.rotation.z = Math.PI / 6;
    group.add(rightEar);
    
    // 眼睛
    const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x44FF44 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.1, 0.35, 0.2);
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.1, 0.35, 0.2);
    group.add(rightEye);
    
    // 鼻子
    const noseGeometry = new THREE.SphereGeometry(0.03, 8, 8);
    const noseMaterial = new THREE.MeshBasicMaterial({ color: 0xFF7777 });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0, 0.28, 0.24);
    group.add(nose);
    
    // 胡须
    const whiskerGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.2, 3);
    const whiskerMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    
    for (let i = 0; i < 3; i++) {
      const leftWhisker = new THREE.Mesh(whiskerGeometry, whiskerMaterial);
      leftWhisker.position.set(-0.15, 0.28 - i * 0.03, 0.2);
      leftWhisker.rotation.z = Math.PI / 2;
      leftWhisker.rotation.y = -Math.PI / 8;
      group.add(leftWhisker);
      
      const rightWhisker = new THREE.Mesh(whiskerGeometry, whiskerMaterial);
      rightWhisker.position.set(0.15, 0.28 - i * 0.03, 0.2);
      rightWhisker.rotation.z = Math.PI / 2;
      rightWhisker.rotation.y = Math.PI / 8;
      group.add(rightWhisker);
    }
    
    // 整体缩放
    group.scale.set(scale, scale, scale);
    
    return group;
  }
  
  /**
   * @method createOwl
   * @description 创建猫头鹰形状
   * @param {number} color - 颜色
   * @param {number} scale - 缩放比例
   * @returns {THREE.Group} 猫头鹰形状组
   */
  static createOwl(color = 0x8B4513, scale = 1) {
    const group = new THREE.Group();
    
    // 身体
    const bodyGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    bodyGeometry.scale(1, 1.2, 0.8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: color,
      roughness: 0.6,
      metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);
    
    // 头部
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ 
      color: color,
      roughness: 0.6,
      metalness: 0.1
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 0.4, 0);
    group.add(head);
    
    // 翅膀
    const wingGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    wingGeometry.scale(0.5, 1, 0.3);
    const wingMaterial = new THREE.MeshStandardMaterial({ 
      color: color,
      roughness: 0.6,
      metalness: 0.1
    });
    
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-0.3, 0, 0);
    leftWing.rotation.z = Math.PI / 6;
    group.add(leftWing);
    
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0.3, 0, 0);
    rightWing.rotation.z = -Math.PI / 6;
    group.add(rightWing);
    
    // 大眼睛
    const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.1, 0.45, 0.2);
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.1, 0.45, 0.2);
    group.add(rightEye);
    
    // 瞳孔
    const pupilGeometry = new THREE.SphereGeometry(0.04, 8, 8);
    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(-0.1, 0.45, 0.28);
    group.add(leftPupil);
    
    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(0.1, 0.45, 0.28);
    group.add(rightPupil);
    
    // 嘴
    const beakGeometry = new THREE.ConeGeometry(0.07, 0.15, 4);
    beakGeometry.rotateX(-Math.PI / 2);
    const beakMaterial = new THREE.MeshBasicMaterial({ color: 0xFFAA00 });
    const beak = new THREE.Mesh(beakGeometry, beakMaterial);
    beak.position.set(0, 0.35, 0.3);
    group.add(beak);
    
    // 整体缩放
    group.scale.set(scale, scale, scale);
    
    return group;
  }
  
  /**
   * @method createDog
   * @description 创建狗形状
   * @param {number} color - 颜色
   * @param {number} scale - 缩放比例
   * @returns {THREE.Group} 狗形状组
   */
  static createDog(color = 0xCCBA88, scale = 1) {
    const group = new THREE.Group();
    
    // 身体
    const bodyGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    bodyGeometry.scale(1.2, 0.9, 0.8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: color,
      roughness: 0.6,
      metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);
    
    // 头部
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ 
      color: color,
      roughness: 0.6,
      metalness: 0.1
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 0.25, 0.2);
    group.add(head);
    
    // 耳朵
    const earGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    earGeometry.scale(1, 1, 0.5);
    const earMaterial = new THREE.MeshStandardMaterial({ 
      color: color,
      roughness: 0.6,
      metalness: 0.1
    });
    
    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(-0.2, 0.45, 0.1);
    group.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(0.2, 0.45, 0.1);
    group.add(rightEar);
    
    // 眼睛
    const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 0.3, 0.4);
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 0.3, 0.4);
    group.add(rightEye);
    
    // 鼻子
    const noseGeometry = new THREE.SphereGeometry(0.06, 8, 8);
    const noseMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0, 0.2, 0.45);
    group.add(nose);
    
    // 嘴巴
    const mouthGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    mouthGeometry.scale(1, 0.5, 0.8);
    const mouthMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xEECCAA,
      roughness: 0.6,
      metalness: 0.1
    });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, 0.1, 0.4);
    group.add(mouth);
    
    // 整体缩放
    group.scale.set(scale, scale, scale);
    
    return group;
  }
  
  /**
   * @method createSnake
   * @description 创建蛇形状
   * @param {number} color - 颜色
   * @param {number} scale - 缩放比例
   * @returns {THREE.Group} 蛇形状组
   */
  static createSnake(color = 0x33CC33, scale = 1) {
    const group = new THREE.Group();
    
    // 创建蛇身体各段
    const segments = 6;
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: color,
      roughness: 0.6,
      metalness: 0.1
    });
    
    // 头部
    const headGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    headGeometry.scale(1.2, 0.8, 1);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.set(0, 0, 0);
    group.add(head);
    
    // 蛇身
    for (let i = 1; i < segments; i++) {
      const segmentSize = 0.2 - (i * 0.025);
      const segmentGeometry = new THREE.SphereGeometry(segmentSize, 16, 16);
      const segment = new THREE.Mesh(segmentGeometry, bodyMaterial);
      
      // 摆出S形状
      const offset = i * 0.25;
      const xPos = Math.sin(i * 0.7) * 0.2;
      segment.position.set(xPos, 0, -offset);
      
      group.add(segment);
    }
    
    // 眼睛
    const eyeGeometry = new THREE.SphereGeometry(0.04, 8, 8);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.12, 0.05, 0.15);
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.12, 0.05, 0.15);
    group.add(rightEye);
    
    // 舌头
    const tongueGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.3, 3);
    const tongueMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    const tongue = new THREE.Mesh(tongueGeometry, tongueMaterial);
    tongue.position.set(0, -0.02, 0.3);
    tongue.rotation.x = Math.PI / 2;
    
    // 舌尖分叉
    const forkGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 3);
    
    const leftFork = new THREE.Mesh(forkGeometry, tongueMaterial);
    leftFork.position.set(-0.05, 0, 0.15);
    leftFork.rotation.z = -Math.PI / 8;
    tongue.add(leftFork);
    
    const rightFork = new THREE.Mesh(forkGeometry, tongueMaterial);
    rightFork.position.set(0.05, 0, 0.15);
    rightFork.rotation.z = Math.PI / 8;
    tongue.add(rightFork);
    
    group.add(tongue);
    
    // 整体缩放
    group.scale.set(scale, scale, scale);
    
    return group;
  }
  
  /**
   * @method getRandomAnimal
   * @description 随机创建一个动物
   * @param {number} scale - 缩放比例
   * @returns {THREE.Group} 随机动物形状
   */
  static getRandomAnimal(scale = 1) {
    const animalTypes = ['rabbit', 'cat', 'owl', 'dog', 'snake'];
    const randomType = animalTypes[Math.floor(Math.random() * animalTypes.length)];
    
    // 随机颜色
    const colors = [
      0xFFCCCC, // 粉红
      0xDDAA77, // 棕色
      0x8B4513, // 深棕
      0xCCBA88, // 浅棕
      0x33CC33, // 绿色
      0x9370DB, // 紫色
      0x6495ED, // 蓝色
      0xFFA500  // 橙色
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // 根据类型创建对应动物
    switch (randomType) {
      case 'rabbit':
        return this.createRabbit(randomColor, scale);
      case 'cat':
        return this.createCat(randomColor, scale);
      case 'owl':
        return this.createOwl(randomColor, scale);
      case 'dog':
        return this.createDog(randomColor, scale);
      case 'snake':
        return this.createSnake(randomColor, scale);
      default:
        return this.createRabbit(randomColor, scale);
    }
  }
}