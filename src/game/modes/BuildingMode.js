import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

/**
 * @class BuildingMode
 * @description 搭建模式实现类
 */
export default class BuildingMode {
  /**
   * @constructor
   * @param {Game} game - 游戏实例
   */
  constructor(game) {
    this.game = game;
    this.scene = game.scene;
    this.camera = game.camera;
    this.renderer = game.renderer;
    this.audioManager = game.audioManager;
    this.config = game.config;
    
    // 形状库
    this.shapeLibrary = [];
    
    // 搭建区域
    this.buildArea = null;
    
    // 当前选中的形状
    this.selectedShape = null;
    
    // 当前任务
    this.currentTask = null;
    
    // 引导箭头和提示 (新增)
    this.guideArrow = null;
    this.hintTimeout = null;
    
    // 自动辅助计时器 (新增)
    this.autoAssistTimer = null;
  }
  
  /**
   * @method init
   * @description 初始化搭建模式
   */
  init() {
    // 创建简单明亮的背景
    this.createSimpleBackground();
    
    // 创建超大搭建区域，便于操作
    this.createBuildArea();
    
    // 创建简单、色彩明亮的形状库
    this.createShapeLibrary();
    
    // 创建引导元素 (新增)
    this.createGuideElements();
    
    // 设置简单的第一个任务
    this.setTask();
    
    // 添加事件监听
    this.addEventListeners();
    
    // 播放欢迎语音
    this.playWelcomeVoice();
  }
  
  /**
   * @method cleanup
   * @description 清理资源
   */
  cleanup() {
    // 移除事件监听
    window.removeEventListener('mousedown', this.onMouseDown.bind(this));
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    window.removeEventListener('mouseup', this.onMouseUp.bind(this));
    
    // 清理形状
    this.shapes.forEach(shape => {
      this.scene.remove(shape);
    });
    this.shapes = [];
    
    // 清理搭建区域
    if (this.buildArea) {
      this.scene.remove(this.buildArea);
      this.buildArea = null;
    }
    
    console.log('搭建模式已清理');
  }
  
  /**
   * @method createSimpleBackground
   * @description 创建简单明亮的背景
   */
  createSimpleBackground() {
    // 使用温暖柔和的浅蓝色背景，减少视觉刺激
    this.scene.background = new THREE.Color(0xE6F3FF);
  }
  
  /**
   * @method createBuildArea
   * @description 创建搭建区域
   */
  createBuildArea() {
    // 创建一个大平面作为搭建区域
    const geometry = new THREE.PlaneGeometry(15, 15);
    const material = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    
    this.buildArea = new THREE.Mesh(geometry, material);
    this.buildArea.rotation.x = Math.PI / 2; // 水平放置
    this.buildArea.position.y = -2; // 放在画面下方
    this.scene.add(this.buildArea);
    
    // 添加明显的彩色边框，提高视觉识别度
    const borderGeometry = new THREE.EdgesGeometry(geometry);
    const borderMaterial = new THREE.LineBasicMaterial({
      color: 0x4CAF50,
      linewidth: 5
    });
    const border = new THREE.LineSegments(borderGeometry, borderMaterial);
    this.buildArea.add(border);
    
    // 添加"放在这里"的文字提示
    this.addTextHint("把积木放在这里", this.buildArea.position);
  }
  
  /**
   * @method createShapeLibrary
   * @description 创建简化版的形状库
   */
  createShapeLibrary() {
    const shapes = this.config.education.shapes;
    const colors = this.config.education.colors;
    
    // 将形状放在屏幕左侧，以列表形式排列
    const startX = -8;
    const startY = 2;
    const spacing = 3; // 增加间距，方便抓取
    
    shapes.forEach((shape, index) => {
      // 为每个形状选择一个鲜艳的颜色
      const colorName = colors[index % colors.length];
      const colorHex = this.getColorHexFromName(colorName);
      
      // 创建超大尺寸的简单形状
      const shapeObj = this.createShape(shape, colorHex);
      
      // 设置形状位置，垂直排列便于选择
      shapeObj.position.set(startX, startY - index * spacing, 0);
      
      // 缩放形状，使其更大更易于点击
      const scale = this.config.visual.elementSizeMultiplier * 1.5; // 额外增大尺寸
      shapeObj.scale.set(scale, scale, scale);
      
      // 添加形状数据
      shapeObj.userData = {
        type: shape,
        color: colorName,
        isLibraryItem: true
      };
      
      // 为形状添加轻微的旋转动画，吸引注意力
      this.animateShape(shapeObj);
      
      // 添加到场景和形状库
      this.scene.add(shapeObj);
      this.shapeLibrary.push(shapeObj);
      
      // 为每个形状添加文字标签
      this.addShapeLabel(shapeObj, shape);
    });
  }
  
  /**
   * @method createGuideElements
   * @description 创建引导元素
   */
  createGuideElements() {
    // 创建3D箭头指示物
    const arrowGeometry = new THREE.ConeGeometry(0.5, 1.5, 32);
    const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xFF5722 });
    this.guideArrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    this.guideArrow.rotation.x = Math.PI; // 箭头朝下
    this.guideArrow.visible = false;
    this.scene.add(this.guideArrow);
  }
  
  /**
   * @method createShape
   * @description 创建一个形状
   * @param {string} shapeName - 形状名称
   * @param {number} colorHex - 颜色十六进制值
   * @returns {THREE.Mesh} 形状对象
   */
  createShape(shapeName, colorHex) {
    let geometry;
    
    // 简化形状创建，只使用最基础的几何体
    switch(shapeName) {
      case '圆形':
        geometry = new THREE.SphereGeometry(1, 32, 32);
        break;
      case '方形':
        geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);
        break;
      case '三角形':
        // 创建一个简单的三角锥体
        geometry = new THREE.ConeGeometry(1.2, 2, 3);
        break;
      default:
        geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    }
    
    // 使用卡通风格材质，边缘明显
    const material = new THREE.MeshToonMaterial({
      color: colorHex,
      specular: 0x111111,
      shininess: 30,
      flatShading: true
    });
    
    return new THREE.Mesh(geometry, material);
  }
  
  /**
   * @method animateShape
   * @description 为形状添加简单的旋转动画
   */
  animateShape(shape) {
    // 设置慢速旋转，吸引注意力但不会太快
    const animate = () => {
      shape.rotation.y += 0.01;
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  /**
   * @method addShapeLabel
   * @description 为形状添加大字体的文本标签
   */
  addShapeLabel(shape, shapeName) {
    // 创建HTML元素作为标签
    const labelDiv = document.createElement('div');
    labelDiv.className = 'shape-label';
    labelDiv.textContent = shapeName;
    labelDiv.style.position = 'absolute';
    labelDiv.style.fontSize = '24px';
    labelDiv.style.fontWeight = 'bold';
    labelDiv.style.color = '#333';
    labelDiv.style.backgroundColor = 'rgba(255,255,255,0.7)';
    labelDiv.style.padding = '5px 10px';
    labelDiv.style.borderRadius = '10px';
    labelDiv.style.fontFamily = 'Arial, sans-serif';
    
    document.body.appendChild(labelDiv);
    
    // 使用CSS2DRenderer将标签附加到3D对象上
    const label = new THREE.CSS2DObject(labelDiv);
    label.position.set(0, 2, 0); // 放在形状上方
    shape.add(label);
  }
  
  /**
   * @method addTextHint
   * @description 添加文字提示
   */
  addTextHint(text, position) {
    const hintDiv = document.createElement('div');
    hintDiv.className = 'text-hint';
    hintDiv.textContent = text;
    hintDiv.style.position = 'absolute';
    hintDiv.style.fontSize = '32px';
    hintDiv.style.fontWeight = 'bold';
    hintDiv.style.color = '#FF5722';
    hintDiv.style.fontFamily = 'Arial, sans-serif';
    hintDiv.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
    
    document.body.appendChild(hintDiv);
    
    const hint = new THREE.CSS2DObject(hintDiv);
    hint.position.copy(position);
    hint.position.y += 1; // 放在对象上方
    this.scene.add(hint);
    
    return hint;
  }
  
  /**
   * @method setTask
   * @description 设置简单任务
   */
  setTask() {
    // 确保第一个任务超级简单 - 只需将一个形状放到区域内
    this.currentTask = {
      shape: this.config.education.shapes[0], // 从第一个形状开始
      completed: false
    };
    
    // 播放语音提示
    this.playVoicePrompt(`请把${this.currentTask.shape}放到绿色区域里`);
    
    // 显示引导箭头
    this.showGuideArrow();
  }
  
  /**
   * @method showGuideArrow
   * @description 显示引导箭头
   */
  showGuideArrow() {
    // 清除之前的引导
    clearTimeout(this.hintTimeout);
    
    // 找到当前任务对应的形状
    const targetShape = this.shapeLibrary.find(shape => 
      shape.userData.type === this.currentTask.shape
    );
    
    if (targetShape) {
      // 放置箭头在形状上方
      this.guideArrow.position.set(
        targetShape.position.x,
        targetShape.position.y + 3,
        targetShape.position.z
      );
      
      // 显示箭头并添加上下浮动动画
      this.guideArrow.visible = true;
      
      // 创建上下浮动动画
      const floatArrow = () => {
        this.guideArrow.position.y = targetShape.position.y + 3 + Math.sin(Date.now() * 0.003) * 0.5;
        requestAnimationFrame(floatArrow);
      };
      
      floatArrow();
      
      // 5秒后如果还未操作，播放额外提示
      this.hintTimeout = setTimeout(() => {
        this.playVoicePrompt(`点击${this.currentTask.shape}，然后放到绿色区域里`);
        
        // 启动自动辅助计时器
        this.startAutoAssistTimer();
      }, 5000);
    }
  }
  
  /**
   * @method startAutoAssistTimer
   * @description 开始自动辅助计时器
   */
  startAutoAssistTimer() {
    if (this.config.interaction.autoAssist) {
      clearTimeout(this.autoAssistTimer);
      
      this.autoAssistTimer = setTimeout(() => {
        this.provideAutoAssistance();
      }, this.config.interaction.autoAssistDelay * 1000);
    }
  }
  
  /**
   * @method provideAutoAssistance
   * @description 提供自动辅助
   */
  provideAutoAssistance() {
    if (this.currentTask && !this.currentTask.completed) {
      // 为父母播放提示音
      this.audioManager.playSound('assist');
      
      // 显示父母辅助提示
      alert("看起来宝宝需要一些帮助。您可以握着宝宝的手，一起完成这个任务！");
      
      // 高亮目标形状
      const targetShape = this.shapeLibrary.find(shape => 
        shape.userData.type === this.currentTask.shape
      );
      
      if (targetShape) {
        // 强烈闪烁效果引起注意
        const originalColor = targetShape.material.color.clone();
        
        const highlightInterval = setInterval(() => {
          targetShape.material.color.set(
            targetShape.material.color.equals(originalColor) ? 0xFFFF00 : originalColor
          );
        }, 500);
        
        // 10秒后停止高亮
        setTimeout(() => {
          clearInterval(highlightInterval);
          targetShape.material.color.copy(originalColor);
        }, 10000);
      }
    }
  }
  
  /**
   * @method playVoicePrompt
   * @description 播放语音提示
   */
  playVoicePrompt(text) {
    // 在实际项目中，这里会调用语音合成API
    console.log(`语音提示: ${text}`);
    
    // 同时显示文字提示
    const hintElement = document.createElement('div');
    hintElement.className = 'voice-hint';
    hintElement.textContent = text;
    hintElement.style.position = 'absolute';
    hintElement.style.bottom = '30px';
    hintElement.style.left = '50%';
    hintElement.style.transform = 'translateX(-50%)';
    hintElement.style.backgroundColor = 'rgba(255,255,255,0.9)';
    hintElement.style.padding = '15px 30px';
    hintElement.style.borderRadius = '50px';
    hintElement.style.fontSize = '28px';
    hintElement.style.fontWeight = 'bold';
    hintElement.style.color = '#333';
    hintElement.style.fontFamily = 'Arial, sans-serif';
    hintElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    hintElement.style.zIndex = '1000';
    
    document.body.appendChild(hintElement);
    
    // 10秒后移除提示
    setTimeout(() => {
      hintElement.style.opacity = '0';
      hintElement.style.transition = 'opacity 1s';
      
      setTimeout(() => {
        document.body.removeChild(hintElement);
      }, 1000);
    }, 10000);
    
    // 播放提示音效
    this.audioManager.playSound('hint');
  }
  
  /**
   * @method playWelcomeVoice
   * @description 播放欢迎语音
   */
  playWelcomeVoice() {
    this.playVoicePrompt('欢迎来到搭建乐园！让我们一起来搭积木吧！');
  }
  
  /**
   * @method addEventListeners
   * @description 添加事件监听器
   */
  addEventListeners() {
    // 创建一个Raycaster用于检测点击物体
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // 跟踪拖动状态
    let isDragging = false;
    let draggedShape = null;
    
    // 监听鼠标或触摸事件
    const onMouseDown = (event) => {
      // 阻止默认事件
      event.preventDefault();
      
      // 计算鼠标位置
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // 发射射线
      raycaster.setFromCamera(mouse, this.camera);
      
      // 检测射线与形状的交叉
      const intersects = raycaster.intersectObjects(this.shapeLibrary);
      
      if (intersects.length > 0) {
        // 获取第一个相交的形状
        const shape = intersects[0].object;
        
        // 如果点击的是库中的形状，则克隆一个新实例
        if (shape.userData.isLibraryItem) {
          // 复制形状
          draggedShape = this.cloneShape(shape);
          this.scene.add(draggedShape);
          
          // 设置拖动状态
          isDragging = true;
          
          // 播放选择音效
          this.audioManager.playSound('select');
          
          // 隐藏引导箭头
          this.guideArrow.visible = false;
          
          // 清除自动辅助计时器
          clearTimeout(this.autoAssistTimer);
        }
      }
    };
    
    const onMouseMove = (event) => {
      if (isDragging && draggedShape) {
        // 计算鼠标位置
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // 发射射线
        raycaster.setFromCamera(mouse, this.camera);
        
        // 计算与XY平面的交点
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const intersectPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersectPoint);
        
        // 更新形状位置
        draggedShape.position.copy(intersectPoint);
        
        // 让形状稍微上浮，增加可见性
        draggedShape.position.z = 1;
      }
    };
    
    const onMouseUp = () => {
      if (isDragging && draggedShape) {
        // 检查是否放置在搭建区域中
        if (this.isOverBuildArea(draggedShape)) {
          // 放置成功，将形状放到搭建区域
          this.placeShapeInBuildArea(draggedShape);
          
          // 检查任务是否完成
          this.checkTaskCompletion(draggedShape);
        } else {
          // 放置失败，移除形状
          this.scene.remove(draggedShape);
          
          // 播放错误音效
          this.audioManager.playSound('wrong');
          
          // 显示提示
          this.playVoicePrompt('请把积木放到绿色区域里');
          
          // 再次显示引导箭头
          this.showGuideArrow();
        }
        
        // 重置拖动状态
        isDragging = false;
        draggedShape = null;
      }
    };
    
    // 添加事件监听
    window.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mouseup', onMouseUp, false);
    
    // 触摸支持
    window.addEventListener('touchstart', (e) => {
      // 转换为鼠标事件格式
      const touchEvent = {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
        preventDefault: () => e.preventDefault()
      };
      onMouseDown(touchEvent);
    }, false);
    
    window.addEventListener('touchmove', (e) => {
      const touchEvent = {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY
      };
      onMouseMove(touchEvent);
    }, false);
    
    window.addEventListener('touchend', onMouseUp, false);
  }
  
  /**
   * @method cloneShape
   * @description 克隆一个形状
   */
  cloneShape(originalShape) {
    // 克隆几何体和材质
    const clonedShape = originalShape.clone();
    
    // 复制用户数据但标记为非库项目
    clonedShape.userData = {
      ...originalShape.userData,
      isLibraryItem: false
    };
    
    // 设置初始位置
    clonedShape.position.copy(originalShape.position);
    
    return clonedShape;
  }
  
  /**
   * @method isOverBuildArea
   * @description 检查形状是否位于搭建区域内
   */
  isOverBuildArea(shape) {
    // 简化判断，使操作更容易成功
    const shapeBoundingBox = new THREE.Box3().setFromObject(shape);
    const buildAreaBoundingBox = new THREE.Box3().setFromObject(this.buildArea);
    
    // 只要有部分重叠就认为在区域内
    return buildAreaBoundingBox.intersectsBox(shapeBoundingBox);
  }
  
  /**
   * @method placeShapeInBuildArea
   * @description 将形状放置在搭建区域内
   */
  placeShapeInBuildArea(shape) {
    // 将形状放到搭建区域上方一点
    shape.position.y = this.buildArea.position.y + 0.5;
    
    // 播放放置音效
    this.audioManager.playSound('place');
  }
  
  /**
   * @method checkTaskCompletion
   * @description 检查任务是否完成
   */
  checkTaskCompletion(shape) {
    if (this.currentTask && !this.currentTask.completed) {
      // 任务就是放置指定形状，检查形状类型
      if (shape.userData.type === this.currentTask.shape) {
        // 标记任务完成
        this.currentTask.completed = true;
        
        // 播放成功音效和语音
        this.audioManager.playSound('success');
        this.playVoicePrompt('太棒了！你成功了！');
        
        // 显示奖励动画
        this.showRewardAnimation();
        
        // 3秒后设置新任务
        setTimeout(() => {
          this.setNextTask();
        }, 3000);
      }
    }
  }
  
  /**
   * @method showRewardAnimation
   * @description 显示奖励动画
   */
  showRewardAnimation() {
    // 创建五彩星星粒子效果
    const particleCount = 20;
    const particles = new THREE.Group();
    
    for (let i = 0; i < particleCount; i++) {
      // 创建一个小星星
      const starGeometry = new THREE.TetrahedronGeometry(0.2, 0);
      
      // 随机颜色
      const colors = [0xFFD700, 0xFF4081, 0x00E676, 0x2979FF, 0xAA00FF];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const starMaterial = new THREE.MeshBasicMaterial({
        color: color
      });
      
      const star = new THREE.Mesh(starGeometry, starMaterial);
      
      // 随机位置
      star.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5 + 5, // 在上方出现
        (Math.random() - 0.5) * 10
      );
      
      // 随机大小
      const scale = Math.random() * 2 + 1;
      star.scale.set(scale, scale, scale);
      
      // 添加动画数据
      star.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          -0.05 - Math.random() * 0.05, // 向下落
          (Math.random() - 0.5) * 0.1
        ),
        spin: (Math.random() - 0.5) * 0.2,
        lifespan: 50 + Math.floor(Math.random() * 50) // 星星寿命
      };
      
      particles.add(star);
    }
    
    this.scene.add(particles);
    
    // 创建粒子动画
    let frame = 0;
    const animateParticles = () => {
      frame++;
      
      // 更新每个粒子
      particles.children.forEach((particle, i) => {
        // 移动粒子
        particle.position.add(particle.userData.velocity);
        
        // 旋转粒子
        particle.rotation.x += particle.userData.spin;
        particle.rotation.y += particle.userData.spin;
        
        // 减少寿命
        particle.userData.lifespan--;
        
        // 添加闪烁效果
        particle.visible = frame % 6 !== 0;
        
        // 如果寿命结束，移除粒子
        if (particle.userData.lifespan <= 0) {
          particles.remove(particle);
        }
      });
      
      // 如果还有粒子，继续动画
      if (particles.children.length > 0) {
        requestAnimationFrame(animateParticles);
      } else {
        // 清理
        this.scene.remove(particles);
      }
    };
    
    animateParticles();
  }
  
  /**
   * @method setNextTask
   * @description 设置下一个任务
   */
  setNextTask() {
    // 在形状数组中选择下一个形状
    const shapes = this.config.education.shapes;
    const currentIndex = shapes.indexOf(this.currentTask.shape);
    const nextIndex = (currentIndex + 1) % shapes.length;
    
    this.currentTask = {
      shape: shapes[nextIndex],
      completed: false
    };
    
    // 播放新任务提示
    this.playVoicePrompt(`太好了！现在请把${this.currentTask.shape}放到绿色区域里`);
    
    // 显示引导箭头
    this.showGuideArrow();
  }
  
  /**
   * @method getColorHexFromName
   * @description 将颜色名称转换为十六进制颜色值
   */
  getColorHexFromName(colorName) {
    const colorMap = {
      '红色': 0xFF5252,
      '蓝色': 0x448AFF,
      '绿色': 0x4CAF50,
      '黄色': 0xFFEB3B
    };
    
    return colorMap[colorName] || 0xFF0000;
  }
  
  /**
   * @method update
   * @description 更新方法，每帧调用
   * @param {number} delta - 时间增量
   */
  update(delta) {
    // 现在暂时为空，如果需要添加持续动画可以在这里
  }
} 