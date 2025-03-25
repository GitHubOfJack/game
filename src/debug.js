// 调试脚本
console.log('调试模式已启动');

window.addEventListener('load', () => {
    console.log('页面已加载');
    
    // 获取DOM元素
    const gameContainer = document.getElementById('game-container');
    const gameCanvas = document.getElementById('game-canvas');
    const loadingScreen = document.getElementById('loading-screen');
    const scoreValue = document.getElementById('score-value');
    const targetValue = document.getElementById('target-value');
    
    // 打印DOM元素状态
    console.log('DOM元素状态:');
    console.log('gameContainer:', gameContainer);
    console.log('gameCanvas:', gameCanvas);
    console.log('loadingScreen:', loadingScreen);
    console.log('scoreValue:', scoreValue);
    console.log('targetValue:', targetValue);
    
    // 尝试强制显示UI元素
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = '1';
        console.log('已显示加载屏幕');
    }
    
    // 检查THREE.js是否正常加载
    if (typeof THREE !== 'undefined') {
        console.log('THREE.js已成功加载，版本:', THREE.REVISION);
    } else {
        console.error('THREE.js未加载成功');
    }
    
    // 创建一个简单的Three.js场景测试
    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: gameCanvas });
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        
        camera.position.z = 5;
        
        function animate() {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        
        // 启动动画
        animate();
        console.log('Three.js测试场景已创建');
        
        // 2秒后隐藏加载屏幕
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                console.log('已隐藏加载屏幕');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 2000);
        
    } catch (error) {
        console.error('Three.js测试场景创建失败:', error);
    }
});