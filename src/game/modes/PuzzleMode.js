import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

/**
 * @class PuzzleMode
 * @description 拼图挑战模式实现类
 */
export default class PuzzleMode {
  /**
   * @constructor
   * @param {Game} game - 游戏实例
   */
  constructor(game) {
    this.game = game;
    this.scene = game.scene;
    this.camera = game.camera;
    this.config = game.config;
    
    // 拼图容器
    this.puzzlePieces = [];
    this.correctPositions = [];
    
    // 拼图相关
    this.puzzleSize = 2; // 2x2的拼图
    this.currentPuzzle = null;
    this.puzzleType = 'number'; // number 或 letter
    this.puzzleValue = null;
    this.pieceSize = 1.5;
    this.gapSize = 0.1;
    
    // 拖放操作
    this.selectedPiece = null;
    this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.5);
    this.dragOffset = new THREE.Vector3();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // 字体
    this.font = null;
    
    // 拼图区域
    this.puzzleBoard = null;
    
    // 完成状态
    this.isCompleted = false;
    
    // 事件绑定
    this.boundOnMouseDown = this.onMouseDown.bind(this);
    this.boundOnMouseMove = this.onMouseMove.bind(this);
    this.boundOnMouseUp = this.onMouseUp.bind(this);
  }
  
  /**
   * @method init
   * @description 初始化拼图模式
   */
  init() {
    // 加载字体
    const fontLoader = new FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      this.font = font;
      this.setupScene();
    });
    
    // 设置摄像机位置
    this.game.camera.position.set(0, 8, 10);
    this.game.camera.lookAt(0, 0, 0);
    
    // 添加事件监听
    window.addEventListener('mousedown', this.boundOnMouseDown);
    window.addEventListener('mousemove', this.boundOnMouseMove);
    window.addEventListener('mouseup', this.boundOnMouseUp);
    
    console.log('拼图模式已初始化');
  }
  
  /**
   * @method cleanup
   * @description 清理资源
   */
  cleanup() {
    // 移除事件监听
    window.removeEventListener('mousedown', this.boundOnMouseDown);
    window.removeEventListener('mousemove', this.boundOnMouseMove);
    window.removeEventListener('mouseup', this.boundOnMouseUp);
    
    // 清理拼图
    this.puzzlePieces.forEach(piece => {
      this.scene.remove(piece);
    });
    this.puzzlePieces = [];
    
    // 清理拼图板
    if (this.puzzleBoard) {
      this.scene.remove(this.puzzleBoard);
      this.puzzleBoard = null;
    }
    
    console.log('拼图模式已清理');
  }
  
  /**
   * @method setupScene
   * @description 设置场景元素
   */
  setupScene() {
    // 创建拼图板
    this.createPuzzleBoard();
    
    // 创建背景
    this.createBackground();
    
    // 设置随机拼图类型
    this.setRandomPuzzle();
    
    // 创建拼图
    this.createPuzzle();
  }
  
  /**
   * @method createBackground
   * @description 创建背景
   */
  createBackground() {
    // 创建桌面
    const tableGeometry = new THREE.BoxGeometry(15, 0.2, 15);
    const tableMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B4513, // 棕色
      roughness: 0.8,
      metalness: 0.2
    });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.y = 0;
    this.scene.add(table);
    
    // 添加装饰
    const decorCount = 5;
    const colors = [0xFF6347, 0x4682B4, 0x32CD32, 0xFFD700, 0x9370DB];
    
    for (let i = 0; i < decorCount; i++) {
      // 创建随机装饰物
      const size = Math.random() * 0.5 + 0.3;
      const geometry = [
        new THREE.BoxGeometry(size, size, size),
        new THREE.SphereGeometry(size/2, 16, 16),
        new THREE.ConeGeometry(size/2, size, 16)
      ][Math.floor(Math.random() * 3)];
      
      const material = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        roughness: 0.7,
        metalness: 0.3
      });
      
      const decor = new THREE.Mesh(geometry, material);
      
      // 随机位置（在桌面边缘）
      const angle = (i / decorCount) * Math.PI * 2;
      const radius = 6;
      decor.position.set(
        Math.cos(angle) * radius,
        size / 2 + 0.1,
        Math.sin(angle) * radius
      );
      
      this.scene.add(decor);
    }
  }
  
  /**
   * @method createPuzzleBoard
   * @description 创建拼图板
   */
  createPuzzleBoard() {
    // 计算拼图板大小（基于拼图大小）
    const totalSize = this.puzzleSize * this.pieceSize + (this.puzzleSize - 1) * this.gapSize;
    
    // 创建拼图板几何体
    const boardGeometry = new THREE.BoxGeometry(totalSize + 1, 0.2, totalSize + 1);
    const boardMaterial = new THREE.MeshStandardMaterial({
      color: 0x4169E1, // 皇家蓝
      roughness: 0.7,
      metalness: 0.3
    });
    
    this.puzzleBoard = new THREE.Mesh(boardGeometry, boardMaterial);
    this.puzzleBoard.position.set(0, 0.1, 0);
    this.puzzleBoard.receiveShadow = true;
    
    // 添加到场景
    this.scene.add(this.puzzleBoard);
    
    // 创建拼图格子
    for (let i = 0; i < this.puzzleSize; i++) {
      for (let j = 0; j < this.puzzleSize; j++) {
        // 计算位置
        const x = (i - (this.puzzleSize - 1) / 2) * (this.pieceSize + this.gapSize);
        const z = (j - (this.puzzleSize - 1) / 2) * (this.pieceSize + this.gapSize);
        
        // 创建格子
        const slotGeometry = new THREE.BoxGeometry(this.pieceSize, 0.1, this.pieceSize);
        const slotMaterial = new THREE.MeshStandardMaterial({
          color: 0xE0FFFF, // 淡青色
          roughness: 0.6,
          metalness: 0.1,
          transparent: true,
          opacity: 0.5
        });
        
        const slot = new THREE.Mesh(slotGeometry, slotMaterial);
        slot.position.set(x, 0.2, z);
        
        // 添加到拼图板
        this.puzzleBoard.add(slot);
        
        // 存储正确位置
        this.correctPositions.push(new THREE.Vector3(x, 0.5, z));
      }
    }
  }
  
  /**
   * @method setRandomPuzzle
   * @description 设置随机拼图类型和值
   */
  setRandomPuzzle() {
    // 随机选择拼图类型（数字或字母）
    const types = ['number', 'letter'];
    this.puzzleType = types[Math.floor(Math.random() * types.length)];
    
    // 根据类型设置值
    if (this.puzzleType === 'number') {
      this.puzzleValue = this.config.getRandomNumber();
    } else {
      this.puzzleValue = this.config.getRandomLetter();
    }
    
    // 显示提示
    let instruction = '';
    if (this.puzzleType === 'number') {
      instruction = `拼出数字 ${this.puzzleValue}`;
    } else {
      instruction = `拼出字母 ${this.puzzleValue}`;
    }
    
    console.log('语音提示:', instruction);
    
    // 在UI上显示提示
    if (this.game.uiManager) {
      this.game.uiManager.showInstruction(instruction);
    }
  }
  
  /**
   * @method createPuzzle
   * @description 创建拼图
   */
  createPuzzle() {
    // 清除现有拼图
    this.puzzlePieces.forEach(piece => {
      this.scene.remove(piece);
    });
    this.puzzlePieces = [];
    
    // 确定基础颜色
    const baseColor = 0xFFA500; // 橙色
    
    // 创建拼图组
    this.currentPuzzle = new THREE.Group();
    
    // 拼图图像
    let valueText;
    if (this.puzzleType === 'number') {
      valueText = this.puzzleValue.toString();
    } else {
      valueText = this.puzzleValue;
    }
    
    // 为每个拼图块创建一部分图像
    for (let i = 0; i < this.puzzleSize; i++) {
      for (let j = 0; j < this.puzzleSize; j++) {
        // 索引
        const index = i * this.puzzleSize + j;
        
        // 创建拼图块
        const piece = this.createPuzzlePiece(i, j, index, baseColor);
        
        // 随机位置（在拼图板周围）
        let x, z;
        do {
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 3 + 3; // 3到6的随机半径
          x = Math.cos(angle) * radius;
          z = Math.sin(angle) * radius;
        } while (this.isPositionOccupied(x, z));
        
        piece.position.set(x, 0.5, z);
        
        // 存储原始索引
        piece.userData.index = index;
        piece.userData.correctPosition = this.correctPositions[index].clone();
        piece.userData.isPlaced = false;
        
        // 添加到场景和拼图列表
        this.scene.add(piece);
        this.puzzlePieces.push(piece);
      }
    }
  }
  
  /**
   * @method createPuzzlePiece
   * @description 创建单个拼图块
   * @param {number} i - 行索引
   * @param {number} j - 列索引
   * @param {number} index - 线性索引
   * @param {number} color - 颜色
   * @returns {THREE.Group} 拼图块组
   */
  createPuzzlePiece(i, j, index, color) {
    // 创建拼图块组
    const piece = new THREE.Group();
    
    // 基础几何体
    const pieceGeometry = new THREE.BoxGeometry(this.pieceSize, 0.3, this.pieceSize);
    const pieceMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.7,
      metalness: 0.3
    });
    
    const pieceMesh = new THREE.Mesh(pieceGeometry, pieceMaterial);
    pieceMesh.castShadow = true;
    pieceMesh.receiveShadow = true;
    piece.add(pieceMesh);
    
    // 如果有字体和值，添加部分文字
    if (this.font && (this.puzzleType === 'number' || this.puzzleType === 'letter')) {
      // 确定此拼图块应该显示的内容
      // 对于2x2拼图，每个块显示部分图像
      
      // 创建大的文字几何体
      let textGeometry;
      if (this.puzzleType === 'number') {
        textGeometry = new TextGeometry(this.puzzleValue.toString(), {
          font: this.font,
          size: 2,
          height: 0.2,
          curveSegments: 12
        });
      } else {
        textGeometry = new TextGeometry(this.puzzleValue, {
          font: this.font,
          size: 2,
          height: 0.2,
          curveSegments: 12
        });
      }
      
      // 计算文字的边界盒
      textGeometry.computeBoundingBox();
      const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
      const textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;
      
      // 创建材质
      const textMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
      
      // 创建网格
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      
      // 调整位置，使文字居中
      textMesh.position.set(
        -textWidth / 2,
        0.15, // 稍微高于拼图块表面
        -textHeight / 2
      );
      
      // 根据拼图块位置调整文字位置
      const offsetX = (i - (this.puzzleSize - 1) / 2) * textWidth / this.puzzleSize;
      const offsetZ = (j - (this.puzzleSize - 1) / 2) * textHeight / this.puzzleSize;
      textMesh.position.x -= offsetX;
      textMesh.position.z -= offsetZ;
      
      // 创建一个剪切平面，只显示该块对应的文字部分
      const clipPlaneTop = new THREE.Plane(new THREE.Vector3(0, 0, -1), this.pieceSize / 2);
      const clipPlaneBottom = new THREE.Plane(new THREE.Vector3(0, 0, 1), this.pieceSize / 2);
      const clipPlaneLeft = new THREE.Plane(new THREE.Vector3(-1, 0, 0), this.pieceSize / 2);
      const clipPlaneRight = new THREE.Plane(new THREE.Vector3(1, 0, 0), this.pieceSize / 2);
      
      textMaterial.clippingPlanes = [clipPlaneTop, clipPlaneBottom, clipPlaneLeft, clipPlaneRight];
      
      // 添加到拼图块
      piece.add(textMesh);
      
      // 添加边框
      const edgeGeometry = new THREE.EdgesGeometry(pieceGeometry);
      const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
      const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
      piece.add(edges);
    }
    
    return piece;
  }
  
  /**
   * @method isPositionOccupied
   * @description 检查位置是否已被占用
   * @param {number} x - X坐标
   * @param {number} z - Z坐标
   * @returns {boolean} 是否被占用
   */
  isPositionOccupied(x, z) {
    const minDistance = this.pieceSize + 0.5;
    
    for (const piece of this.puzzlePieces) {
      const dx = piece.position.x - x;
      const dz = piece.position.z - z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      if (distance < minDistance) {
        return true;
      }
    }
    
    return false;
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
    
    // 发射射线
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // 检测与拼图块的交叉
    const intersects = this.raycaster.intersectObjects(this.puzzlePieces, true);
    
    if (intersects.length > 0) {
      // 找到拼图块
      let selectedObject = intersects[0].object;
      while (selectedObject.parent && !this.puzzlePieces.includes(selectedObject)) {
        selectedObject = selectedObject.parent;
      }
      
      // 如果找到了拼图块
      if (this.puzzlePieces.includes(selectedObject)) {
        this.selectedPiece = selectedObject;
        
        // 计算拖动平面与射线的交点
        const planeIntersect = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(this.dragPlane, planeIntersect);
        
        // 计算偏移量
        this.dragOffset.copy(this.selectedPiece.position).sub(planeIntersect);
      }
    }
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
    
    // 如果有选中的拼图块
    if (this.selectedPiece) {
      // 发射射线
      this.raycaster.setFromCamera(this.mouse, this.camera);
      
      // 计算拖动平面与射线的交点
      const planeIntersect = new THREE.Vector3();
      this.raycaster.ray.intersectPlane(this.dragPlane, planeIntersect);
      
      // 更新拼图块位置（加上偏移量）
      this.selectedPiece.position.copy(planeIntersect.add(this.dragOffset));
    }
  }
  
  /**
   * @method onMouseUp
   * @description 鼠标释放事件处理
   */
  onMouseUp() {
    if (this.selectedPiece) {
      // 检查是否放置在正确位置附近
      const correctPosition = this.selectedPiece.userData.correctPosition;
      const distance = this.selectedPiece.position.distanceTo(correctPosition);
      
      if (distance < 1.0) {
        // 拼图块放置在正确位置
        this.selectedPiece.position.copy(correctPosition);
        this.selectedPiece.userData.isPlaced = true;
        
        // 播放正确音效
        if (this.game.audioManager) {
          this.game.audioManager.playSound('correct');
        }
        
        // 检查是否完成拼图
        this.checkPuzzleCompletion();
      }
      
      // 清除选中的拼图块
      this.selectedPiece = null;
    }
  }
  
  /**
   * @method checkPuzzleCompletion
   * @description 检查拼图是否完成
   */
  checkPuzzleCompletion() {
    // 检查所有拼图块是否都放置在正确位置
    const allPlaced = this.puzzlePieces.every(piece => piece.userData.isPlaced);
    
    if (allPlaced && !this.isCompleted) {
      this.isCompleted = true;
      
      // 播放成功音效和动画
      console.log('拼图完成！');
      
      // 在UI上显示成功信息
      if (this.game.uiManager) {
        this.game.uiManager.showSuccess('太棒了！拼图完成！');
      }
      
      // 添加奖励
      this.config.addStar(2);
      
      // 更新UI
      if (this.game.uiManager) {
        this.game.uiManager.updateStars(this.config.rewards.stars);
      }
      
      // 更新任务完成计数
      this.config.parentControl.taskCompleted++;
      
      // 延迟后设置新拼图
      setTimeout(() => {
        this.isCompleted = false;
        this.setRandomPuzzle();
        this.createPuzzle();
      }, 3000);
    }
  }
  
  /**
   * @method update
   * @description 更新方法，每帧调用
   * @param {number} delta - 时间增量
   */
  update(delta) {
    // 稍微旋转未放置的拼图块
    this.puzzlePieces.forEach((piece, index) => {
      if (!piece.userData.isPlaced) {
        piece.rotation.y += 0.005 + (index * 0.001);
      }
    });
  }
} 