const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true,audio: false})
      .then(localMediaStream => {
          console.log(localMediaStream);
        //   这个方法已被 Chrome 弃用  
        //   video.src = window.URL.createObjectURL(localMediaStream); 
          video.srcObject = localMediaStream;
          video.play();
      })
      .catch(err => {
          console.error(`Oh,here is a error`,err);
      });
}
// 向幕布输出每一帧画面，构成视频
function paintToCanvas() {
    const { videoWidth: width,videoHeight: height } = video;

    // [canvas.height] = [width,height];
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
      ctx.drawImage(video,0,0,width,height);
      let pixels = ctx.getImageData(0,0,width,height);
      //   console.log(pixels);
      // pixels = redEffect(pixels);
      //   pixels = greenScreen(pixels);
      pixels = rgbSplit(pixels);
      //   ctx.globalAlpha = 1;
      ctx.putImageData(pixels,0,0);

    },0);
}
// 拍照
function takePhoto() {
    // 播放背景音效
    snap.currentTime = 0;
    snap.play();
    // 处理 canvas 的数据
    const data = canvas.toDataURL('/image/jpeg');
    const link = document.createElement('a');
    //   link.href = data;
    link.setAttribute('download','handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome Man">`;

    strip.insertBefore(link,strip.firstChild);

    console.log(data);
}
// 红色滤镜
function redEffect(pixels) {
    for(i = 0;i < pixels.data.length;i += 4) {
        pixels.data[i + 0] =  pixels.data[i + 0] + 100;
        pixels.data[i + 1] =  pixels.data[i + 1] - 50;
        pixels.data[i + 2] =  pixels.data[i + 2] * 0.5;
    }
    return pixels;
}
// rgb 分离滤镜
function rgbSplit(pixels) {
    for(i = 0;i < pixels.data.length;i += 4) {
        pixels.data[i - 150] =  pixels.data[i + 0] ;// + 100
        pixels.data[i + 100] =  pixels.data[i + 1] ;// - 100
        pixels.data[i - 150] =  pixels.data[i + 2] ; // + 20
    }
    return pixels;
}
// 似乎不起作用
function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // 变透明!
        pixels.data[i + 3] = 0;
      }
    }
    return pixels;
}

getVideo();

video.addEventListener('canplay',paintToCanvas);