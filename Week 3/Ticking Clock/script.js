const secondHand = document.getElementById("seconds");
const minuteHand = document.getElementById("minutes");
const hourHand = document.getElementById("hours");

const digital_second = document.getElementById("digi-seconds");
const digital_minute = document.getElementById("digi-minutes");
const digital_hour = document.getElementById("digi-hours");

function getSecondsSinceStartOfDay() {
  return {
    seconds: new Date().getSeconds(),
    minutes: new Date().getMinutes(),
    hours: new Date().getHours(),
  };
}
setInterval(function () {
  const time = getSecondsSinceStartOfDay();
  let position = {
    seconds: time.seconds / 60,
    minutes: time.minutes / 60,
    hours: time.hours / 12,
  };
  console.log("time", time);
  console.log("position", position);

  rotate(secondHand, position.seconds);
  rotate(minuteHand, position.minutes);
  rotate(hourHand, position.hours);

  setDigitalClock(time);
}, 1000);

function rotate(el, position) {
  el.style.transform = "rotate(" + position + "turn)";
}

function setDigitalClock(time) {
  digital_second.innerHTML = formatNumber(time.seconds);
  digital_minute.innerHTML = formatNumber(time.minutes);
  digital_hour.innerHTML = time.hours;
}

function formatNumber(num) {
  return num < 10 ? "0" + num : num;
}
