const r = 20;
let x = 50;
let y = 100;
let vx = 2;
let vy = 3;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0);
  ellipse(x, y, 2 * r, 2 * r);
  x += vx;
  y += vy;
  if (x > width - r || x < r) {
    vx *= -1;
  }
  if (y > height - r || y < r) {
    vy *= -1;
  }
}
