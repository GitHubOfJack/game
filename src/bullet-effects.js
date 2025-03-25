// 创建子弹轨迹
function createBulletTrail(startX, startY, endX, endY) {
  // 计算距离和角度
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const angle = Math.atan2(deltaY, deltaX) - Math.PI/2;
  
  // 创建轨迹元素
  const trail = document.createElement('div');
  trail.className = 'bullet-trail';
  trail.style.height = distance + 'px';
  trail.style.left = startX + 'px';
  trail.style.top = startY + 'px';
  trail.style.transform = `rotate(${angle}rad)`;
  
  // 添加到DOM
  document.body.appendChild(trail);
  
  // 创建多个轨迹增强效果
  createTrailEffect(startX, startY, endX, endY);
  
  // 淡出动画
  setTimeout(() => {
    trail.style.opacity = '0';
    trail.style.transition = 'opacity 0.5s';
    
    // 移除元素
    setTimeout(() => {
      if (document.body.contains(trail)) {
        document.body.removeChild(trail);
      }
    }, 500);
  }, 300);
}

// 创建额外的轨迹效果
function createTrailEffect(startX, startY, endX, endY) {
  // 创建额外的小型轨迹，增强视觉效果
  for (let i = 0; i < 3; i++) {
    // 随机偏移
    const offsetX = (Math.random() - 0.5) * 3;
    const offsetY = (Math.random() - 0.5) * 3;
    
    // 计算距离和角度
    const deltaX = endX - startX + offsetX;
    const deltaY = endY - startY + offsetY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) - Math.PI/2;
    
    // 创建轨迹元素
    const trail = document.createElement('div');
    trail.className = 'bullet-trail';
    trail.style.height = distance + 'px';
    trail.style.left = (startX + offsetX) + 'px';
    trail.style.top = (startY + offsetY) + 'px';
    trail.style.transform = `rotate(${angle}rad)`;
    trail.style.width = '2px'; // 稍微细一点
    trail.style.opacity = '0.7'; // 稍微透明一点
    
    // 添加到DOM
    document.body.appendChild(trail);
    
    // 淡出动画
    setTimeout(() => {
      trail.style.opacity = '0';
      trail.style.transition = 'opacity 0.3s';
      
      // 移除元素
      setTimeout(() => {
        if (document.body.contains(trail)) {
          document.body.removeChild(trail);
        }
      }, 300);
    }, 200 + i * 50);
  }
}

// 创建弹痕
function createImpactMark(x, y) {
  const mark = document.createElement('div');
  mark.className = 'impact-mark';
  mark.style.left = x + 'px';
  mark.style.top = y + 'px';
  
  // 添加到DOM
  document.body.appendChild(mark);
  
  // 创建额外的碎片效果
  createImpactParticles(x, y);
  
  // 设置淡出并移除
  setTimeout(() => {
    mark.style.opacity = '0';
    
    // 移除元素
    setTimeout(() => {
      if (document.body.contains(mark)) {
        document.body.removeChild(mark);
      }
    }, 1000);
  }, 2000);
}

// 创建命中碎片效果
function createImpactParticles(x, y) {
  // 创建5-8个碎片
  const particleCount = 5 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.backgroundColor = i % 2 === 0 ? '#ffcc00' : '#ff6600';
    particle.style.borderRadius = '50%';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.zIndex = '98';
    particle.style.boxShadow = '0 0 3px rgba(255, 200, 50, 0.8)';
    
    // 随机方向和速度
    const angle = Math.random() * Math.PI * 2;
    const speed = 30 + Math.random() * 50;
    const endX = x + Math.cos(angle) * speed;
    const endY = y + Math.sin(angle) * speed;
    
    // 添加动画
    particle.style.transition = 'all 0.5s ease-out';
    
    // 添加到DOM
    document.body.appendChild(particle);
    
    // 开始动画
    setTimeout(() => {
      particle.style.left = endX + 'px';
      particle.style.top = endY + 'px';
      particle.style.opacity = '0';
      
      // 清理
      setTimeout(() => {
        if (document.body.contains(particle)) {
          document.body.removeChild(particle);
        }
      }, 500);
    }, 10);
  }
}

// 显示枪口闪光
function showMuzzleFlash() {
  const flash = document.querySelector('.muzzle-flash');
  flash.style.opacity = '1';
  
  // 添加脉动效果
  flash.style.transform = 'scale(1.2)';
  setTimeout(() => {
    flash.style.transform = 'scale(1)';
  }, 25);
  
  setTimeout(() => {
    flash.style.opacity = '0';
  }, 70);
}