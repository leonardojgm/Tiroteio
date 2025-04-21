const canvas = document.getElementById('explosions');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 4 + 1;
    this.color = 'rgba(255,69,0,0.7)';
    this.speedX = Math.random() * 5 - 2.5;
    this.speedY = Math.random() * -5 - 1;
    this.gravity = 0.1;
  }

  update() {
    this.speedY += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY;
    this.radius -= 0.05;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

let particles = [];

function createExplosion(x, y) {
  for (let i = 0; i < 15; i++) {
    particles.push(new Particle(x, y));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.radius > 0);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

canvas.addEventListener('click', (e) => {
  createExplosion(e.clientX, e.clientY);
});

animate();
