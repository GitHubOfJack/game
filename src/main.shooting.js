import * as THREE from 'three';
import { Game } from './game/Game';
import { GameModes } from './game/GameModes';

// 初始化游戏
const game = new Game();

// 设置和启动射击模式
window.addEventListener('load', () => {
    // 更新加载进度
    const loadingBar = document.querySelector('.loading-bar');
    const loadingScreen = document.getElementById('loading-screen');
    
    // 模拟加载进度
    let progress = 10;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // 加载完成后隐藏加载屏幕并启动游戏
            setTimeout(() => {
                loadingScreen.style.opacity = 0;
                loadingScreen.style.transition = 'opacity 0.5s';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    
                    // 启动射击模式
                    game.startMode(GameModes.SHOOTING);
                    
                    // 添加音效控制功能
                    setupSoundToggle();
                }, 500);
            }, 500);
        }
        loadingBar.style.width = `${progress}%`;
    }, 300);
});

// 设置音效开关
function setupSoundToggle() {
    const soundToggle = document.getElementById('sound-toggle');
    let soundEnabled = true;
    
    // 初始状态
    updateSoundIcon(soundEnabled);
    
    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        
        // 更新声音状态
        game.setSoundEnabled(soundEnabled);
        
        // 更新图标
        updateSoundIcon(soundEnabled);
    });
}

// 更新声音图标
function updateSoundIcon(enabled) {
    const soundToggle = document.getElementById('sound-toggle');
    
    if (enabled) {
        soundToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#333">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4z"/>
            </svg>
        `;
    } else {
        soundToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#333">
                <path d="M16.5 12c0-1.8-1-3.3-2.5-4v2.2l2.5 2.5c0-.2 0-.5 0-.7zm2.5 0c0 .9-.2 1.8-.5 2.6l1.5 1.5c.5-1.3.8-2.6.8-4.1 0-5-3.5-9.2-8.3-10.3v2.1c3.7 1 6.5 4.4 6.5 8.2zM3 9v6h4l5 5V4L7 9H3zm7 1.7v4.6l-2.2-2.2H5v-2h2.8L10 10.7zm4.5-1.7v.7l1.3 1.3c0-.3 0-.6 0-.8 0-1.8-1-3.3-2.5-4v2.1c.5.2 1 .5 1.2.7zm-5.5 9l4 4 .7-.7-12-12-.7.7 3 3z"/>
            </svg>
        `;
    }
}

// 处理窗口大小变化
window.addEventListener('resize', () => {
    game.onWindowResize();
});