import * as THREE from 'three';

/**
 * @class SniperCharacter
 * @description 创建并管理狙击手角色及狙击枪
 */
export default class SniperCharacter {
  /**
   * @constructor
   * @param {THREE.Scene} scene - 场景对象
   */
  constructor(scene) {
    this.scene = scene;
    
    // 角色组
    this.character = null;
    
    // 枪口位置
    this.muzzlePosition = new THREE.Vector3();
    
    // 是否在射击动画中
    this.isShooting = false;
    
    // 射击弹道线
    this.bulletLine = null;
    
    // 创建角色
    this.createCharacter();
  }
  
  /**
   * @method createCharacter
   * @description 创建狙击手角色
   */
  createCharacter() {
    // 创建角色组
    this.character = new THREE.Group();
    
    // 创建小人身体
    this.createBody();
    
    // 创建狙击步枪
    this.createSniper();
    
    // 设置角色位置
    this.character.position.set(0, 0, 7);
    
    // 添加到场景
    this.scene.add(this.character);
    
    return this.character;
  }
  
  /**
   * @method createBody
   * @description 创建小人身体
   */
  createBody() {
    // 头部
    const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFD8C0, // 肤色
      roughness: 0.7,
      metalness: 0.1
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.6;
    this.character.add(head);
    
    // 帽子
    const hatGeometry = new THREE.CylinderGeometry(0.32, 0.32, 0.2, 16);
    const hatMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333, // 黑色
      roughness: 0.7,
      metalness: 0.3
    });
    const hat = new THREE.Mesh(hatGeometry, hatMaterial);
    hat.position.y = 0.8;
    this.character.add(hat);
    
    // 身体
    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.5, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2D572C, // 军绿色
      roughness: 0.7,
      metalness: 0.2
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.25;
    this.character.add(body);
    
    // 眼睛
    const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.1, 0.65, 0.25);
    this.character.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.1, 0.65, 0.25);
    this.character.add(rightEye);
    
    // 手臂
    const armGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.4, 8);
    const armMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2D572C, // 军绿色
      roughness: 0.7,
      metalness: 0.2
    });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.3, 0.4, 0);
    leftArm.rotation.z = Math.PI / 4;
    this.character.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.3, 0.4, 0);
    rightArm.rotation.z = -Math.PI / 4;
    this.character.add(rightArm);
    
    // 手
    const handGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const handMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFD8C0, // 肤色
      roughness: 0.7,
      metalness: 0.1
    });
    
    const leftHand = new THREE.Mesh(handGeometry, handMaterial);
    leftHand.position.set(-0.45, 0.25, 0);
    this.character.add(leftHand);
    
    const rightHand = new THREE.Mesh(handGeometry, handMaterial);
    rightHand.position.set(0.45, 0.25, 0);
    this.character.add(rightHand);
  }
  
  /**
   * @method createSniper
   * @description 创建狙击步枪
   */
  createSniper() {
    // 创建枪组
    const sniperGroup = new THREE.Group();
    
    // 创建主枪身
    const barrelGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2.0, 8);
    const barrelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x111111, // 黑色
      roughness: 0.3,
      metalness: 0.8
    });
    const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0, 0, 0);
    sniperGroup.add(barrel);
    
    // 枪托
    const stockGeometry = new THREE.BoxGeometry(0.6, 0.15, 0.08);
    const stockMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B4513, // 棕色
      roughness: 0.8,
      metalness: 0.1
    });
    const stock = new THREE.Mesh(stockGeometry, stockMaterial);
    stock.position.set(-0.9, 0, 0);
    sniperGroup.add(stock);
    
    // 瞄准镜
    const scopeGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16);
    const scopeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x222222, // 深灰色
      roughness: 0.3,
      metalness: 0.8
    });
    const scope = new THREE.Mesh(scopeGeometry, scopeMaterial);
    scope.position.set(0, 0.15, 0);
    scope.rotation.x = Math.PI / 2;
    sniperGroup.add(scope);
    
    // 镜片
    const lensGeometry = new THREE.CircleGeometry(0.06, 16);
    const lensMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00FFFF, // 青色
      opacity: 0.7,
      transparent: true
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.position.set(0, 0.15, 0.16);
    lens.rotation.x = Math.PI / 2;
    sniperGroup.add(lens);
    
    // 狙击脚架
    const bipodGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
    const bipodMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x555555, // 灰色
      roughness: 0.5,
      metalness: 0.6
    });
    
    const leftBipod = new THREE.Mesh(bipodGeometry, bipodMaterial);
    leftBipod.position.set(0.5, -0.2, -0.1);
    leftBipod.rotation.x = Math.PI / 4;
    sniperGroup.add(leftBipod);
    
    const rightBipod = new THREE.Mesh(bipodGeometry, bipodMaterial);
    rightBipod.position.set(0.5, -0.2, 0.1);
    rightBipod.rotation.x = -Math.PI / 4;
    sniperGroup.add(rightBipod);
    
    // 记录枪口位置
    this.muzzlePosition.set(1.0, 0, 0);
    sniperGroup.userData.muzzlePosition = this.muzzlePosition.clone();
    
    // 设置枪位置
    sniperGroup.position.set(0.5, 0.5, 0.5);
    sniperGroup.rotation.y = -Math.PI / 2;
    
    // 保存枪组引用并添加到角色
    this.sniper = sniperGroup;
    this.character.add(sniperGroup);
    
    // 创建子弹轨迹线
    const bulletLineMaterial = new THREE.LineBasicMaterial({ 
      color: 0xFFFF00,
      opacity: 0.7,
      transparent: true
    });
    const bulletLineGeometry = new THREE.BufferGeometry();
    this.bulletLine = new THREE.Line(bulletLineGeometry, bulletLineMaterial);
    this.bulletLine.visible = false;
    this.scene.add(this.bulletLine);
  }
  
  /**
   * @method aimAt
   * @description 瞄准目标点
   * @param {THREE.Vector3} targetPosition - 目标位置
   */
  aimAt(targetPosition) {
    // 让狙击手角色面向目标
    const direction = new THREE.Vector3();
    direction.subVectors(targetPosition, this.character.position);
    
    // 只取水平旋转（Y轴）
    direction.y = 0;
    direction.normalize();
    
    // 计算角度
    const angle = Math.atan2(direction.x, direction.z);
    
    // 设置角色朝向
    this.character.rotation.y = angle;
    
    // 计算狙击枪仰角
    const charPos = this.character.position.clone();
    charPos.y += 0.5; // 调整到枪的高度
    const verticalDirection = new THREE.Vector3();
    verticalDirection.subVectors(targetPosition, charPos);
    verticalDirection.normalize();
    
    // 计算仰角
    const elevation = Math.asin(verticalDirection.y);
    
    // 设置狙击枪仰角
    this.sniper.rotation.x = elevation;
  }
  
  /**
   * @method shoot
   * @description 执行射击动作
   * @param {THREE.Vector3} targetPosition - 目标位置
   */
  shoot(targetPosition) {
    if (this.isShooting) return;
    
    this.isShooting = true;
    
    // 设置瞄准方向
    this.aimAt(targetPosition);
    
    // 获取世界坐标系中的枪口位置
    const muzzleWorldPos = new THREE.Vector3();
    const muzzleLocal = new THREE.Vector3(1.0, 0, 0);
    this.sniper.localToWorld(muzzleLocal);
    muzzleWorldPos.copy(muzzleLocal);
    
    // 创建射击特效
    this.createMuzzleFlash(muzzleWorldPos);
    
    // 创建子弹轨迹
    this.showBulletTrail(muzzleWorldPos, targetPosition);
    
    // 后坐力动画
    const originalPosition = this.sniper.position.clone();
    this.sniper.position.x -= 0.1; // 后退
    
    // 射击动画完成后重置
    setTimeout(() => {
      // 恢复位置
      this.sniper.position.copy(originalPosition);
      
      // 隐藏子弹轨迹
      this.bulletLine.visible = false;
      
      this.isShooting = false;
    }, 300);
  }
  
  /**
   * @method createMuzzleFlash
   * @description 创建枪口闪光
   * @param {THREE.Vector3} position - 闪光位置
   */
  createMuzzleFlash(position) {
    // 闪光材质
    const flashMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFCC33,
      transparent: true,
      opacity: 0.8
    });
    
    // 闪光形状
    const flashGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
    
    // 设置位置
    flash.position.copy(position);
    
    // 添加到场景
    this.scene.add(flash);
    
    // 闪光动画
    let scale = 1.0;
    const expandRate = 0.2;
    
    const animate = () => {
      scale += expandRate;
      flash.scale.set(scale, scale, scale);
      flash.material.opacity -= 0.15;
      
      if (flash.material.opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        this.scene.remove(flash);
      }
    };
    
    animate();
  }
  
  /**
   * @method showBulletTrail
   * @description 显示子弹轨迹
   * @param {THREE.Vector3} startPos - 起始位置
   * @param {THREE.Vector3} endPos - 结束位置
   */
  showBulletTrail(startPos, endPos) {
    // 更新轨迹线几何体
    const points = [startPos, endPos];
    this.bulletLine.geometry.setFromPoints(points);
    
    // 显示轨迹线
    this.bulletLine.visible = true;
    
    // 渐隐动画
    let opacity = 1.0;
    
    const fadeOut = () => {
      opacity -= 0.1;
      
      if (opacity > 0) {
        this.bulletLine.material.opacity = opacity;
        requestAnimationFrame(fadeOut);
      } else {
        this.bulletLine.visible = false;
      }
    };
    
    setTimeout(fadeOut, 100);
  }
  
  /**
   * @method getMuzzlePosition
   * @description 获取枪口在世界坐标系中的位置
   * @returns {THREE.Vector3} 枪口位置
   */
  getMuzzlePosition() {
    const muzzleWorldPos = new THREE.Vector3();
    const muzzleLocal = new THREE.Vector3(1.0, 0, 0);
    this.sniper.localToWorld(muzzleLocal);
    muzzleWorldPos.copy(muzzleLocal);
    return muzzleWorldPos;
  }
  
  /**
   * @method update
   * @description 更新角色
   */
  update() {
    // 角色呼吸动画
    if (!this.isShooting) {
      const breatheOffset = Math.sin(Date.now() * 0.002) * 0.02;
      this.character.position.y = breatheOffset;
    }
  }
}