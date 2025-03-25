/**
 * @class UIManager
 * @description 管理游戏中的所有UI元素和用户界面交互
 */
export default class UIManager {
  /**
   * @constructor
   * @param {Game} game - 游戏实例
   */
  constructor(game) {
    this.game = game;
    
    // UI元素容器
    this.elements = {};
    
    // 消息队列
    this.messageQueue = [];
    this.messageDisplayTime = 3000; // 3秒
    this.currentMessage = null;
    this.messageTimer = null;
    
    // 初始化
    this.init();
  }
  
  /**
   * @method init
   * @description 初始化UI系统
   */
  init() {
    // 创建主UI容器
    this.createUIContainer();
    
    // 创建基本UI元素
    this.createInstructionPanel();
    this.createScorePanel();
    this.createTargetPanel();
    this.createMessagePanel();
    this.createModeButtons();
    
    console.log('UI系统初始化成功');
  }
  
  /**
   * @method createUIContainer
   * @description 创建主UI容器
   */
  createUIContainer() {
    // 创建UI容器
    const container = document.createElement('div');
    container.id = 'game-ui';
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.fontFamily = 'Arial Rounded MT Bold, Arial, sans-serif';
    
    document.body.appendChild(container);
    
    this.elements.container = container;
  }
  
  /**
   * @method createInstructionPanel
   * @description 创建指令面板
   */
  createInstructionPanel() {
    const panel = document.createElement('div');
    panel.id = 'instruction-panel';
    panel.style.position = 'absolute';
    panel.style.top = '20px';
    panel.style.left = '50%';
    panel.style.transform = 'translateX(-50%)';
    panel.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    panel.style.color = '#8a2be2';
    panel.style.padding = '10px 20px';
    panel.style.borderRadius = '20px';
    panel.style.fontSize = '24px';
    panel.style.textAlign = 'center';
    panel.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    panel.style.minWidth = '300px';
    panel.innerHTML = '欢迎来到小小建筑师大冒险！';
    
    this.elements.container.appendChild(panel);
    this.elements.instructionPanel = panel;
  }
  
  /**
   * @method createScorePanel
   * @description 创建得分面板
   */
  createScorePanel() {
    const panel = document.createElement('div');
    panel.id = 'score-panel';
    panel.style.position = 'absolute';
    panel.style.top = '20px';
    panel.style.right = '20px';
    panel.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    panel.style.color = '#ff6347';
    panel.style.padding = '10px';
    panel.style.borderRadius = '10px';
    panel.style.fontSize = '20px';
    panel.style.textAlign = 'center';
    panel.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    
    // 星星计数
    const stars = document.createElement('div');
    stars.id = 'stars-count';
    stars.innerHTML = '<span style="color: #ffd700;">★</span> 0';
    panel.appendChild(stars);
    
    // 分数显示（射击模式使用）
    const score = document.createElement('div');
    score.id = 'score-count';
    score.innerHTML = '分数: 0';
    score.style.display = 'none';
    panel.appendChild(score);
    
    this.elements.container.appendChild(panel);
    this.elements.scorePanel = panel;
    this.elements.starsCount = stars;
    this.elements.scoreCount = score;
  }
  
  /**
   * @method createTargetPanel
   * @description 创建目标面板
   */
  createTargetPanel() {
    const panel = document.createElement('div');
    panel.id = 'target-panel';
    panel.style.position = 'absolute';
    panel.style.top = '20px';
    panel.style.left = '20px';
    panel.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    panel.style.color = '#4682b4';
    panel.style.padding = '10px';
    panel.style.borderRadius = '10px';
    panel.style.fontSize = '24px';
    panel.style.textAlign = 'center';
    panel.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    panel.style.display = 'none'; // 初始隐藏
    
    this.elements.container.appendChild(panel);
    this.elements.targetPanel = panel;
  }
  
  /**
   * @method createMessagePanel
   * @description 创建消息面板
   */
  createMessagePanel() {
    const panel = document.createElement('div');
    panel.id = 'message-panel';
    panel.style.position = 'absolute';
    panel.style.bottom = '100px';
    panel.style.left = '50%';
    panel.style.transform = 'translateX(-50%)';
    panel.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    panel.style.padding = '15px 30px';
    panel.style.borderRadius = '20px';
    panel.style.fontSize = '28px';
    panel.style.fontWeight = 'bold';
    panel.style.textAlign = 'center';
    panel.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    panel.style.transition = 'opacity 0.3s ease';
    panel.style.opacity = '0';
    panel.style.display = 'none';
    
    this.elements.container.appendChild(panel);
    this.elements.messagePanel = panel;
  }
  
  /**
   * @method createModeButtons
   * @description 创建模式切换按钮
   */
  createModeButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'mode-buttons';
    buttonContainer.style.position = 'absolute';
    buttonContainer.style.bottom = '20px';
    buttonContainer.style.left = '50%';
    buttonContainer.style.transform = 'translateX(-50%)';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '15px';
    buttonContainer.style.pointerEvents = 'auto';
    
    const modes = [
      { id: 'building', label: '搭建模式', color: '#ff7f50' },
      { id: 'shooting', label: '射击模式', color: '#9370db' },
      { id: 'puzzle', label: '拼图模式', color: '#3cb371' }
    ];
    
    modes.forEach(mode => {
      const button = document.createElement('button');
      button.id = `${mode.id}-button`;
      button.textContent = mode.label;
      button.style.backgroundColor = mode.color;
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '20px';
      button.style.padding = '10px 20px';
      button.style.fontSize = '18px';
      button.style.fontWeight = 'bold';
      button.style.cursor = 'pointer';
      button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      button.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
      
      // 鼠标悬停效果
      button.addEventListener('mouseover', () => {
        button.style.transform = 'translateY(-3px)';
        button.style.boxShadow = '0 7px 10px rgba(0, 0, 0, 0.3)';
      });
      
      button.addEventListener('mouseout', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      });
      
      // 点击事件
      button.addEventListener('click', () => {
        this.game.switchMode(mode.id);
      });
      
      buttonContainer.appendChild(button);
    });
    
    this.elements.container.appendChild(buttonContainer);
    this.elements.modeButtons = buttonContainer;
  }
  
  /**
   * @method showInstruction
   * @description 显示指令
   * @param {string} text - 指令文本
   */
  showInstruction(text) {
    if (this.elements.instructionPanel) {
      this.elements.instructionPanel.innerHTML = text;
      
      // 添加简单动画效果
      this.elements.instructionPanel.style.transform = 'translateX(-50%) scale(1.1)';
      setTimeout(() => {
        this.elements.instructionPanel.style.transform = 'translateX(-50%) scale(1)';
      }, 200);
    }
  }
  
  /**
   * @method updateStars
   * @description 更新星星数量
   * @param {number} count - 星星数量
   */
  updateStars(count) {
    if (this.elements.starsCount) {
      this.elements.starsCount.innerHTML = `<span style="color: #ffd700;">★</span> ${count}`;
    }
  }
  
  /**
   * @method updateScore
   * @description 更新分数
   * @param {number} score - 分数
   */
  updateScore(score) {
    if (this.elements.scoreCount) {
      this.elements.scoreCount.innerHTML = `分数: ${score}`;
    }
  }
  
  /**
   * @method showTarget
   * @description 显示目标
   * @param {string} type - 目标类型
   * @param {any} value - 目标值
   */
  showTarget(type, value) {
    if (this.elements.targetPanel) {
      let content = '';
      
      if (type === 'number') {
        content = `目标: <span style="color: #ff4500; font-size: 32px;">${value}</span>`;
      } else if (type === 'letter') {
        content = `目标: <span style="color: #4b0082; font-size: 32px;">${value}</span>`;
      } else if (type === 'shape') {
        const shapeNames = {
          'cube': '方块',
          'sphere': '球体',
          'cylinder': '圆柱',
          'cone': '圆锥',
          'triangle': '三角形'
        };
        content = `目标: ${shapeNames[value] || value}`;
      }
      
      this.elements.targetPanel.innerHTML = content;
      this.elements.targetPanel.style.display = 'block';
    }
  }
  
  /**
   * @method hideTarget
   * @description 隐藏目标
   */
  hideTarget() {
    if (this.elements.targetPanel) {
      this.elements.targetPanel.style.display = 'none';
    }
  }
  
  /**
   * @method showMessage
   * @description 显示消息
   * @param {string} text - 消息文本
   * @param {string} type - 消息类型 ('success', 'error', 'info')
   * @param {number} duration - 显示时长(毫秒)
   */
  showMessage(text, type = 'info', duration = this.messageDisplayTime) {
    // 添加到消息队列
    this.messageQueue.push({ text, type, duration });
    
    // 如果没有正在显示的消息，立即显示
    if (!this.currentMessage) {
      this.displayNextMessage();
    }
  }
  
  /**
   * @method displayNextMessage
   * @description 显示下一条消息
   */
  displayNextMessage() {
    // 清除之前的计时器
    if (this.messageTimer) {
      clearTimeout(this.messageTimer);
      this.messageTimer = null;
    }
    
    // 如果队列为空，结束
    if (this.messageQueue.length === 0) {
      this.currentMessage = null;
      this.elements.messagePanel.style.opacity = '0';
      
      // 隐藏面板
      setTimeout(() => {
        this.elements.messagePanel.style.display = 'none';
      }, 300);
      
      return;
    }
    
    // 获取下一条消息
    this.currentMessage = this.messageQueue.shift();
    
    // 设置消息样式
    this.elements.messagePanel.textContent = this.currentMessage.text;
    
    switch (this.currentMessage.type) {
      case 'success':
        this.elements.messagePanel.style.backgroundColor = 'rgba(76, 175, 80, 0.9)';
        this.elements.messagePanel.style.color = 'white';
        break;
      case 'error':
        this.elements.messagePanel.style.backgroundColor = 'rgba(244, 67, 54, 0.9)';
        this.elements.messagePanel.style.color = 'white';
        break;
      default: // info
        this.elements.messagePanel.style.backgroundColor = 'rgba(33, 150, 243, 0.9)';
        this.elements.messagePanel.style.color = 'white';
    }
    
    // 显示消息
    this.elements.messagePanel.style.display = 'block';
    
    // 添加延迟以确保过渡效果正常工作
    setTimeout(() => {
      this.elements.messagePanel.style.opacity = '1';
    }, 10);
    
    // 设置定时器
    this.messageTimer = setTimeout(() => {
      this.displayNextMessage();
    }, this.currentMessage.duration);
  }
  
  /**
   * @method showSuccess
   * @description 显示成功消息
   * @param {string} text - 消息文本
   */
  showSuccess(text) {
    this.showMessage(text, 'success');
  }
  
  /**
   * @method showError
   * @description 显示错误消息
   * @param {string} text - 消息文本
   */
  showError(text) {
    this.showMessage(text, 'error');
  }
  
  /**
   * @method showLevelComplete
   * @description 显示关卡完成信息
   * @param {number} score - 最终得分
   */
  showLevelComplete(score) {
    const message = `太棒了！关卡完成！得分: ${score}`;
    this.showSuccess(message);
    
    // 添加一些特效（彩色星星等）
    this.createStarEffect();
  }
  
  /**
   * @method createStarEffect
   * @description 创建星星特效
   */
  createStarEffect() {
    // 创建50个星星
    for (let i = 0; i < 50; i++) {
      this.createStar();
    }
  }
  
  /**
   * @method createStar
   * @description 创建单个星星
   */
  createStar() {
    const star = document.createElement('div');
    
    // 随机位置
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    // 随机大小
    const size = Math.random() * 30 + 10;
    
    // 随机颜色
    const colors = ['#FFD700', '#FF6347', '#7CFC00', '#BA55D3', '#40E0D0'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // 设置样式
    star.style.position = 'absolute';
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.style.fontSize = `${size}px`;
    star.style.color = color;
    star.innerHTML = '★';
    star.style.pointerEvents = 'none';
    star.style.opacity = '0';
    star.style.transition = 'transform 1s ease, opacity 1s ease';
    
    // 添加到容器
    this.elements.container.appendChild(star);
    
    // 动画
    setTimeout(() => {
      star.style.opacity = '1';
      star.style.transform = `translate(${Math.random() * 100 - 50}px, ${-Math.random() * 300 - 100}px) rotate(${Math.random() * 360}deg)`;
    }, 10);
    
    // 移除星星
    setTimeout(() => {
      star.style.opacity = '0';
      setTimeout(() => {
        if (star.parentNode) {
          star.parentNode.removeChild(star);
        }
      }, 1000);
    }, 1000);
  }
  
  /**
   * @method updateModeUI
   * @description 更新模式UI
   * @param {string} mode - 当前模式
   */
  updateModeUI(mode) {
    // 更新按钮状态
    const buttons = this.elements.modeButtons.children;
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      if (button.id === `${mode}-button`) {
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.8)';
      } else {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      }
    }
    
    // 更新分数显示
    if (mode === 'shooting') {
      this.elements.scoreCount.style.display = 'block';
    } else {
      this.elements.scoreCount.style.display = 'none';
    }
    
    // 清空目标面板
    if (mode !== 'shooting') {
      this.hideTarget();
    }
  }
} 