// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const progressHandle = document.getElementById('progressHandle');
    const progressContainer = document.getElementById('progressContainer');
    const currentTime = document.getElementById('currentTime');
    const totalTime = document.getElementById('totalTime');
    const descriptionContainer = document.getElementById('descriptionContainer');
    const audioWave = document.getElementById('audioWave');
    const shareButton = document.getElementById('shareButton');
    const shareModal = document.getElementById('shareModal');
    const sharePlatforms = document.querySelectorAll('.share-platform');

    // 音频播放控制
    playPauseBtn.addEventListener('click', togglePlayPause);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', updateTotalTime);
    progressContainer.addEventListener('click', seek);
    audioPlayer.addEventListener('play', () => {
        audioWave.classList.add('playing');
        playPauseBtn.innerHTML = '<i class="fa fa-pause text-xl text-accent"></i>';
    });
    audioPlayer.addEventListener('pause', () => {
        audioWave.classList.remove('playing');
        playPauseBtn.innerHTML = '<i class="fa fa-play text-xl text-accent"></i>';
    });

    // 分享按钮点击事件
    shareButton.addEventListener('click', (e) => {
        e.stopPropagation();
        shareModal.classList.toggle('hidden');
        setTimeout(() => {
            shareModal.classList.toggle('active');
        }, 10);
    });

    // 点击其他区域关闭分享菜单
    document.addEventListener('click', () => {
        shareModal.classList.remove('active');
        setTimeout(() => {
            shareModal.classList.add('hidden');
        }, 300);
    });

    // 阻止分享菜单内部点击冒泡
    shareModal.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // 分享平台点击事件
    sharePlatforms.forEach(platform => {
        platform.addEventListener('click', () => {
            const platformType = platform.getAttribute('data-platform');
            const shareLink = window.location.href;
            const shareTitle = document.title;
            const shareImage = 'https://picsum.photos/1200/675?random=1'; // 示例图片

            shareModal.classList.remove('active');
            setTimeout(() => {
                shareModal.classList.add('hidden');
            }, 300);

            switch (platformType) {
                case 'wechat':
                    showToast('请使用微信客户端分享此页面');
                    break;
                case 'link':
                    navigator.clipboard.writeText(shareLink).then(() => {
                        showToast('链接已复制到剪贴板');
                    }).catch(err => {
                        showToast('复制失败，请手动复制链接');
                        console.error('无法复制链接: ', err);
                    });
                    break;
            }
        });
    });

    // 播放/暂停功能
    function togglePlayPause() {
        if (audioPlayer.paused || audioPlayer.ended) {
            audioPlayer.play();
            playPauseBtn.classList.add('animate-pulse');
        } else {
            audioPlayer.pause();
            playPauseBtn.classList.remove('animate-pulse');
        }
    }

    // 更新进度条
    function updateProgress() {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${percent}%`;
        progressHandle.style.left = `${percent}%`;
        currentTime.textContent = formatTime(audioPlayer.currentTime);
    }

    // 更新总时长
    function updateTotalTime() {
        totalTime.textContent = formatTime(audioPlayer.duration);
    }

    // 进度条点击跳转
    function seek(e) {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    }

    // 时间格式化
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // 显示提示消息
    function showToast(message) {
        // 检查是否已存在toast
        let toast = document.querySelector('.toast');
        if (toast) {
            document.body.removeChild(toast);
        }
        
        // 创建toast元素
        toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        // 添加到页面
        document.body.appendChild(toast);
        
        // 显示动画
        setTimeout(() => {
            toast.classList.add('active');
        }, 10);
        
        // 自动消失
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // 监听滚动事件
    descriptionContainer.addEventListener('scroll', () => {
        const scrollTop = descriptionContainer.scrollTop;
        const scrollHeight = descriptionContainer.scrollHeight;
        const clientHeight = descriptionContainer.clientHeight;
        const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    });
});
