class Ball {
  loc = [0, 0];
  v = [0, 0];
  col = [0, 0, 0];

  constructor() {
  }

  update_loc() {
    this.loc[0] += this.v[0];
    this.loc[1] += this.v[1];
    if (this.loc[0] < 0) {
      this.loc[0] = 0;
      this.v[0] *= -1;
    }
    if (this.loc[0] > width) {
      this.loc[0] = width;
      this.v[0] *= -1;
    }
    if (this.loc[1] < 0) {
      this.loc[1] = 0;
      this.v[1] *= -1;
    }
    if (this.loc[1] > height) {
      this.loc[1] = height;
      this.v[1] *= -1;
    }
  }

  display() {
    noStroke();
    fill(this.col[0], this.col[1], this.col[2]);
    ellipse(this.loc[0], this.loc[1], 5, 5)
  }
}

function setup() {
  createCanvas(300, 300);
  ball = []
  for (let i = 0; i < 10; i++) {
    let obj = new Ball();
    obj.loc = [rand(width / 4, width * 3 / 4), rand(height / 4, height * 3 / 4)];
    obj.v = [rand(-3, 3), rand(-3, 3)];
    obj.col = [rand(0, 255), rand(0, 255), rand(0, 255)];
    ball.push(obj);
  }
}

function rand(a, b) {
  if (typeof b === 'undefined') {
    if (typeof a === 'undefined') {
      mi = 0;
      ma = 1;
    } else {
      mi = 0;
      ma = a;
    }
  } else {
    mi = a;
    ma = b;
  }
  return Math.random() * (ma - mi) + mi;
}

function draw() {
  background(0);
  fill(255);
  for (let key in ball) {
    ball[key].display();
  }
  for (let key in ball) { ball[key].update_loc(); }
}