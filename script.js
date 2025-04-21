let scene, camera, renderer, player, targets = [], bullets = [];

function init() {
  // Cena básica e câmera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);

  // Renderizador
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Cubo personagem substituído por cilindro
  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  player = new THREE.Mesh(geometry, material);
  player.position.set(0, 1, 0);
  scene.add(player);

  // Alvos agora são esferas
  for (let i = 0; i < 5; i++) {
    const targetGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const targetMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    let target = new THREE.Mesh(targetGeometry, targetMaterial);
    target.position.set(Math.random() * 10 - 5, 0.5, Math.random() * 10 - 5);
    targets.push(target);
    scene.add(target);
  }

  // Configuração da câmera
  camera.position.set(10, 10, 10);  // Posição melhorada
  camera.lookAt(0, 0, 0);  // Foco no centro da cena

  // Event listener para redimensionamento da tela
  window.addEventListener('resize', onWindowResize);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  // Atualizar a posição dos alvos (movimentação simples)
  targets.forEach(target => {
    target.position.z += 0.05;
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

function moveForward() {
  player.position.z -= 0.5;
}

function moveBackward() {
  player.position.z += 0.5;
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