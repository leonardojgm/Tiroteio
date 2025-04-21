let scene, camera, renderer, player, targets = [], bullets = [];

function init() {
  // Cena básica e câmera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Renderizador
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Cubo personagem
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  player = new THREE.Mesh(geometry, material);
  player.position.set(0, 0, 0);
  scene.add(player);

  // Alvos (favela simples com cubos)
  for (let i = 0; i < 5; i++) {
    const targetGeometry = new THREE.BoxGeometry();
    const targetMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    let target = new THREE.Mesh(targetGeometry, targetMaterial);
    target.position.set(Math.random() * 10 - 5, 0, Math.random() * 10 - 5);
    targets.push(target);
    scene.add(target);
  }

  // Configuração da câmera
  camera.position.z = 5;

  // Event listener para controlar movimento e disparos
  window.addEventListener('resize', onWindowResize);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  // Atualizar as posições dos alvos
  targets.forEach(target => {
    target.position.z += 0.01;
    if (target.position.z > 5) {
      target.position.z = -5;
      target.position.x = Math.random() * 10 - 5;
    }
  });

  // Atualizar posições dos tiros
  bullets.forEach((bullet, index) => {
    bullet.position.z -= 0.1;
    if (bullet.position.z < -5) {
      scene.remove(bullet);
      bullets.splice(index, 1);
    }
  });

  // Verificar colisão entre tiros e alvos
  bullets.forEach(bullet => {
    targets.forEach(target => {
      if (bullet.position.distanceTo(target.position) < 0.5) {
        scene.remove(target);
        scene.remove(bullet);
        targets = targets.filter(t => t !== target);
        bullets = bullets.filter(b => b !== bullet);
      }
    });
  });

  renderer.render(scene, camera);
}

function moveLeft() {
  player.position.x -= 0.5;
}

function moveRight() {
  player.position.x += 0.5;
}

function shoot() {
  const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
  const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  let bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
  bullet.position.set(player.position.x, player.position.y, player.position.z);
  scene.add(bullet);
  bullets.push(bullet);
}

// Redimensionar tela
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Iniciar o jogo
init();