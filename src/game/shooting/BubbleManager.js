import * as THREE from 'three';
import SniperCharacter from './SniperCharacter.js';

/**
 * @class BubbleManager
 * @description 管理射击模式中的射击和目标检测
 */
export default class BubbleManager {
  /**
   * @constructor
   * @param {ShootingMode} shootingMode - 射击模式实例
   * @param {THREE.Scene} scene - 场景对象
   */
  constructor(shootingMode, scene) {
    this.shootingMode = shootingMode;
    this.scene = scene;
    
    // 狙击手角色
    this.sniper = null;
    
    // 爆炸效果
    this.explosions = [];
    
    // 初始化
    this.init();
  }
  
  /**
   * @method init
   * @description 初始化管理器
   */
  init() {
    // 创建狙击手角色
    this.sniper = new SniperCharacter(this.scene);
  }
  
  /**
   * @method shootAt
   * @description 向指定位置射击
   * @param {THREE.Vector3} targetPosition - 目标位置
   */
  shootAt(targetPosition) {
    if (this.sniper.isShooting) return;
    
    // 执行狙击手射击动作
    this.sniper.shoot(targetPosition);
    
    // 检查是否击中目标
    this.checkHit(targetPosition);
  }
  
  /**
   * @method checkHit
   * @description 检查射击是否击中目标
   * @param {THREE.Vector3} shotPosition - 射击位置
   */
  checkHit(shotPosition) {
    if (!this.shootingMode.targetManager || !this.shootingMode.targetManager.targets) {
      return;
    }
    
    const targets = this.shootingMode.targetManager.targets;
    
    // 检查每个目标
    for (let i = targets.length - 1; i >= 0; i--) {
      const target = targets[i];
      
      // 计算距离
      const distance = shotPosition.distanceTo(target.position);
      
      // 判断是否击中（使用更大的碰撞半径）
      if (distance < 1.5) {
        // 根据目标类型调用不同的回调
        if (target.userData.isTarget) {
          this.shootingMode.onTargetHit(target);
        } else {
          this.shootingMode.onWrongTargetHit(target);
        }
        
        // 每次只处理一个碰撞
        break;
      }
    }
  }
  
  /**
   * @method createExplosion
   * @description 创建爆炸效果
   * @param {THREE.Vector3} position - 爆炸位置
   * @param {number} color - 爆炸颜色
   */
  createExplosion(position, color) {
    // 创建粒子组
    const explosionGroup = new THREE.Group();
    explosionGroup.position.copy(position);
    
    // 创建多个粒子
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      // 随机方向
      const direction = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ).normalize();
      
      // 随机速度
      const speed = Math.random() * 0.1 + 0.05;
      
      // 设置粒子属性
      particle.userData = {
        velocity: direction.multiplyScalar(speed),
        age: 0,
        maxAge: Math.random() * 30 + 20
      };
      
      explosionGroup.add(particle);
    }
    
    // 添加到场景
    this.scene.add(explosionGroup);
    
    // 存储爆炸效果
    if (!this.explosions) this.explosions = [];
    this.explosions.push(explosionGroup);
    
    return explosionGroup;
  }
  
  /**
   * @method updateExplosions
   * @description 更新爆炸效果
   */
  updateExplosions() {
    if (!this.explosions) return;
    
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const explosion = this.explosions[i];
      let allParticlesRemoved = true;
      
      // 更新所有粒子
      for (let j = explosion.children.length - 1; j >= 0; j--) {
        const particle = explosion.children[j];
        
        // 更新位置
        particle.position.add(particle.userData.velocity);
        
        // 更新年龄和透明度
        particle.userData.age++;
        particle.material.opacity = 1 - (particle.userData.age / particle.userData.maxAge);
        
        // 移除过旧的粒子
        if (particle.userData.age >= particle.userData.maxAge) {
          explosion.remove(particle);
        } else {
          allParticlesRemoved = false;
        }
      }
      
      // 如果所有粒子都被移除，移除整个爆炸效果
      if (allParticlesRemoved) {
        this.scene.remove(explosion);
        this.explosions.splice(i, 1);
      }
    }
  }
  
  /**
   * @method update
   * @description 更新所有组件
   */
  update() {
    // 更新狙击手角色
    if (this.sniper) {
      this.sniper.update();
    }
    
    // 更新爆炸效果
    this.updateExplosions();
  }
  
  /**
   * @method cleanup
   * @description 清理资源
   */
  cleanup() {
    // 清理爆炸效果
    if (this.explosions) {
      this.explosions.forEach(explosion => {
        this.scene.remove(explosion);
      });
      this.explosions = [];
    }
    
    // 清理角色
    if (this.sniper && this.sniper.character) {
      this.scene.remove(this.sniper.character);
      this.sniper = null;
    }
  }
}