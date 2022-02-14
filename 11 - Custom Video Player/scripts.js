// 获取元素
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const fullScreen = player.querySelector('.fullScreen');

const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// 创建函数，实现功能

//  切换播放和暂停
function togglePlay() {
    // if(video.paused) {
    //     video.play();
    // }
    // else {
    //     video.pause();
    // }
    const method = video.paused ? 'play': 'pause';
    // 执行方法
    video[method]();
}

// 同步变化播放按键的图标
function updateButton() {
    const icon = this.paused ? '▶' :' ▎▎';
    console.log('updateButton');
    toggle.textContent = icon;
}

// 快进/快退
function skip() {
    // console.log(this.dataset.skip);
    //  this.dataset.skip 为 String 类型 需要转换为 Number
    video.currentTime += parseFloat(this.dataset.skip);
}

// 音量和播放倍速范围更新
function handleRangeUpdate() {
//   console.log(this.name);
//   console.log(this.value);
     video[this.name] = this.value;
}

// 进度条更新
function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

// scrub 擦除
function scrub(e) {
    console.log(e);
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

function fullScreenVideo() {
    if (video.requestFullscreen) {
        video.requestFullscreen();
     }
     else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
     }
     else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
     }
     else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
     }
}

function toggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }
// 监听事件，绑定函数
video.addEventListener('click',togglePlay);
video.addEventListener('play',updateButton);
video.addEventListener('pause',updateButton);
video.addEventListener('timeupdate',handleProgress);
toggle.addEventListener('click',togglePlay);

skipButtons.forEach(button => button.addEventListener('click',skip));
ranges.forEach(range => range.addEventListener('change',handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove',handleRangeUpdate));
let mousedown = false;
progress.addEventListener('click',scrub);
progress.addEventListener('mousemove',(e) => mousedown && scrub(e));
progress.addEventListener('mousedown',() => mousedown = true);
progress.addEventListener('mouseup',() => mousedown = false);

fullScreen.addEventListener('click',fullScreenVideo());

