// تهيئة المشهد والكاميرا والمصير
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 7);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

// ==================== 1. الإضاءة الاستوديو ثلاثية الأبعاد ====================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

// ضوء أحمر يمثل هوية الموقع (#D91B3E)
const redPointLight = new THREE.PointLight(0xd91b3e, 2.5, 20);
redPointLight.position.set(4, 3, 4);
scene.add(redPointLight);

// ضوء أزرق سماوي ناعم موازٍ (#9DBDD8)
const bluePointLight = new THREE.PointLight(0x9dbdd8, 2, 20);
bluePointLight.position.set(-4, -2, 3);
scene.add(bluePointLight);

// ==================== 2. بناء مجسم الكتاب ثلاثي الأبعاد (3D Book) ====================
const bookGroup = new THREE.Group();

// أبعاد الكتاب: العرض 2.4، الارتفاع 3.4، السماكة 0.45
const width = 2.4;
const height = 3.4;
const depth = 0.45;

// تجهيز خامات غلاف الكتاب
const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin('anonymous');

// تحميل صورة الغلاف الحقيقية مع خامة احتياطية فورية
const coverUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgjU2opKiZwc73qF2ZhoyqJd3OkWTUOlLvOARWQeroe8Kj5SWnncIrxqzAOR0Ctpe4A7scBvTMg8hSUtsBQrD7Ln_hAZzAr7bzHEcFIiqj1rszzV-Elbo0KtkYyOeUhiaRKNyhWoh8qC7ltqQouEg5uheVTkEVU8ohIwmD2o9dwiwCdAWOU5-7T0NTX81bG/s1373/Asia.jpeg';

const frontTexture = textureLoader.load(coverUrl);
const spineTexture = new THREE.MeshStandardMaterial({ color: 0x111322, roughness: 0.3 });
const backTexture = new THREE.MeshStandardMaterial({ color: 0x0a0c18, roughness: 0.4 });
const pagesTexture = new THREE.MeshStandardMaterial({ color: 0xe6e4db, roughness: 0.8 }); // لون حواف الأوراق

// ترتيب أسطح الصندوق [Right, Left, Top, Bottom, Front, Back]
const bookMaterials = [
  pagesTexture,                                                  // حافة الورق اليمنى
  spineTexture,                                                  // كعب الكتاب (Spine)
  pagesTexture,                                                  // أعلى الأوراق
  pagesTexture,                                                  // أسفل الأوراق
  new THREE.MeshStandardMaterial({ map: frontTexture, roughness: 0.2, metalness: 0.1 }), // الغلاف الأمامي
  backTexture                                                    // الغلاف الخلفي
];

const bookGeometry = new THREE.BoxGeometry(width, height, depth);
const bookMesh = new THREE.Mesh(bookGeometry, bookMaterials);
bookMesh.castShadow = true;
bookGroup.add(bookMesh);

// موضع الكتاب المبدئي (يمين الشاشة ليتناسق مع الهيرو العربي)
bookGroup.position.set(window.innerWidth > 1024 ? 2.0 : 0, 0, 0);
bookGroup.rotation.set(0.15, -0.45, 0.05);
scene.add(bookGroup);

// ==================== 3. الجزيئات الفضائية المحيطة (Cosmic Particles) ====================
const particlesCount = 350;
const particleGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i += 3) {
  positions[i] = (Math.random() - 0.5) * 20;
  positions[i + 1] = (Math.random() - 0.5) * 20;
  positions[i + 2] = (Math.random() - 0.5) * 15;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMaterial = new THREE.PointsMaterial({
  size: 0.04,
  color: 0x9dbdd8,
  transparent: true,
  opacity: 0.7,
});
const particlesMesh = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particlesMesh);

// ==================== 4. التفاعل مع الفأرة والتمرير (Interactivity) ====================
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0.15;
let targetRotationY = -0.45;

window.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  
  targetRotationY = -0.45 + mouseX * 0.4;
  targetRotationX = 0.15 - mouseY * 0.3;
});

// دوران سينمائي للكتاب مع التمرير لأسفل الصفحة (Scroll-Driven 3D)
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = Math.min(scrollY / (maxScroll || 1), 1);

  // دوران الكتاب وتغير موضعه تدريجياً مع النزول
  bookGroup.rotation.z = 0.05 + progress * 1.5;
  bookGroup.position.y = progress * 1.2;
});

// استجابة الحجم التلقائي
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  if (window.innerWidth <= 1024) {
    bookGroup.position.x = 0;
  } else {
    bookGroup.position.x = 2.0;
  }
});

// ==================== 5. حلقة التحديث المستمر (Render Loop) ====================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  // تنعيم حركة الكتاب نحو زاوية الفأرة (Smooth Lerp)
  bookGroup.rotation.y += (targetRotationY - bookGroup.rotation.y) * 0.05;
  bookGroup.rotation.x += (targetRotationX - bookGroup.rotation.x) * 0.05;

  // طفوح ناعم للأعلى والأسفل (Floating Animation)
  bookGroup.position.y += Math.sin(elapsedTime * 1.8) * 0.0015;

  // دوران خفيف لشبكة النجوم
  particlesMesh.rotation.y = elapsedTime * 0.02;

  renderer.render(scene, camera);
}

animate();