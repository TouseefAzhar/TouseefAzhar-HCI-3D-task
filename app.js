import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.set(0, 40, 90);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const loader = new THREE.TextureLoader();


const sunLight = new THREE.PointLight(0xffffff, 2, 2000);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);


function createStars() {
  const starGeo = new THREE.BufferGeometry();
  const starVertices = [];

  for (let i = 0; i < 15000; i++) {
    starVertices.push(
      (Math.random() - 0.5) * 2000,
      (Math.random() - 0.5) * 2000,
      (Math.random() - 0.5) * 2000
    );
  }

  starGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
  );

  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1
  });

  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);
}

createStars();


const sunGeo = new THREE.SphereGeometry(8, 64, 64);
const sunMat = new THREE.MeshBasicMaterial({
  map: loader.load("textures/sun.jpg")
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);


const planets = [];

const orbitalSpeeds = {
  mercury: 0.04,
  venus: 0.015,
  earth: 0.01,
  mars: 0.008,
  jupiter: 0.002,
  saturn: 0.0015,
  uranus: 0.001,
  neptune: 0.0008
};

const distances = {
  mercury: 12,
  venus: 16,
  earth: 22,
  mars: 28,
  jupiter: 40,
  saturn: 55,
  uranus: 70,
  neptune: 85
};


function createOrbitLine(distance) {
  const orbitGeo = new THREE.RingGeometry(distance - 0.08, distance + 0.08, 128);

  const orbitMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  });

  const orbit = new THREE.Mesh(orbitGeo, orbitMat);
  orbit.rotation.x = Math.PI / 2;
  scene.add(orbit);
}


function createPlanet(size, texture, distance, speed, rotationSpeed) {
  const geo = new THREE.SphereGeometry(size, 32, 32);
  const mat = new THREE.MeshStandardMaterial({
    map: loader.load(texture)
  });

  const mesh = new THREE.Mesh(geo, mat);

  const orbit = new THREE.Object3D();
  scene.add(orbit);
  orbit.add(mesh);

  const angle = Math.random() * Math.PI * 2;
  mesh.position.x = distance * Math.cos(angle);
  mesh.position.z = distance * Math.sin(angle);

  createOrbitLine(distance);

  planets.push({
    mesh,
    orbit,
    speed,
    rotationSpeed
  });
}


createPlanet(1, "textures/mercury.jpg", distances.mercury, orbitalSpeeds.mercury, 0.004);
createPlanet(1.5, "textures/venus.jpg", distances.venus, orbitalSpeeds.venus, 0.002);
createPlanet(1.6, "textures/earth.jpg", distances.earth, orbitalSpeeds.earth, 0.02);
createPlanet(1.2, "textures/mars.jpg", distances.mars, orbitalSpeeds.mars, 0.018);
createPlanet(4, "textures/jupiter.jpg", distances.jupiter, orbitalSpeeds.jupiter, 0.04);
createPlanet(3.5, "textures/saturn.jpg", distances.saturn, orbitalSpeeds.saturn, 0.038);
createPlanet(2.5, "textures/uranus.jpg", distances.uranus, orbitalSpeeds.uranus, 0.03);
createPlanet(2.4, "textures/neptune.jpg", distances.neptune, orbitalSpeeds.neptune, 0.032);


const ringGeo = new THREE.RingGeometry(4.5, 6, 64);
const ringMat = new THREE.MeshBasicMaterial({
  map: loader.load("textures/saturn_ring.png"),
  side: THREE.DoubleSide,
  transparent: true
});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI / 2;
planets[5].mesh.add(ring);


let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});


function animate() {
  requestAnimationFrame(animate);

  sun.rotation.y += 0.002;

  planets.forEach(p => {
    p.orbit.rotation.y += p.speed;
    p.mesh.rotation.y += p.rotationSpeed;
  });

  camera.position.x += (mouseX * 20 - camera.position.x) * 0.01;
  camera.position.y += (-mouseY * 10 + 40 - camera.position.y) * 0.01;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

animate();


window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});