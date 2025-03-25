/**
 * 音频管理器
 * 负责加载和播放游戏音效与背景音乐
 * 专为幼儿设计的温和、友好音效
 * @class AudioManager
 */
export default class AudioManager {
  /**
   * 创建音频管理器
   */
  constructor() {
    // 音效库
    this.sounds = {};
    
    // 背景音乐
    this.backgroundMusic = null;
    
    // 音频设置
    this.settings = {
      // 主音量（0-1）
      masterVolume: 0.7,
      // 音效音量
      soundVolume: 0.8,
      // 音乐音量（较低，避免干扰）
      musicVolume: 0.4,
      // 音效是否启用
      soundEnabled: true,
      // 音乐是否启用
      musicEnabled: true
    };
    
    // 绑定事件监听
    this.bindEvents();
    
    // 预加载音效
    this.preloadSounds();
  }
  
  /**
   * 绑定事件监听
   */
  bindEvents() {
    // 监听声音开关事件
    document.addEventListener('soundToggle', (event) => {
      this.settings.soundEnabled = event.detail.enabled;
      this.settings.musicEnabled = event.detail.enabled;
      
      if (event.detail.enabled && this.backgroundMusic) {
        this.backgroundMusic.play();
      } else if (!event.detail.enabled && this.backgroundMusic) {
        this.backgroundMusic.pause();
      }
    });
  }
  
  /**
   * 预加载所有音效
   */
  preloadSounds() {
    // 定义需要加载的音效
    const soundFiles = {
      // 界面音效
      'click': '/sounds/click.mp3',
      'hover': '/sounds/hover.mp3',
      
      // 游戏操作音效
      'select': '/sounds/select.mp3',
      'place': '/sounds/place.mp3',
      'shoot': '/sounds/shoot.mp3',
      'pop': '/sounds/pop.mp3',
      
      // 反馈音效（温和版本）
      'success': '/sounds/success.mp3',
      'correct': '/sounds/correct.mp3',
      'wrong': '/sounds/wrong.mp3', // 非常温和的错误提示音
      'complete': '/sounds/complete.mp3',
      
      // 特殊音效
      'hint': '/sounds/hint.mp3',
      'assist': '/sounds/assist.mp3',
      'reward': '/sounds/reward.mp3'
    };
    
    // 加载所有音效
    for (const [name, path] of Object.entries(soundFiles)) {
      this.loadSound(name, path);
    }
    
    // 加载背景音乐
    this.loadBackgroundMusic('/music/background.mp3');
  }
  
  /**
   * 加载单个音效
   * @param {string} name - 音效名称
   * @param {string} path - 音效文件路径
   */
  loadSound(name, path) {
    const audio = new Audio(path);
    
    // 设置音频属性
    audio.volume = this.settings.soundVolume * this.settings.masterVolume;
    audio.preload = 'auto';
    
    // 加入到音效库
    this.sounds[name] = audio;
    
    // 错误处理
    audio.addEventListener('error', () => {
      console.warn(`无法加载音效: ${path}`);
    });
  }
  
  /**
   * 加载背景音乐
   * @param {string} path - 音乐文件路径
   */
  loadBackgroundMusic(path) {
    this.backgroundMusic = new Audio(path);
    
    // 设置音频属性
    this.backgroundMusic.volume = this.settings.musicVolume * this.settings.masterVolume;
    this.backgroundMusic.loop = true;
    this.backgroundMusic.preload = 'auto';
    
    // 错误处理
    this.backgroundMusic.addEventListener('error', () => {
      console.warn(`无法加载背景音乐: ${path}`);
    });
  }
  
  /**
   * 播放音效
   * @param {string} name - 音效名称
   */
  playSound(name) {
    if (!this.settings.soundEnabled) return;
    
    const sound = this.sounds[name];
    if (!sound) {
      console.warn(`未找到音效: ${name}`);
      return;
    }
    
    // 克隆音频以允许重叠播放
    const soundClone = sound.cloneNode();
    
    // 设置音量
    soundClone.volume = this.settings.soundVolume * this.settings.masterVolume;
    
    // 播放完后自动销毁
    soundClone.addEventListener('ended', () => {
      soundClone.remove();
    });
    
    // 播放
    const playPromise = soundClone.play();
    
    // 处理自动播放限制
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('自动播放受阻: ', error);
        
        // 添加点击监听器来恢复音频
        const resumeAudio = () => {
          soundClone.play();
          document.removeEventListener('click', resumeAudio);
        };
        
        document.addEventListener('click', resumeAudio);
      });
    }
  }
  
  /**
   * 开始播放背景音乐
   */
  playBackgroundMusic() {
    if (!this.settings.musicEnabled || !this.backgroundMusic) return;
    
    // 淡入播放
    this.backgroundMusic.volume = 0;
    const fadePromise = this.backgroundMusic.play();
    
    // 处理自动播放限制
    if (fadePromise !== undefined) {
      fadePromise.then(() => {
        // 淡入效果
        let volume = 0;
        const fadeInterval = setInterval(() => {
          volume += 0.05;
          if (volume >= this.settings.musicVolume * this.settings.masterVolume) {
            volume = this.settings.musicVolume * this.settings.masterVolume;
            clearInterval(fadeInterval);
          }
          this.backgroundMusic.volume = volume;
        }, 100);
      }).catch(error => {
        console.warn('背景音乐自动播放受阻: ', error);
        
        // 添加点击监听器来恢复音频
        const resumeMusic = () => {
          this.playBackgroundMusic();
          document.removeEventListener('click', resumeMusic);
        };
        
        document.addEventListener('click', resumeMusic);
      });
    }
  }
  
  /**
   * 停止背景音乐
   */
  stopBackgroundMusic() {
    if (!this.backgroundMusic) return;
    
    // 淡出
    let volume = this.backgroundMusic.volume;
    const fadeInterval = setInterval(() => {
      volume -= 0.05;
      if (volume <= 0) {
        volume = 0;
        clearInterval(fadeInterval);
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
      }
      this.backgroundMusic.volume = volume;
    }, 100);
  }
  
  /**
   * 调整主音量
   * @param {number} volume - 音量值 (0-1)
   */
  setMasterVolume(volume) {
    this.settings.masterVolume = Math.max(0, Math.min(1, volume));
    
    // 更新所有音效音量
    for (const sound of Object.values(this.sounds)) {
      sound.volume = this.settings.soundVolume * this.settings.masterVolume;
    }
    
    // 更新背景音乐音量
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.settings.musicVolume * this.settings.masterVolume;
    }
  }
  
  /**
   * 播放宝宝友好的成功音效和奖励音效
   * 为成功动作提供丰富的听觉反馈
   */
  playSuccessSequence() {
    if (!this.settings.soundEnabled) return;
    
    // 先播放正确音效
    this.playSound('correct');
    
    // 延迟后播放成功音效
    setTimeout(() => {
      this.playSound('success');
    }, 500);
    
    // 最后播放奖励音效
    setTimeout(() => {
      this.playSound('reward');
    }, 1000);
  }
  
  /**
   * 播放温和的提示音效
   * 专为幼儿设计，避免负面反馈
   */
  playGentleReminder() {
    if (!this.settings.soundEnabled) return;
    
    // 播放轻柔的提示音
    this.playSound('hint');
  }
} 