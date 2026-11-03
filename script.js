const slides = Array.from(document.querySelectorAll('.slide-section'));
const navDots = Array.from(document.querySelectorAll('.nav-dot'));
let currentSlide = 0;
let audioEnabled = false;
let audioContext;

function goToSlide(index) {
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === currentSlide);
  });

  navDots.forEach((dot, dotIndex) => {
    dot.classList.toggle('bg-brandRed', dotIndex === currentSlide);
    dot.classList.toggle('text-white', dotIndex === currentSlide);
    dot.classList.toggle('font-bold', dotIndex === currentSlide);
    dot.classList.toggle('bg-white/10', dotIndex !== currentSlide);
    dot.classList.toggle('text-white/60', dotIndex !== currentSlide);
  });

  const indicator = document.getElementById('slide-num-indicator');
  if (indicator) {
    indicator.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  }

  if (audioEnabled) playHudTone();
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function prevSlide() {
  goToSlide(currentSlide - 1);
}

function playHudTone() {
  if (!audioContext || audioContext.state !== 'running') return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(660, now);
  gain.gain.setValueAtTime(0.025, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.12);
}

async function toggleAudioSimulation() {
  audioEnabled = !audioEnabled;

  if (audioEnabled) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioContext = audioContext || new AudioContextClass();
      if (audioContext.state === 'suspended') await audioContext.resume();
      playHudTone();
    } else {
      audioEnabled = false;
    }
  }

  document.querySelectorAll('#audio-icon, #audio-icon-mb').forEach(icon => {
    icon.classList.toggle('fa-volume-high', audioEnabled);
    icon.classList.toggle('fa-volume-xmark', !audioEnabled);
  });
  const label = document.getElementById('audio-text');
  if (label) label.textContent = audioEnabled ? 'ÂM THANH: BẬT' : 'ÂM THANH HUD';
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (error) {
    console.warn('Không thể chuyển chế độ toàn màn hình:', error);
  }
}

function closeModal() {
  document.getElementById('app-modal')?.remove();
}

function showModal(title, content) {
  closeModal();

  const overlay = document.createElement('div');
  overlay.id = 'app-modal';
  overlay.className = 'fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-4';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', title);
  overlay.innerHTML = `
    <div class="glass-panel relative w-full max-w-2xl rounded-2xl border border-brandGold/40 p-5 sm:p-7 shadow-2xl">
      <button type="button" class="absolute right-4 top-3 text-white/70 hover:text-white text-2xl" aria-label="Đóng">&times;</button>
      <h2 class="font-cinzel text-lg sm:text-2xl font-bold text-brandGold pr-8">${title}</h2>
      <div class="mt-4 text-sm sm:text-base leading-relaxed text-white/85">${content}</div>
    </div>`;

  overlay.querySelector('button').addEventListener('click', closeModal);
  overlay.addEventListener('click', event => {
    if (event.target === overlay) closeModal();
  });
  document.body.appendChild(overlay);
  overlay.querySelector('button').focus();
}

function openRegionDetail(regionKey) {
  const regions = {
    balkans: {
      title: 'Bán đảo Ban-căng · Bô-xni-a',
      period: '1992–1995',
      accent: 'gold',
      image: `<svg class="region-art" viewBox="0 0 800 320" role="img" aria-label="Minh họa bản đồ cách điệu vùng Ban-căng">
        <defs><linearGradient id="balkanSky" x2="0" y2="1"><stop stop-color="#29334d"/><stop offset="1" stop-color="#111522"/></linearGradient></defs>
        <rect width="800" height="320" rx="18" fill="url(#balkanSky)"/>
        <path d="M0 250 Q140 205 260 242 T510 224 T800 238 V320 H0Z" fill="#202b38"/>
        <path d="M210 30 295 48 330 93 306 126 340 158 310 190 270 183 248 220 207 196 188 151 158 120 178 81Z" fill="#e63946" fill-opacity=".42" stroke="#f4a261" stroke-width="3"/>
        <path d="M250 56 238 102 278 131 260 176M185 122 238 102M260 176 304 158" fill="none" stroke="#f4a261" stroke-opacity=".8" stroke-width="2" stroke-dasharray="6 7"/>
        <circle class="art-pulse" cx="251" cy="133" r="13" fill="#f4a261"/><circle cx="251" cy="133" r="4" fill="#fff"/>
        <text x="360" y="105" fill="#f4a261" font-size="17" font-family="monospace" letter-spacing="3">BALKANS · 1992—1995</text>
        <text x="360" y="145" fill="#fff" font-size="26" font-family="serif">Bô-xni-a và Héc-xê-gô-vi-na</text>
        <text x="360" y="180" fill="#cbd5e1" font-size="15" font-family="sans-serif">Bản đồ minh họa, không theo tỉ lệ</text>
        <path d="M375 240h265" stroke="#e63946" stroke-width="3" stroke-dasharray="8 9" class="art-dash"/>
        <circle cx="375" cy="240" r="7" fill="#f4a261"/><circle cx="640" cy="240" r="7" fill="#e63946"/>
        <text x="360" y="273" fill="#cbd5e1" font-size="13" font-family="monospace">TAN RÃ LIÊN BANG</text><text x="565" y="273" fill="#cbd5e1" font-size="13" font-family="monospace">HIỆP ĐỊNH DAYTON</text>
      </svg>`,
      intro: 'Sau khi Nam Tư tan rã, Bô-xni-a và Héc-xê-gô-vi-na tuyên bố độc lập. Các cộng đồng người Bô-xni-a, Xéc-bi và Crô-a-ti có những lựa chọn chính trị khác nhau; mâu thuẫn sắc tộc, tôn giáo và quyền kiểm soát lãnh thổ nhanh chóng biến thành chiến tranh.',
      points: [
        ['Bối cảnh', 'Sự tan rã của Liên bang Nam Tư làm dấy lên tranh chấp về độc lập, quyền lực và đường biên giới tại nhiều nước cộng hòa.'],
        ['Diễn biến và kết thúc', 'Chiến tranh Bô-xni-a kéo dài từ năm 1992 đến 1995. Hiệp định Dayton được ký năm 1995, chấm dứt giao tranh và thiết lập khuôn khổ hòa bình tại Bô-xni-a và Héc-xê-gô-vi-na.'],
        ['Hậu quả', 'Hàng chục nghìn người thiệt mạng, nhiều người phải rời bỏ nhà cửa; hạ tầng và đời sống cộng đồng bị tàn phá nghiêm trọng.'],
        ['Điều cần nhớ', 'Khi bản sắc cộng đồng bị khai thác để kích động thù hận, bất đồng chính trị có thể leo thang thành bạo lực. Đối thoại và bảo vệ dân thường là nền tảng cho hòa bình lâu dài.']
      ]
    },
    middleEast: {
      title: 'Trung Đông · I-xra-en và Pa-le-xtin',
      period: 'Xung đột kéo dài',
      accent: 'red',
      image: `<svg class="region-art" viewBox="0 0 800 320" role="img" aria-label="Minh họa cách điệu về Trung Đông và con đường đối thoại">
        <defs><linearGradient id="eastSky" x2="0" y2="1"><stop stop-color="#392b38"/><stop offset="1" stop-color="#151522"/></linearGradient></defs>
        <rect width="800" height="320" rx="18" fill="url(#eastSky)"/>
        <circle cx="130" cy="82" r="37" fill="#f4a261" fill-opacity=".8"/><circle cx="130" cy="82" r="56" fill="none" stroke="#f4a261" stroke-opacity=".35" class="art-pulse"/>
        <path d="M0 244 130 170 245 232 340 188 450 239 580 181 800 237V320H0Z" fill="#433446"/>
        <path d="M325 120q50-28 91 4t79 3q36-27 69 2" fill="none" stroke="#e63946" stroke-width="5" stroke-dasharray="7 9" class="art-dash"/>
        <path d="M356 100v76m112-67v82m104-82v76" stroke="#f4a261" stroke-width="2" stroke-opacity=".75"/>
        <circle cx="356" cy="138" r="9" fill="#fff"/><circle cx="468" cy="138" r="9" fill="#e63946"/><circle cx="572" cy="138" r="9" fill="#f4a261"/>
        <text x="320" y="215" fill="#fff" font-size="15" font-family="monospace">ĐỐI THOẠI</text><text x="430" y="215" fill="#fff" font-size="15" font-family="monospace">AN NINH</text><text x="545" y="215" fill="#fff" font-size="15" font-family="monospace">HÒA BÌNH</text>
        <text x="320" y="273" fill="#f4a261" font-size="17" font-family="monospace" letter-spacing="3">MIDDLE EAST · PEACE THROUGH DIALOGUE</text>
      </svg>`,
      intro: 'Quan hệ giữa I-xra-en và Pa-le-xtin gắn với những tranh chấp lâu dài về đất đai, quyền tự quyết, an ninh và địa vị của Giê-ru-sa-lem. Nhiều nỗ lực đàm phán đã được tiến hành, nhưng bất đồng cốt lõi và các đợt bạo lực khiến tiến trình hòa bình thường xuyên bị gián đoạn.',
      points: [
        ['Nguồn gốc bất đồng', 'Hai cộng đồng đều có mối liên hệ lịch sử và nguyện vọng chính trị tại vùng đất này. Tranh chấp lãnh thổ, người tị nạn, an ninh và Giê-ru-sa-lem là những vấn đề đặc biệt phức tạp.'],
        ['Nỗ lực hòa bình', 'Các cuộc đàm phán và thỏa thuận, trong đó có tiến trình Oslo từ thập niên 1990, tạo hy vọng về giải pháp chính trị nhưng chưa giải quyết được các vấn đề căn bản.'],
        ['Tác động', 'Các đợt xung đột gây thương vong, phá hủy nhà cửa và cơ sở hạ tầng; dân thường phải đối mặt với mất an toàn và khó khăn nhân đạo.'],
        ['Góc nhìn lịch sử', 'Cần nhìn nhận nhiều chiều, bảo vệ dân thường và ủng hộ giải pháp chính trị dựa trên luật pháp quốc tế, đối thoại và quyền sống trong hòa bình, an ninh.']
      ]
    },
    africa: {
      title: 'Châu Phi · Nội chiến và khủng hoảng nhân đạo',
      period: 'Nhiều quốc gia, nhiều giai đoạn',
      accent: 'gold',
      image: `<svg class="region-art" viewBox="0 0 800 320" role="img" aria-label="Minh họa bản đồ châu Phi và các tuyến hỗ trợ nhân đạo">
        <defs><linearGradient id="africaSky" x2="0" y2="1"><stop stop-color="#253b3d"/><stop offset="1" stop-color="#111923"/></linearGradient></defs>
        <rect width="800" height="320" rx="18" fill="url(#africaSky)"/>
        <path d="m225 34 53 16 29 41 38 20-13 42-30 21-7 53-36 47-27-25-12-61-25-39-18-53 23-39-5-33Z" fill="#f4a261" fill-opacity=".72" stroke="#ffe0b2" stroke-width="3"/>
        <path d="M227 113q35 20 74-1M243 161q35-18 66 5M248 200q27-12 53 5" fill="none" stroke="#e63946" stroke-width="3" stroke-dasharray="5 7" class="art-dash"/>
        <circle class="art-pulse" cx="275" cy="145" r="11" fill="#e63946"/><circle class="art-pulse delay" cx="269" cy="211" r="9" fill="#fff"/>
        <path d="M402 85h205M402 150h265M402 215h220" stroke="#ffffff" stroke-opacity=".2" stroke-width="1"/>
        <text x="402" y="70" fill="#f4a261" font-size="17" font-family="monospace" letter-spacing="3">AFRICA · HUMANITARIAN IMPACT</text>
        <text x="402" y="120" fill="#fff" font-size="23" font-family="serif">An ninh · Di cư · Lương thực</text>
        <text x="402" y="185" fill="#cbd5e1" font-size="16" font-family="sans-serif">Li-bi · Xô-ma-li · Xư-đăng</text>
        <text x="402" y="250" fill="#cbd5e1" font-size="15" font-family="sans-serif">Hỗ trợ nhân đạo và xây dựng hòa bình</text>
      </svg>`,
      intro: 'Sau Chiến tranh Lạnh, một số quốc gia châu Phi vẫn trải qua nội chiến hoặc bất ổn kéo dài. Không có một nguyên nhân chung cho mọi nơi: tình hình thường liên quan đến tranh giành quyền lực, quản trị yếu, bất bình đẳng, cạnh tranh tài nguyên và tác động của các yếu tố bên ngoài.',
      points: [
        ['Bối cảnh đa dạng', 'Li-bi, Xô-ma-li và Xư-đăng là những ví dụ thường được nhắc đến về bất ổn và xung đột trong các giai đoạn khác nhau. Mỗi quốc gia có lịch sử và nguyên nhân riêng.'],
        ['Vòng xoáy xung đột', 'Bạo lực làm suy yếu thể chế và kinh tế; khi nhu cầu cơ bản không được đáp ứng, bất ổn và cạnh tranh quyền lực có thể tiếp tục kéo dài.'],
        ['Hệ quả nhân đạo', 'Người dân có thể phải di tản, mất sinh kế và thiếu lương thực, y tế, giáo dục. Trẻ em và các nhóm dễ bị tổn thương chịu ảnh hưởng đặc biệt nặng nề.'],
        ['Hướng giải quyết', 'Cần kết hợp ngừng bắn, hòa giải trong nước, hỗ trợ nhân đạo, củng cố thể chế và hợp tác khu vực; giải pháp bền vững phải xuất phát từ nhu cầu của người dân địa phương.']
      ]
    }
  };

  const region = regions[regionKey];
  if (!region) return;

  const sections = region.points.map(([heading, text], index) => `
    <article class="detail-point" style="--point-delay:${index * 90}ms">
      <span class="detail-point-number">0${index + 1}</span>
      <div><h3>${heading}</h3><p>${text}</p></div>
    </article>`).join('');
  const content = `
    <div class="region-detail">
      <div class="detail-kicker"><span>${region.period}</span><span>HỒ SƠ LỊCH SỬ · SỬ 11</span></div>
      ${region.image}
      <p class="detail-intro">${region.intro}</p>
      <div class="detail-points">${sections}</div>
      <div class="detail-note"><i class="fa-solid fa-lightbulb"></i><span><strong>Gợi ý thảo luận:</strong> Vì sao hòa giải và bảo vệ dân thường cần được đặt ở trung tâm của mọi tiến trình chấm dứt xung đột?</span></div>
    </div>`;

  showModal(region.title, content);
  const panel = document.querySelector('#app-modal > div');
  panel.classList.remove('max-w-2xl', 'p-5', 'sm:p-7');
  panel.classList.add('max-w-5xl', 'max-h-[92vh]', 'overflow-y-auto', 'p-4', 'sm:p-7', 'region-detail-panel');
  panel.style.maxWidth = '64rem';
  panel.style.maxHeight = '92vh';
  panel.style.overflowY = 'auto';
}

function toggleAnswerModal() {
  if (document.getElementById('app-modal')) {
    closeModal();
    return;
  }
  showModal(
    'Vì sao xung đột vẫn tiếp diễn?',
    '<p>Nhiều mâu thuẫn lịch sử về sắc tộc, tôn giáo và lãnh thổ chưa được giải quyết. Bên cạnh đó, cạnh tranh quyền lực, lợi ích và sự can thiệp từ bên ngoài có thể làm bất ổn kéo dài.</p><p class="mt-3">Giải pháp bền vững cần tôn trọng luật pháp quốc tế, đối thoại và bảo vệ quyền lợi chính đáng của các cộng đồng.</p>'
  );
}

function togglePosterModal() {
  if (document.getElementById('app-modal')) {
    closeModal();
    return;
  }
  showModal(
    'Xung đột sau Chiến tranh Lạnh',
    '<div class="rounded-xl border border-brandGold/40 bg-brandDark p-5 text-center"><p class="font-mono text-xs tracking-widest text-brandGold">HÒA BÌNH • ĐỐI THOẠI • HỢP TÁC</p><p class="mt-4 font-cinzel text-xl sm:text-3xl font-bold text-white">GIẢI QUYẾT BẤT ĐỒNG<br><span class="text-brandRed">BẰNG CON ĐƯỜNG HÒA BÌNH</span></p><p class="mt-4 text-sm text-white/70">Tôn trọng luật pháp quốc tế và Hiến chương Liên Hợp Quốc. Chung tay ngăn ngừa xung đột, bảo vệ con người.</p></div>'
  );
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeModal();
    return;
  }
  if (document.getElementById('app-modal')) return;
  if (event.key === 'ArrowRight') nextSlide();
  if (event.key === 'ArrowLeft') prevSlide();
});

goToSlide(0);
