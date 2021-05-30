let WINDOW_W = 200; // 画面サイズ横
let WINDOW_H = 200; // 画面サイズ縦
let DISPLAY_RATE = 1;
const ARRAY_MAX_SIZE = 100; // 配列のサイズ
const FRAME_RATE = 60; // フレームレート[1/s]
const SPLIT_N = 100; // 1フレームあたりの物理演算数
const DELTA_T = 1 / (SPLIT_N * FRAME_RATE); // 物理演算間隔[s]
const g = 9.80665; // 重力加速度[m/s^2]

let x = []; // カートの位置[m]
let dx = []; // カートの測度[m/s]
let ddx = []; // カートの加速度[m/s^2]
let f = []; // カートにかかる力[kg*m/s^2]
for (let i = 0; i < ARRAY_MAX_SIZE; i++) { x.push(0); }
for (let i = 0; i < ARRAY_MAX_SIZE; i++) { dx.push(0); }
for (let i = 0; i < ARRAY_MAX_SIZE; i++) { ddx.push(0); }
for (let i = 0; i < ARRAY_MAX_SIZE; i++) { f.push(0); } 
const M = 1; // カートの質量[kg]
const C = 5; // カートの減衰定数[kg/s]
const PUSH = 15; // カートを押す強さ[kg*m/s^2]

let theta = []; // ポールの角度[1]
let dtheta = []; // ポールの角速度[1/s]
let ddtheta = []; // ポールの角加速度[1/s^2]
for (let i = 0; i < ARRAY_MAX_SIZE; i++) { theta.push(0); }
for (let i = 0; i < ARRAY_MAX_SIZE; i++) { dtheta.push(0); }
for (let i = 0; i < ARRAY_MAX_SIZE; i++) { ddtheta.push(0); }
const l = 1; // ポールの長さ[m]
const m = 1 // ポールの質量[kg]
const I = m * l * l / 3; // ポールの端回りの慣性モーメント[kg*m^2]
const j = 0.2 // ポールの角粘性係数[kg*m/s]

let t = 0; // 現在時刻[s]
let t_index = 0; // [s / (SPLIT_N * FRAME_RATE)]
let right_push = false;
let left_push = false;
let score = 0; // ポールが立ってる時間計測
let high_score = 0; // 最高記録
let is_high_score = false; // 最高記録更新中

function setup() {
  // WINDOW_W = windowWidth;
  // WINDOW_H = windowHeight;
  createCanvas(WINDOW_W, WINDOW_H);
  frameRate(FRAME_RATE);
  for (let i = 0; i < ARRAY_MAX_SIZE; i++) { x[i] = 0; }
  for (let i = 0; i < ARRAY_MAX_SIZE; i++) { theta[i] = PI; }
  t = 0;
  DISPLAY_RATE = min(WINDOW_W, WINDOW_H) / 2
}

function draw() {

  // 物理演算を行う
  for (i = 0; i < SPLIT_N; i++) {
    
    // 矢印入力を元に力を決定
    if (right_push == true) {
      f[get_index(t)] = PUSH;
    } else if (left_push == true) {
      f[get_index(t)] = -PUSH;
    } else {
      f[get_index(t)] = 0;
    }
    
    // 画面端
    if (x[get_index(t - 1)] < -width / (2 * DISPLAY_RATE) && dx[get_index(t - 1)] < 0) {
      f[get_index(t)] = 1000;
    } else if (x[get_index(t - 1)] > width / (2 * DISPLAY_RATE) && dx[get_index(t - 1)] > 0) {
      f[get_index(t)] = -1000;
    }
    
    // カートの位置，ポールの角度を演算
    ddx[get_index(t - 1)] = (f[get_index(t - 1)] - C * dx[get_index(t - 1)]) / (M + m);
    dx[get_index(t)] = dx[get_index(t - 1)] + ddx[get_index(t - 1)] * DELTA_T;
    x[get_index(t)] = x[get_index(t - 1)] + dx[get_index(t - 1)] * DELTA_T;
    ddtheta[get_index(t - 1)] = (0.5 * m * g * l * sin(theta[get_index(t - 1)]) + 0.5 * m * l * ddx[get_index(t - 1)] * cos(theta[get_index(t - 1)]) - j * dtheta[get_index(t - 1)]) / I;
    dtheta[get_index(t)] = dtheta[get_index(t - 1)] + ddtheta[get_index(t - 1)] * DELTA_T;
    theta[get_index(t)] = theta[get_index(t - 1)] + dtheta[get_index(t - 1)] * DELTA_T;
    
    // ポールが立ったら計測開始
    th = (theta[get_index(t)] % (2 * PI) + (2 * PI)) % (2 * PI);
    if ((th >= 0 && th < 1) || (th >= 2 * PI - 1 && th < 2 * PI)) {
      score+= DELTA_T;
    } else {
      score = 0;
    }
    if (score > high_score) {
      high_score = score;
      is_high_score = true;
    } else {
      is_high_score = false;
    }
    
    // 最後のループだけ描画する
    if (i == SPLIT_N - 1) {
      // スコア描画
      push();
      background(0);
      textAlign(LEFT, TOP);
      textSize(WINDOW_H / 8);
      if (score > 0) {
        fill(0, 255, 0);
      } else {
        fill(255);
      }
      text(min(9.99, score.toFixed(2)), 10, 10);
      if (is_high_score) {
        fill(0, 255, 0);
      } else {
        fill(255);
      }
      text(min(9.99, high_score.toFixed(2)), 10, 10 + WINDOW_H / 8);
      pop();
      
      // カート描画
      push();
      translate(width * 0.5, height * 0.8);
      rectMode(CENTER);
      rect(x[get_index(t)] * DISPLAY_RATE, 0, width * 0.15, height * 0.07);
      pop();
      
      // ポール描画
      push();
      translate(width * 0.5 + x[get_index(t)] * DISPLAY_RATE, height * 0.8);
      rotate(PI - theta[get_index(t)]);
      rectMode(CORNER);
      rect(-(width * 0.015), 0, width * 0.03, l * DISPLAY_RATE);
      pop();
    }
    
    // 時間を更新
    t++;
  }
}

function get_index(i) {
  while (i < 0) {
    i += ARRAY_MAX_SIZE;
  }
  return (i % ARRAY_MAX_SIZE);
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    right_push = true;
    left_push = false;
  } else if (keyCode === LEFT_ARROW) {
    left_push = true;
    right_push = false;
  }
}

function keyReleased() {
  if (keyCode === RIGHT_ARROW) {
    right_push = false;
  } else if (keyCode === LEFT_ARROW) {
    left_push = false;
  }
}