import * as THREE from 'three';

/**
 * @class SceneManager
 * @description 管理场景、相机和渲染
 */
export class SceneManager {
  /**
   * @constructor
   * @param {THREE.WebGLRenderer} renderer - 渲染器实例
   */
  constructor(renderer) {
    this.renderer = renderer;
    
    // 创建场景
    this.scene = new THREE.Scene();
    
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      75, // 视野角度
      window.innerWidth / window.innerHeight, // 长宽比
      0.1, // 近裁剪面
      1000 // 远裁剪面
    );
    
    // 设置默认相机位置
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);
    
    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    // 添加方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    
    // 设置阴影
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    
    // 当前活动相机
    this.activeCamera = this.camera;
  }
  
  /**
   * @method onWindowResize
   * @description 处理窗口大小变化
   */
  onWindowResize() {
    // 更新相机
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    // 更新渲染器
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  /**
   * @method setActiveCamera
   * @description 设置活动相机
   * @param {THREE.Camera} camera - 要设置为活动的相机
   */
  setActiveCamera(camera) {
    this.activeCamera = camera;
  }
  
  /**
   * @method render
   * @description 渲染场景
   */
  render() {
    this.renderer.render(this.scene, this.activeCamera);
  }
}