// 播放/暂停按钮控制
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const audioPlayer = document.getElementById('audioPlayer');

// 检查音频是否可播放
audioPlayer.addEventListener('canplay', () => {
    console.log('音频已加载');
    updateTimeDisplay();
});

// 先添加错误事件监听器
audioPlayer.addEventListener('error', () => {
    console.error('音频加载失败 - 详细错误信息:', {
        errorCode: audioPlayer.error.code,
        errorMessage: audioPlayer.error.message,
        networkState: audioPlayer.networkState,
        readyState: audioPlayer.readyState,
        currentSrc: audioPlayer.currentSrc
    });
    playPauseBtn.disabled = true;
    
    // 检查文件是否存在
    fetch(audioPlayer.src)
        .then(response => {
            console.log('音频文件HTTP状态:', response.status, response.statusText);
            if (!response.ok) {
                console.error('音频文件不存在或无法访问:', audioPlayer.src);
            }
            return response.blob();
        })
        .then(blob => {
            console.log('音频文件类型:', blob.type, '大小:', blob.size + ' bytes');
        })
        .catch(err => {
            console.error('检查音频文件时出错:', err);
        });
});

// 监听元数据加载完成事件
//console.log('正在尝试加载音频文件:', audioPlayer.src);
audioPlayer.addEventListener('loadedmetadata', () => {
    console.log('音频元数据已加载');
    console.log('001.mp3元数据:', {
        duration: audioPlayer.duration,
        audioTracks: audioPlayer.audioTracks,
        readyState: audioPlayer.readyState,
        error: audioPlayer.error,
        src: audioPlayer.src,
        networkState: audioPlayer.networkState
    });
    if (!isNaN(audioPlayer.duration)) {
        const duration = document.getElementById('duration');
        if (duration) {
            duration.textContent = formatTime(audioPlayer.duration);
        }
    }
});

audioPlayer.addEventListener('error', () => {
    console.error('音频加载失败 - 详细错误信息:', {
        errorCode: audioPlayer.error.code,
        errorMessage: audioPlayer.error.message,
        networkState: audioPlayer.networkState,
        readyState: audioPlayer.readyState,
        currentSrc: audioPlayer.currentSrc
    });
    playPauseBtn.disabled = true;
    
    // 检查文件是否存在
    fetch(audioPlayer.src)
        .then(response => {
            console.log('音频文件HTTP状态:', response.status, response.statusText);
            if (!response.ok) {
                console.error('音频文件不存在或无法访问:', audioPlayer.src);
            }
            return response.blob();
        })
        .then(blob => {
            console.log('音频文件类型:', blob.type, '大小:', blob.size + ' bytes');
        })
        .catch(err => {
            console.error('检查音频文件时出错:', err);
        });
});

const audioWave = document.getElementById('audioWave');

// 格式化时间为分钟:秒
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// 更新时间显示
function updateTimeDisplay() {
    const currentTime = document.getElementById('currentTime');
    const duration = document.getElementById('duration');
    
    if (currentTime) {
        currentTime.textContent = formatTime(audioPlayer.currentTime);
    }
    if (duration && !isNaN(audioPlayer.duration)) {
        duration.textContent = formatTime(audioPlayer.duration);
    }
}

// 监听时间更新
audioPlayer.addEventListener('timeupdate', updateTimeDisplay);

playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play().then(() => {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            audioWave.classList.add('playing');
        }).catch(error => {
            console.error('播放失败:', error);
        });
    } else {
        audioPlayer.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        audioWave.classList.remove('playing');
    }
});

// 分享按钮点击事件
const shareButton = document.getElementById('shareButton');
const shareModal = document.getElementById('shareModal');

shareButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = shareModal.classList.contains('hidden');
    shareModal.classList.toggle('hidden', !isHidden);
    shareModal.classList.toggle('active', isHidden);
    shareButton.setAttribute('aria-expanded', isHidden);
});

// 复制链接按钮点击事件
document.querySelector('.share-platform[data-platform="link"]').addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        //alert('链接已复制到剪贴板');
    } catch (err) {
        console.error('复制失败:', err);
        //alert('复制失败，请手动复制链接');
    }
    shareModal.classList.add('hidden');
    shareButton.setAttribute('aria-expanded', false);
});

// 点击其他地方关闭分享菜单
document.addEventListener('click', (e) => {
    if (!shareButton.contains(e.target) && !shareModal.contains(e.target)) {
        shareModal.classList.add('hidden');
        shareButton.setAttribute('aria-expanded', false);
    }
});
