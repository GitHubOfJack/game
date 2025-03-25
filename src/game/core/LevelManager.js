/**
 * @class LevelManager
 * @description 关卡管理类，负责处理游戏关卡的加载、切换和难度
 */
export default class LevelManager {
  /**
   * @constructor
   * @param {GameConfig} config - 游戏配置实例
   */
  constructor(config) {
    this.config = config;
    
    // 当前关卡
    this.currentLevel = 1;
    
    // 最大关卡数
    this.maxLevel = 10;
    
    // 关卡完成状态
    this.levelCompleted = {};
    
    // 关卡解锁状态
    this.levelUnlocked = {
      1: true // 第一关默认解锁
    };
    
    // 关卡配置
    this.levelConfigs = {
      // 搭建模式关卡
      building: this.generateBuildingLevels(),
      // 射击模式关卡
      shooting: this.generateShootingLevels(),
      // 拼图模式关卡
      puzzle: this.generatePuzzleLevels()
    };
  }
  
  /**
   * @method generateBuildingLevels
   * @description 生成搭建模式关卡配置
   * @returns {Array} 关卡配置数组
   */
  generateBuildingLevels() {
    const levels = [];
    
    // 生成10个逐渐增加难度的关卡
    for (let i = 1; i <= 10; i++) {
      levels.push({
        level: i,
        requiredShapes: Math.min(i, 5), // 最多需要放置5个形状
        availableShapes: Math.min(i + 1, this.config.education.shapes.length),
        timeLimit: i <= 5 ? 0 : 60 * i, // 前5关无时间限制
        description: `放置${Math.min(i, 5)}个形状`
      });
    }
    
    return levels;
  }
  
  /**
   * @method generateShootingLevels
   * @description 生成射击模式关卡配置
   * @returns {Array} 关卡配置数组
   */
  generateShootingLevels() {
    const levels = [];
    
    // 生成10个逐渐增加难度的关卡
    for (let i = 1; i <= 10; i++) {
      levels.push({
        level: i,
        targetCount: 5 + i, // 需要击中的目标数量
        targetSpeed: 0.8 + (i * 0.2), // 目标移动速度
        targetTypes: i <= 3 ? ['number'] : ['number', 'letter'], // 1-3关只有数字，之后加入字母
        spawnInterval: Math.max(3000 - (i * 200), 1000), // 生成间隔，逐渐缩短但最少1秒
        description: `击中${5 + i}个目标`
      });
    }
    
    return levels;
  }
  
  /**
   * @method generatePuzzleLevels
   * @description 生成拼图模式关卡配置
   * @returns {Array} 关卡配置数组
   */
  generatePuzzleLevels() {
    const levels = [];
    
    // 生成10个逐渐增加难度的关卡
    for (let i = 1; i <= 10; i++) {
      const puzzleSize = i <= 3 ? 2 : (i <= 7 ? 3 : 4); // 2x2, 3x3, 4x4拼图
      
      levels.push({
        level: i,
        puzzleSize: puzzleSize,
        puzzleTypes: i <= 5 ? ['number'] : ['number', 'letter'], // 1-5关只有数字，之后加入字母
        rotationEnabled: i > 5, // 5关后启用旋转
        timeLimit: i <= 3 ? 0 : 60 * (i - 2), // 前3关无时间限制
        description: `完成${puzzleSize}x${puzzleSize}拼图`
      });
    }
    
    return levels;
  }
  
  /**
   * @method getLevelConfig
   * @description 获取指定模式和关卡的配置
   * @param {string} mode - 游戏模式
   * @param {number} level - 关卡编号
   * @returns {Object} 关卡配置
   */
  getLevelConfig(mode, level = this.currentLevel) {
    if (!this.levelConfigs[mode] || !this.levelConfigs[mode][level - 1]) {
      console.warn(`未找到关卡配置: ${mode} - ${level}`);
      return null;
    }
    
    return this.levelConfigs[mode][level - 1];
  }
  
  /**
   * @method getCurrentLevelConfig
   * @description 获取当前关卡配置
   * @param {string} mode - 游戏模式
   * @returns {Object} 当前关卡配置
   */
  getCurrentLevelConfig(mode) {
    return this.getLevelConfig(mode, this.currentLevel);
  }
  
  /**
   * @method completeLevel
   * @description 标记关卡为已完成
   * @param {string} mode - 游戏模式
   * @param {number} level - 关卡编号
   * @param {number} score - 获得的分数
   * @returns {boolean} 是否成功标记
   */
  completeLevel(mode, level, score) {
    const levelKey = `${mode}-${level}`;
    
    // 标记为已完成
    this.levelCompleted[levelKey] = {
      completed: true,
      score: score,
      timestamp: Date.now()
    };
    
    // 解锁下一关
    if (level < this.maxLevel) {
      this.levelUnlocked[level + 1] = true;
    }
    
    // 更新配置中的进度数据
    this.config.parentControl.taskCompleted++;
    
    return true;
  }
  
  /**
   * @method isLevelCompleted
   * @description 检查关卡是否已完成
   * @param {string} mode - 游戏模式
   * @param {number} level - 关卡编号
   * @returns {boolean} 是否已完成
   */
  isLevelCompleted(mode, level) {
    const levelKey = `${mode}-${level}`;
    return this.levelCompleted[levelKey] && this.levelCompleted[levelKey].completed;
  }
  
  /**
   * @method isLevelUnlocked
   * @description 检查关卡是否已解锁
   * @param {number} level - 关卡编号
   * @returns {boolean} 是否已解锁
   */
  isLevelUnlocked(level) {
    return !!this.levelUnlocked[level];
  }
  
  /**
   * @method nextLevel
   * @description 进入下一关
   * @returns {boolean} 是否成功进入下一关
   */
  nextLevel() {
    if (this.currentLevel < this.maxLevel) {
      this.currentLevel++;
      return true;
    }
    return false;
  }
  
  /**
   * @method resetProgress
   * @description 重置所有关卡进度
   */
  resetProgress() {
    this.currentLevel = 1;
    this.levelCompleted = {};
    this.levelUnlocked = { 1: true };
  }
}