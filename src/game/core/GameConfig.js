/**
 * @class GameConfig
 * @description 游戏核心配置类，管理游戏的所有配置参数
 */
export default class GameConfig {
  constructor() {
    // 难度设置 - 专为3岁宝宝设计的超低难度
    this.difficulty = {
      // 初始难度级别（1-5，1最简单）
      current: 1,
      // 最低难度
      min: 1,
      // 最高难度上限
      max: 3,
      // 自动调整难度的阈值
      adjustThreshold: {
        // 连续成功次数，超过此值提高难度
        success: 5,
        // 连续失败次数，超过此值降低难度
        failure: 2
      },
      // 特殊设置：永远不自动提高难度
      autoIncrease: false
    };
    
    // 游戏模式
    this.modes = {
      building: true,  // 搭建模式
      shooting: true,  // 射击配对模式
      puzzle: true     // 拼图挑战模式
    };
    
    // 教育内容 - 简化为最基础的内容
    this.education = {
      // 数字范围限制在1-5
      numbers: ['1', '2', '3', '4', '5'],
      // 字母仅包含几个简单字母
      letters: ['A', 'B', 'C', 'D', 'E'],
      // 简单颜色
      colors: ['红色', '蓝色', '绿色', '黄色'],
      // 基础形状
      shapes: ['圆形', '方形', '三角形']
    };
    
    // 奖励系统 - 更频繁、更直观的奖励
    this.rewards = {
      // 即时反馈（声音、动画）
      instantFeedback: true,
      // 虚拟奖励收集
      collectibles: ['星星', '气球', '小动物'],
      // 每个小任务都给予奖励
      rewardFrequency: 'veryHigh',
      // 成就系统（非常简单的成就）
      achievements: [
        { id: 'first_shape', name: '第一个形状', description: '成功放置第一个形状' },
        { id: 'first_number', name: '第一个数字', description: '认识第一个数字' }
      ]
    };
    
    // 家长控制
    this.parentControl = {
      timeLimit: 0,  // 每日游戏时长限制（分钟，0表示不限制）
      playTime: 0,   // 当前已玩时间（分钟）
      taskCompleted: 0, // 已完成的任务数量
      dailyReports: [] // 每日学习报告
    };
    
    // 音频配置
    this.audio = {
      backgroundMusic: true,
      soundEffects: true,
      voicePrompts: true,
      volume: 0.7
    };
    
    // 任务系统
    this.tasks = {
      current: null,
      completed: [],
      available: [
        { id: 'num_1_5', type: 'number', range: [1, 5], description: '认识数字1-5' },
        { id: 'letter_a_e', type: 'letter', range: ['A', 'E'], description: '认识字母A-E' },
        { id: 'shapes_basic', type: 'shape', shapes: ['cube', 'sphere'], description: '认识基本形状' }
      ]
    };
    
    // 互动元素 - 增加更多趣味性和引导
    this.interaction = {
      // 声音提示
      voicePrompts: true,
      // 动画引导（箭头、闪光效果等）
      animatedGuides: true,
      // 自动辅助（如果孩子长时间未操作）
      autoAssist: true,
      // 自动辅助前等待时间（秒）
      autoAssistDelay: 10,
      // 父母辅助模式
      parentAssistMode: true
    };
    
    // 视觉设计 - 更大、更鲜明的元素
    this.visual = {
      // 元素尺寸增大50%
      elementSizeMultiplier: 1.5,
      // 高对比度颜色
      highContrast: true,
      // 简化背景（减少干扰）
      simplifiedBackground: true,
      // 简单动画效果
      animations: {
        // 缓慢、平滑的移动动画
        movementSpeed: 'slow',
        // 元素高亮效果
        highlight: true,
        // 禁用可能引起不适的效果
        disableFlashing: true
      }
    };
    
    // 进度跟踪 - 用于家长查看
    this.progress = {
      // 学习内容记录
      learningTracking: true,
      // 游戏时间记录
      timeTracking: true,
      // 难度适应性记录
      difficultyAdaptation: true
    };
  }
  
  /**
   * @method increaseDifficulty
   * @description 增加游戏难度
   * @returns {boolean} 是否成功增加难度
   */
  increaseDifficulty() {
    if (this.difficulty.current < this.difficulty.max) {
      this.difficulty.current++;
      return true;
    }
    return false;
  }
  
  /**
   * @method decreaseDifficulty
   * @description 降低游戏难度
   * @returns {boolean} 是否成功降低难度
   */
  decreaseDifficulty() {
    if (this.difficulty.current > this.difficulty.min) {
      this.difficulty.current--;
      return true;
    }
    return false;
  }
  
  /**
   * @method unlockShape
   * @description 解锁新形状
   * @param {string} shape - 形状名称
   */
  unlockShape(shape) {
    if (this.education.shapes.includes(shape) && !this.rewards.unlockedShapes.includes(shape)) {
      this.rewards.unlockedShapes.push(shape);
      return true;
    }
    return false;
  }
  
  /**
   * @method unlockColor
   * @description 解锁新颜色
   * @param {number} colorHex - 颜色十六进制值
   */
  unlockColor(colorHex) {
    if (!this.rewards.unlockedColors.includes(colorHex)) {
      this.rewards.unlockedColors.push(colorHex);
      return true;
    }
    return false;
  }
  
  /**
   * @method getRandomNumber
   * @description 获取随机数字（在当前难度范围内）
   * @returns {number} 随机数字
   */
  getRandomNumber() {
    const max = Math.min(this.difficulty.current * 2, this.education.numbers.length);
    const index = Math.floor(Math.random() * max);
    return this.education.numbers[index];
  }
  
  /**
   * @method getRandomLetter
   * @description 获取随机字母（在当前难度范围内）
   * @returns {string} 随机字母
   */
  getRandomLetter() {
    const max = Math.min(this.difficulty.current * 5, this.education.letters.length);
    const index = Math.floor(Math.random() * max);
    return this.education.letters[index];
  }
  
  /**
   * @method getRandomShape
   * @description 获取随机形状（从已解锁的形状中）
   * @returns {string} 随机形状名称
   */
  getRandomShape() {
    const index = Math.floor(Math.random() * this.rewards.unlockedShapes.length);
    return this.rewards.unlockedShapes[index];
  }
  
  /**
   * @method getRandomColor
   * @description 获取随机颜色（从已解锁的颜色中）
   * @returns {number} 随机颜色十六进制值
   */
  getRandomColor() {
    const index = Math.floor(Math.random() * this.rewards.unlockedColors.length);
    return this.rewards.unlockedColors[index];
  }
  
  /**
   * @method addStar
   * @description 增加星星奖励
   * @param {number} count - 星星数量
   */
  addStar(count = 1) {
    this.rewards.stars += count;
  }
  
  /**
   * @method addAnimal
   * @description 增加动物伙伴
   * @param {string} animal - 动物名称
   */
  addAnimal(animal) {
    if (!this.rewards.animals.includes(animal)) {
      this.rewards.animals.push(animal);
      return true;
    }
    return false;
  }
  
  /**
   * @method completeTask
   * @description 完成任务
   * @param {string} taskId - 任务ID
   */
  completeTask(taskId) {
    const taskIndex = this.tasks.available.findIndex(t => t.id === taskId);
    if (taskIndex !== -1 && !this.tasks.completed.includes(taskId)) {
      this.tasks.completed.push(taskId);
      this.parentControl.taskCompleted++;
      return true;
    }
    return false;
  }
  
  /**
   * 根据孩子的表现自动调整难度
   * @param {boolean} success - 是否完成任务成功
   */
  adjustDifficulty(success) {
    // 保持最低难度，确保3岁宝宝能顺利游戏
    this.difficulty.current = this.difficulty.min;
  }
  
  /**
   * 获取当前难度下的游戏参数
   * @returns {Object} 当前难度的游戏参数
   */
  getDifficultyParams() {
    // 难度为1（最简单）的参数
    return {
      // 移动速度极慢
      speed: 0.3,
      // 目标尺寸增大
      targetSize: 1.8,
      // 操作精度要求极低
      precisionRequired: 0.1,
      // 提示持续时间延长
      hintDuration: 10,
      // 允许多次尝试
      maxAttempts: 10,
      // 拼图块数量减少(2x2)
      puzzlePieces: 4,
      // 射击类游戏目标移动慢
      targetMovementSpeed: 0.2
    };
  }
  
  /**
   * 获取当前的学习内容
   * @param {string} type - 内容类型（数字、字母等）
   * @returns {Array} 学习内容列表
   */
  getEducationContent(type) {
    return this.education[type] || [];
  }
  
  /**
   * 解锁新的教育内容
   * @param {string} type - 内容类型
   * @param {string} item - 要解锁的项目
   */
  unlockContent(type, item) {
    if (this.education[type] && !this.education[type].includes(item)) {
      this.education[type].push(item);
    }
  }
} 