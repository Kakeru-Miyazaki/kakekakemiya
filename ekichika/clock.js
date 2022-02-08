var hour = 0;
var preTime = 0;
var time = 30;
var isLocked = false;
var deg_m = 6 * time;
var deg_h = hour * 30 + deg_m / 12;
// var userSetHour = hour;
// var userSetTime = time;
function setClock(x, y) {

  var clk = document.getElementById('scale');
  var rect = clk.getBoundingClientRect();  // 画面左上を基準とする位置

  // document（ページ左上）からの絶対座標
  var x1 = clk.clientWidth / 2;
  var y1 = clk.clientHeight / 2;

  // console.log(x1, y1);

  var deg = Math.atan2((x - x1), -(y - y1)) * 360 / (2 * Math.PI);

  if (deg <= 0) {
    deg += 360;
  }
  preTime = time;
  time = Math.round(deg / 6);

  if (55 <= time && time <= 60 && 0 <= preTime && preTime <= 5) {
    if (isLocked) {
      isLocked = false;
    } else if (hour == 0) {
      deg = 0;
      document.querySelector(".min").style.transform = `rotate(${deg}deg)`;
      isLocked = true;
    } else {
      --hour;
    }
  }

  if (55 <= preTime && preTime <= 60 && 0 <= time && time <= 5) {
    // if (time == 0 && preTime == 60) {
    // hour = Math.min(hour + 1, 2);
    if (isLocked) {
      isLocked = false;
    } else if (hour == 2) {
      deg = 355;
      document.querySelector(".min").style.transform = `rotate(${deg}deg)`;
      isLocked = true;
    } else {
      ++hour;
    }

  }
  // console.log(hour, userSetTime);

  if (isLocked) {
    return
  }
  userSetHour = hour;
  userSetTime = time;
  if (userSetTime == 60) {
    --userSetTime;
  }
  // 針の角度
  deg_m = 6 * time;
  deg_h = hour * 30 + deg_m / 12;
  // var deg_s = now.getSeconds() * (360 / 60);
  if (hour == 0) {
    document.getElementById("setTime").innerHTML = time + "min";
  } else {
    document.getElementById("setTime").innerHTML = hour + "h " + time + "min";
  }
  // それぞれの針に角度を設定
  document.querySelector(".hour").style.transform = `rotate(${deg_h}deg)`;
  document.querySelector(".min").style.transform = `rotate(${deg_m}deg)`;
  // document.querySelector(".sec").style.transform = `rotate(${deg_s}deg)`;
};



window.onload = function () {
  // メモリを追加
  for (let i = 1; i <= 12; i++) {
    // scaleクラスの要素の最後にdiv要素を追加
    let scaleElem = document.querySelector(".scale");
    let addElem = document.createElement("div");
    scaleElem.appendChild(addElem);

    // 角度をつける
    document.querySelector(".scale div:nth-child(" + i + ")").style.transform = `rotate(${i * 30}deg)`;
  }
  if (hour == 0) {
    document.getElementById("setTime").innerHTML = time + "min";
  } else {
    document.getElementById("setTime").innerHTML = hour + "h " + time + "min";
  }
  // それぞれの針に角度を設定
  document.querySelector(".hour").style.transform = `rotate(${deg_h}deg)`;
  document.querySelector(".min").style.transform = `rotate(${deg_m}deg)`;

}

function muuXY(e, that) {
  if (!e) e = window.event;

  // console.log(that);
  var x, y;
  if (e.targetTouches) {
    x = e.targetTouches[0].pageX - e.target.offsetLeft;
    y = e.targetTouches[0].pageY - e.target.offsetTop;
  }
  else if (that) {
    x = e.pageX - that.offsetLeft;
    y = e.pageY - that.offsetTop;
  }
  return [x, y];
}

var isDragged = false;

document.getElementById('clock').onmousemove = function (e) {
  if (isDragged) {
    var xy = muuXY(e, this);
    // console.log('Xの座標は' + xy[0] + 'Yの座標は' + xy[1]);
    setClock(xy[0], xy[1]);
  }
}

var clock = document.getElementById('clock');
clock.onmousedown = function (event) {
  isDragged = true;
  clock.onmouseup = function () {
    isDragged = false;
    // clock.onmouseup = null;
  };
};

clock.ondragstart = function () {
  return false;
};
