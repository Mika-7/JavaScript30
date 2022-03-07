const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');
let time;

function timer(seconds) {
  // 清除上一次倒计时函数
  clearInterval(time);

  const now = Date.now();
  const then = now + seconds * 1000;

  displayTimeLeft(seconds);
  displayEndTime(then);

  time = setInterval(() => {
      const secondsLeft = Math.round((then - Date.now()) / 1000);
      // clearInterval() 不会立刻终止当前未执行完的 setInterval，只清除下一次的 setInterval函数
      if (secondsLeft <= 0) clearInterval(time);
      displayTimeLeft(secondsLeft);
  }, 1000);
}
// 转化为 时：分：秒 格式
function displayTimeLeft(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) - hours * 60;
  const remainderSeconds = seconds % 60;
  const display = `${handleTimeZero(hours)}:${handleTimeZero(minutes)}:${handleTimeZero(remainderSeconds)}`
//   console.log(hours,minutes,remainderSeconds);
  timerDisplay.innerHTML = display;
  document.title = display;
}
// 时间小于10，补0
function handleTimeZero(time) {
  return (time < 10 ? '0' : '') + time;
}
// 预计结束时间
function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hours = end.getHours();
  const minutes = end.getMinutes();
  const adjustHours = hours > 12 ? hours - 12 : hours;

  endTime.innerHTML = `将于${hours < 12 ? '上午':'下午'}  ${handleTimeZero(adjustHours)}:${handleTimeZero(minutes)} 停止倒计时`;
}
// 按钮组件逻辑
function startTime() {
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

buttons.forEach(button => button.addEventListener('click',startTime));
// 表单启动倒计时
document.customForm.addEventListener('submit',function(e) {
  e.preventDefault();
  const mins = this.minutes.value;
  timer(mins * 60);
  this.reset();
});