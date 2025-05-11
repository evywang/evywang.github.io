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
    
    // 图片查看器相关元素
    const mainImage = document.getElementById('mainImage');
    const imageContainer = document.getElementById('imageContainer');
    const imageViewer = document.getElementById('imageViewer');
    const viewerImage = document.getElementById('viewerImage');
    const closeViewerBtn = document.getElementById('closeViewerBtn');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const resetZoomBtn = document.getElementById('resetZoomBtn');
    const viewerZoomInBtn = document.getElementById('viewerZoomInBtn');
    const viewerZoomOutBtn = document.getElementById('viewerZoomOutBtn');
    const viewerResetBtn = document.getElementById('viewerResetBtn');
    const viewerContainer = document.getElementById('viewerContainer');
    
    // 图片缩放相关变量
    let scale = 1;
    let startX = 0;
    let startY = 0;
    let translateX = 0;
    let translateY = 0;
    let lastTranslateX = 0;
    let lastTranslateY = 0;
    let isDragging = false;
    let startDistance = 0;
    let isPinching = false;
    let lastScale = 1;
    
    // 图片查看器初始化
    viewerImage.src = mainImage.src;
    
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

    // 图片查看器功能
    imageContainer.addEventListener('click', openImageViewer);
    closeViewerBtn.addEventListener('click', closeImageViewer);
    zoomInBtn.addEventListener('click', () => { zoomImage(1.2); });
    zoomOutBtn.addEventListener('click', () => { zoomImage(0.8); });
    resetZoomBtn.addEventListener('click', resetImageZoom);
    viewerZoomInBtn.addEventListener('click', () => { zoomImage(1.2); });
    viewerZoomOutBtn.addEventListener('click', () => { zoomImage(0.8); });
    viewerResetBtn.addEventListener('click', resetImageZoom);
    
    // 打开图片查看器
    function openImageViewer() {
        imageViewer.classList.remove('hidden');
        setTimeout(() => {
            imageViewer.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 10);
        
        // 重置图片状态
        resetImageZoom();
    }
    
    // 关闭图片查看器
    function closeImageViewer() {
        imageViewer.classList.remove('active');
        setTimeout(() => {
            imageViewer.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }
    
    // 缩放图片
    function zoomImage(factor) {
        scale *= factor;
        scale = Math.max(1, Math.min(scale, 5)); // 限制缩放范围
        updateImageTransform();
    }
    
    // 重置图片缩放和平移
    function resetImageZoom() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        lastTranslateX = 0;
        lastTranslateY = 0;
        updateImageTransform();
    }
    
    // 更新图片变换
    function updateImageTransform() {
        viewerImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }
    
    // 鼠标/触摸事件处理 - 只在查看器容器上监听事件
    viewerContainer.addEventListener('mousedown', startDrag);
    viewerContainer.addEventListener('touchstart', handleTouchStart);
    
    // 修改：只在查看器容器上监听移动和结束事件
    viewerContainer.addEventListener('mousemove', drag);
    viewerContainer.addEventListener('touchmove', handleTouchMove);
    
    viewerContainer.addEventListener('mouseup', endDrag);
    viewerContainer.addEventListener('mouseleave', endDrag);
    viewerContainer.addEventListener('touchend', endDrag);
    
    // 双击放大/缩小
    viewerContainer.addEventListener('dblclick', toggleZoom);
    
    // 鼠标滚轮缩放
    viewerContainer.addEventListener('wheel', handleWheel);
    
    // 开始拖拽
    function startDrag(e) {
        if (e.button !== 0) return; // 只处理左键
        isDragging = true;
        startX = e.clientX - lastTranslateX;
        startY = e.clientY - lastTranslateY;
        viewerContainer.style.cursor = 'grabbing';
    }
    
    // 拖拽过程
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        // 获取鼠标在容器中的位置
        const rect = viewerContainer.getBoundingClientRect();
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        translateX = clientX - rect.left - startX;
        translateY = clientY - rect.top - startY;
        
        // 限制平移范围，防止图片完全移出容器
        const maxTranslateX = Math.max(0, (viewerImage.naturalWidth * scale - viewerContainer.clientWidth) / 2);
        const maxTranslateY = Math.max(0, (viewerImage.naturalHeight * scale - viewerContainer.clientHeight) / 2);
        
        translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX));
        translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY));
        
        updateImageTransform();
    }
    
    // 结束拖拽
    function endDrag() {
        if (!isDragging && !isPinching) return;
        
        isDragging = false;
        isPinching = false;
        lastTranslateX = translateX;
        lastTranslateY = translateY;
        viewerContainer.style.cursor = 'grab';
    }
    
    // 触摸开始
    function handleTouchStart(e) {
        e.preventDefault();
        
        if (e.touches.length === 1) {
            // 单点触摸 - 拖拽
            isDragging = true;
            isPinching = false;
            
            // 获取触摸点在容器中的位置
            const rect = viewerContainer.getBoundingClientRect();
            startX = e.touches[0].clientX - rect.left - lastTranslateX;
            startY = e.touches[0].clientY - rect.top - lastTranslateY;
        } else if (e.touches.length === 2) {
            // 双点触摸 - 缩放
            isPinching = true;
            isDragging = false;
            
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            
            // 计算两指间的距离
            const dx = touch2.clientX - touch1.clientX;
            const dy = touch2.clientY - touch1.clientY;
            startDistance = Math.hypot(dx, dy);
            
            lastScale = scale;
            
            // 计算双指中心
            const rect = viewerContainer.getBoundingClientRect();
            const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
            const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;
            
            // 记录当前缩放中心位置
            startX = centerX;
            startY = centerY;
        }
    }
    
    // 触摸移动
    function handleTouchMove(e) {
        if (isDragging && e.touches.length === 1) {
            // 单点拖拽
            e.preventDefault();
            
            // 获取触摸点在容器中的位置
            const rect = viewerContainer.getBoundingClientRect();
            const clientX = e.touches[0].clientX;
            const clientY = e.touches[0].clientY;
            
            translateX = clientX - rect.left - startX;
            translateY = clientY - rect.top - startY;
            
            // 限制平移范围
            const maxTranslateX = Math.max(0, (viewerImage.naturalWidth * scale - viewerContainer.clientWidth) / 2);
            const maxTranslateY = Math.max(0, (viewerImage.naturalHeight * scale - viewerContainer.clientHeight) / 2);
            
            translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX));
            translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY));
            
            updateImageTransform();
        } else if (isPinching && e.touches.length === 2) {
            // 双指缩放
            e.preventDefault();
            
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            
            // 计算当前两指间的距离
            const dx = touch2.clientX - touch1.clientX;
            const dy = touch2.clientY - touch1.clientY;
            const currentDistance = Math.hypot(dx, dy);
            
            // 计算缩放比例
            const scaleFactor = currentDistance / startDistance;
            scale = Math.max(1, Math.min(lastScale * scaleFactor, 5)); // 限制缩放范围
            
            // 计算双指中心
            const rect = viewerContainer.getBoundingClientRect();
            const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
            const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;
            
            // 保持缩放中心位置不变
            translateX = lastTranslateX + (centerX - startX) * (1 - lastScale / scale);
            translateY = lastTranslateY + (centerY - startY) * (1 - lastScale / scale);
            
            // 限制平移范围
            const maxTranslateX = Math.max(0, (viewerImage.naturalWidth * scale - viewerContainer.clientWidth) / 2);
            const maxTranslateY = Math.max(0, (viewerImage.naturalHeight * scale - viewerContainer.clientHeight) / 2);
            
            translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX));
            translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY));
            
            updateImageTransform();
        }
    }
    
    // 双击切换缩放
    function toggleZoom() {
        if (scale > 1.5) {
            resetImageZoom();
        } else {
            scale = 2;
            updateImageTransform();
        }
    }
    
    // 鼠标滚轮缩放
    function handleWheel(e) {
        e.preventDefault();
        
        // 获取鼠标在容器中的位置
        const rect = viewerContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 计算鼠标在图片上的相对位置
        const imageX = (mouseX - translateX) / scale;
        const imageY = (mouseY - translateY) / scale;
        
        // 根据滚轮方向缩放
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        scale *= delta;
        scale = Math.max(1, Math.min(scale, 5)); // 限制缩放范围
        
        // 调整平移，使鼠标位置保持不变
        translateX = mouseX - imageX * scale;
        translateY = mouseY - imageY * scale;
        
        // 限制平移范围
        const maxTranslateX = Math.max(0, (viewerImage.naturalWidth * scale - viewerContainer.clientWidth) / 2);
        const maxTranslateY = Math.max(0, (viewerImage.naturalHeight * scale - viewerContainer.clientHeight) / 2);
        
        translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX));
        translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY));
        
        updateImageTransform();
    }
});