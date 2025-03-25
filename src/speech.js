/**
 * 语音播报功能
 * 实现目标读出和成功/失败反馈
 */

// 语音合成实例
let synth = window.speechSynthesis;
let speaking = false;

/**
 * 播报目标字母或数字
 * @param {string|number} target - 需要播报的目标值
 */
function announceTarget(target) {
  if (speaking) return; // 避免语音重叠
  
  try {
    speaking = true;
    
    let targetText = '';
    
    // 针对不同类型的目标进行特殊处理
    if (typeof target === 'number' || !isNaN(target)) {
      // 数字目标
      targetText = `目标数字: ${target}`;
    } else {
      // 字母目标 - 读出字母
      targetText = `目标字母: ${getLetterName(target)}`;
    }
    
    // 创建语音实例
    const utterance = new SpeechSynthesisUtterance(targetText);
    
    // 设置语音参数
    utterance.lang = 'zh-CN';
    utterance.volume = 0.8;
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    
    // 语音完成回调
    utterance.onend = function() {
      speaking = false;
    };
    
    // 播放语音
    synth.speak(utterance);
  } catch (error) {
    console.error('语音播报失败:', error);
    speaking = false;
  }
}

/**
 * 获取字母的中文名称
 * @param {string} letter - 英文字母
 * @returns {string} 字母的中文读法
 */
function getLetterName(letter) {
  const letterMap = {
    'A': '字母A',
    'B': '字母B',
    'C': '字母C',
    'D': '字母D', 
    'E': '字母E',
    'F': '字母F',
    'G': '字母G',
    'H': '字母H',
    'I': '字母I',
    'J': '字母J',
    'K': '字母K',
    'L': '字母L',
    'M': '字母M',
    'N': '字母N',
    'O': '字母O',
    'P': '字母P',
    'Q': '字母Q',
    'R': '字母R',
    'S': '字母S',
    'T': '字母T',
    'U': '字母U',
    'V': '字母V',
    'W': '字母W',
    'X': '字母X',
    'Y': '字母Y',
    'Z': '字母Z'
  };
  
  return letterMap[letter.toUpperCase()] || letter;
}

/**
 * 播放成功反馈语音
 */
function playSuccessVoice() {
  if (speaking) return;
  
  try {
    speaking = true;
    
    const phrases = [
      "干得好！",
      "太棒了！",
      "完美射击！",
      "精准命中！",
      "继续保持！"
    ];
    
    // 随机选择一个短语
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = 'zh-CN';
    utterance.volume = 0.9;
    utterance.rate = 1.1;
    utterance.pitch = 1.2; // 稍高一点的音调表示积极情绪
    
    utterance.onend = function() {
      speaking = false;
    };
    
    synth.speak(utterance);
  } catch (error) {
    console.error('语音反馈失败:', error);
    speaking = false;
  }
}

/**
 * 播放失败反馈语音
 */
function playFailureVoice() {
  if (speaking) return;
  
  try {
    speaking = true;
    
    const phrases = [
      "再试一次！",
      "注意观察目标！",
      "专注瞄准！",
      "再来一次！",
      "仔细瞄准！"
    ];
    
    // 随机选择一个短语
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = 'zh-CN';
    utterance.volume = 0.8;
    utterance.rate = 1.0;
    utterance.pitch = 0.9; // 稍低一点的音调表示需要改进
    
    utterance.onend = function() {
      speaking = false;
    };
    
    synth.speak(utterance);
  } catch (error) {
    console.error('语音反馈失败:', error);
    speaking = false;
  }
}

function playGameOverVoice() {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = "游戏结束！您的最终得分是" + document.querySelector('.score').textContent + "分";
    utterance.lang = 'zh-CN';
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}