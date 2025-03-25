/**
 * @class UIManager
 * @description 管理射击游戏的UI元素和交互
 */
export default class UIManager {
  /**
   * @constructor
   * @param {ShootingGame} game - 游戏实例
   */
  constructor(game) {
    this.game = game;
    
    // UI元素
    this.scoreElement = document.getElementById('score-value');
    this.targetElement = document.getElementById('target-value');
    this.targetLabel = document.getElementById('target-label');
    
    // 音效切换
    this.soundToggle = document.getElementById('sound-toggle');
    
    // 初始化
    this.init();
  }
  
  /**
   * @method init
   * @description 初始化UI管理器
   */
  init() {
    // 监听音效切换
    if (this.soundToggle) {
      this.soundToggle.addEventListener('click', this.toggleSound.bind(this));
    }
    
    // 初始化分数
    this.updateScore(0);
    
    // 更新标题
    if (this.targetLabel) {
      this.targetLabel.textContent = '你要找这个动物朋友';
    }
    
    // 创建动物形状展示
    this.createAnimalShapesDisplay();
  }
  
  /**
   * @method createAnimalShapesDisplay
   * @description 创建动物形状展示区域
   */
  createAnimalShapesDisplay() {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) return;
    
    // 创建展示容器
    const displayContainer = document.createElement('div');
    displayContainer.className = 'animal-shapes-display';
    
    // 设置容器样式
    Object.assign(displayContainer.style, {
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      display: 'flex',
      gap: '10px',
      padding: '10px',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      zIndex: '50'
    });
    
    // 添加说明文本
    const infoText = document.createElement('div');
    infoText.textContent = '你可以发射这些小动物去帮忙';
    infoText.style.fontWeight = 'bold';
    infoText.style.marginBottom = '10px';
    displayContainer.appendChild(infoText);
    
    // 将容器添加到游戏区域
    gameContainer.appendChild(displayContainer);
    
    // 保存引用
    this.animalDisplayContainer = displayContainer;
  }
  
  /**
   * @method updateScore
   * @description 更新得分显示
   * @param {number} score - 当前得分
   */
  updateScore(score) {
    if (this.scoreElement) {
      this.scoreElement.textContent = score;
    }
  }
  
  /**
   * @method showTarget
   * @description 显示当前目标
   * @param {string} type - 目标类型（数字或字母）
   * @param {string|number} value - 目标值
   */
  showTarget(type, value) {
    if (this.targetElement) {
      this.targetElement.textContent = value;
      
      // 根据类型设置不同颜色 - 使用更明亮的颜色
      if (type === 'number') {
        this.targetElement.style.backgroundColor = '#4CAF50'; // 绿色
      } else {
        this.targetElement.style.backgroundColor = '#2196F3'; // 蓝色
      }
      
      // 添加脉动动画
      this.targetElement.classList.remove('pulse-animation');
      void this.targetElement.offsetWidth; // 重置动画
      this.targetElement.classList.add('pulse-animation');
      
      // 动态添加样式
      if (!document.getElementById('pulse-animation-style')) {
        const style = document.createElement('style');
        style.id = 'pulse-animation-style';
        style.textContent = `
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          .pulse-animation {
            animation: pulse 1s infinite;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }
  
  /**
   * @method showInstruction
   * @description 显示指令文本
   * @param {string} text - 指令文本
   */
  showInstruction(text) {
    // 创建一个浮动的指令提示
    this.showFloatingMessage(text, 'instruction', 4000);
  }
  
  /**
   * @method showSuccess
   * @description 显示成功提示
   * @param {string} message - 提示消息
   */
  showSuccess(message) {
    this.showFloatingMessage(message, 'success');
  }
  
  /**
   * @method showError
   * @description 显示错误提示
   * @param {string} message - 提示消息
   */
  showError(message) {
    this.showFloatingMessage(message, 'error');
  }
  
  /**
   * @method showLevelComplete
   * @description 显示关卡完成信息
   * @param {number} score - 最终得分
   */
  showLevelComplete(score) {
    this.showFloatingMessage(`恭喜！任务完成！得分：${score}`, 'level-complete', 5000);
  }
  
  /**
   * @method showFloatingMessage
   * @description 显示浮动消息
   * @param {string} message - 消息内容
   * @param {string} type - 消息类型
   * @param {number} duration - 持续时间（毫秒）
   */
  showFloatingMessage(message, type, duration = 2000) {
    // 创建消息元素
    const messageElement = document.createElement('div');
    messageElement.className = `floating-message ${type}`;
    messageElement.textContent = message;
    
    // 设置样式
    Object.assign(messageElement.style, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: type === 'success' ? 'rgba(76, 175, 80, 0.9)' : 
                       type === 'error' ? 'rgba(244, 67, 54, 0.9)' : 
                       type === 'instruction' ? 'rgba(33, 150, 243, 0.8)' :
                       'rgba(33, 150, 243, 0.9)',
      color: 'white',
      padding: '15px 30px',
      borderRadius: '10px',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      zIndex: '100',
      opacity: '0',
      transition: 'opacity 0.3s ease-in-out'
    });
    
    // 添加到游戏容器
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
      gameContainer.appendChild(messageElement);
      
      // 显示消息
      setTimeout(() => {
        messageElement.style.opacity = '1';
      }, 10);
      
      // 一段时间后移除消息
      setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => {
          if (messageElement.parentNode) {
            gameContainer.removeChild(messageElement);
          }
        }, 300);
      }, duration);
    }
  }
  
  /**
   * @method toggleSound
   * @description 切换音效开关
   */
  toggleSound() {
    // 获取当前音效状态
    const soundEnabled = this.game.audioManager.settings.soundEnabled;
    
    // 切换状态
    const newState = !soundEnabled;
    
    // 触发自定义事件
    const event = new CustomEvent('soundToggle', { 
      detail: { enabled: newState } 
    });
    document.dispatchEvent(event);
    
    // 更新图标
    this.updateSoundIcon(newState);
  }
  
  /**
   * @method updateSoundIcon
   * @description 更新音效图标
   * @param {boolean} enabled - 音效是否启用
   */
  updateSoundIcon(enabled) {
    if (!this.soundToggle) return;
    
    // 更新图标
    if (enabled) {
      this.soundToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#333">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4z"/>
        </svg>
      `;
    } else {
      this.soundToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#333">
          <path d="M16.5 12c0-1.8-1-3.3-2.5-4v1.7l2.4 2.4c.1-.3.1-.7.1-1.1zm2.5 0c0 .9-.2 1.8-.5 2.6l1.5 1.5c.5-1.3.8-2.6.8-4.1 0-5.3-3.5-9.8-8.3-11.2v2.1c3.7 1.2 6.5 4.7 6.5 9.1z"/>
          <path d="M3 9v6h4l5 5V4L7 9H3zm7 1.7L8.2 9H5v6h3.2l1.8-1.7v-2.6z"/>
          <path d="M4.7 3.8L3.3 5.2l10.7 10.7 1.4-1.4z"/>
        </svg>
      `;
    }
  }
}