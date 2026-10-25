// 1. الاتصال المباشر مع خادم Node.js عبر Socket.io
try {
  const socket = io();
  socket.on('visitorsUpdate', (count) => {
    const visitorEl = document.getElementById('visitor-count');
    if (visitorEl) visitorEl.textContent = count;
  });
} catch (e) {
  console.log('وضع العمل بدون اتصال Socket نشط حالياً.');
}

// 2. تحديث التاريخ والساعة المباشرة
function updateClock() {
  const now = new Date();
  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

  document.getElementById('live-day').textContent = days[now.getDay()];
  document.getElementById('live-date').textContent = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  document.getElementById('clock-hours').textContent = String(now.getHours()).padStart(2, '0');
  document.getElementById('clock-minutes').textContent = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('clock-seconds').textContent = String(now.getSeconds()).padStart(2, '0');
}
setInterval(updateClock, 1000);
updateClock();

// 3. شريط نسبة القراءة العلوي
window.addEventListener('scroll', () => {
  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = (winScroll / height) * 100;
  document.getElementById('reading-progress').style.width = progress + '%';
});

// 4. التحكم بنوافذ المودال
function openMapModal() {
  const m = document.getElementById('map-modal');
  m.classList.remove('hidden');
  m.classList.add('flex');
}

function closeMapModal() {
  const m = document.getElementById('map-modal');
  m.classList.add('hidden');
  m.classList.remove('flex');
}