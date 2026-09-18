/* ===== script.js ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================
     1. NAVBAR SCROLL EFFECT
     ============================ */
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });


  /* ============================
     2. HAMBURGER MENU
     ============================ */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      // animate bars
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    // Close on nav link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }


  /* ============================
     3. SMOOTH SCROLL
     ============================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ============================
     4. ACTIVE NAV LINK ON SCROLL
     ============================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  const observerNav = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -30% 0px' });

  sections.forEach(s => observerNav.observe(s));


  /* ============================
     5. ACCORDION
     ============================ */
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const panelId  = btn.getAttribute('aria-controls');
      const panel    = document.getElementById(panelId);

      // Close siblings
      btn.closest('.accordion').querySelectorAll('.accordion-btn').forEach(b => {
        if (b !== btn) {
          b.setAttribute('aria-expanded', 'false');
          const pid = b.getAttribute('aria-controls');
          document.getElementById(pid)?.classList.remove('open');
        }
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      panel?.classList.toggle('open', !expanded);
    });
  });


  /* ============================
     6. PARALLAX BACKGROUND
     ============================ */
  const parallaxBg = document.querySelector('.parallax-bg');

  const handleParallax = () => {
    if (!parallaxBg) return;
    const section = parallaxBg.closest('section');
    const rect    = section.getBoundingClientRect();
    const speed   = 0.4;
    const offset  = rect.top * speed;
    parallaxBg.style.transform = `translateY(${offset}px)`;
  };
  window.addEventListener('scroll', handleParallax, { passive: true });


  /* ============================
     7. SCROLL ANIMATIONS
     ============================ */
  // Tag elements to animate
  const animatables = [
    '.intro-card',
    '.principle-card',
    '.identity-card',
    '.giaotrinh-card',
    '.timeline-item',
    '.student-card',
    '.quote-block',
    '.compare-block',
    '.giaotrinh-block',
    '.timeline-wrapper',
    '.student-intro',
    '.student-cta',
    '.minigame-links',
    '.quiz-preview',
    '.split-layout',
    '.nguyentac-heading',
    '.accordion-section',
  ];

  animatables.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.setAttribute('data-scroll', '');
      el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    });
  });

  const scrollObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-scroll]').forEach(el => scrollObserver.observe(el));


  /* ============================
     8. BACK TO TOP
     ============================ */
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (backToTop) {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }
  }, { passive: true });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ============================
     9. HERO BG IMAGE FALLBACK
     ============================ */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    const img = new Image();
    img.onload = () => {
      heroBg.style.backgroundImage = `url('hero_banner_bg.jpg')`;
    };
    img.src = 'hero_banner_bg.jpg';
  }


  /* ============================
     10. QR CODE CANVAS DRAW
     ============================ */
  function drawQR(canvasId, color1, color2) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    const size   = canvas.width;
    const cell   = 6;
    const cols   = Math.floor(size / cell);

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Pseudo-random QR pattern
    const seed = canvasId.charCodeAt(0) + canvasId.charCodeAt(1);
    const rand = (n) => Math.sin(n * seed * 9301 + 49297) * 233280 % 1 > 0;

    for (let y = 0; y < cols; y++) {
      for (let x = 0; x < cols; x++) {
        if (rand(y * cols + x)) {
          ctx.fillStyle = color1;
          ctx.fillRect(x * cell, y * cell, cell - 1, cell - 1);
        }
      }
    }

    // Finder squares (corners)
    const drawFinder = (ox, oy) => {
      ctx.fillStyle = color1;
      ctx.fillRect(ox, oy, 7*cell, 7*cell);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(ox+cell, oy+cell, 5*cell, 5*cell);
      ctx.fillStyle = color1;
      ctx.fillRect(ox+2*cell, oy+2*cell, 3*cell, 3*cell);
    };
    drawFinder(0, 0);
    drawFinder(size - 7*cell, 0);
    drawFinder(0, size - 7*cell);

    // Center dot
    ctx.fillStyle = color2;
    ctx.beginPath();
    ctx.arc(size/2, size/2, cell, 0, Math.PI * 2);
    ctx.fill();
  }

  drawQR('qr-kahoot',  '#46178F', '#FF3B55');
  drawQR('qr-quizizz', '#D32F2F', '#FF7043');


  /* ============================
     11. QUIZ SCORE TRACKING
     ============================ */
  window._quizAnswers = {};

  // Init
  const totalQuestions = 10;
  const scoreDisplay   = document.getElementById('result-score-display');
  const messageEl      = document.getElementById('result-message');
  const starsEl        = document.getElementById('result-stars');
  const submitBtn      = document.getElementById('btn-submit-quiz');
  const resetBtn       = document.getElementById('btn-reset-quiz');

  // Update score display while user answers
  const updateScorePreview = () => {
    const answered = Object.keys(window._quizAnswers).length;
    if (scoreDisplay && answered > 0 && !window._quizSubmitted) {
      scoreDisplay.textContent = `${answered}/${totalQuestions} câu`;
    }
  };

}); // END DOMContentLoaded


/* ============================
   12. ANSWER CHECKING (global)
   ============================ */
window._quizSubmitted = false;

function checkAnswer(btn, questionId, correct) {
  if (window._quizSubmitted) return;

  const questionEl  = document.getElementById(questionId);
  const feedbackEl  = document.getElementById(`feedback-${questionId}`);
  const selected    = questionEl.querySelector(`input[name="${questionId}"]:checked`);

  if (!selected) {
    feedbackEl.textContent = '⚠️ Bạn chưa chọn đáp án!';
    feedbackEl.className   = 'answer-feedback wrong';
    return;
  }

  const userAnswer = selected.value;
  const isCorrect  = (userAnswer === correct);

  // Store answer
  window._quizAnswers[questionId] = isCorrect;

  // Disable all options & button in this question
  questionEl.querySelectorAll('input[type="radio"]').forEach(inp => inp.disabled = true);
  btn.disabled = true;

  // Highlight options
  questionEl.querySelectorAll('.option').forEach(opt => {
    const val = opt.querySelector('input').value;
    if (val === correct) opt.classList.add('correct');
    else if (val === userAnswer && !isCorrect) opt.classList.add('wrong');
  });

  // Feedback message
  const explanations = {
    q1:  'Đúng! Ba lực lượng: giai cấp vô sản quốc tế, phong trào giải phóng dân tộc, và lực lượng yêu chuộng hòa bình.',
    q2:  'Đúng! "Thực lực" là nội lực, là nền tảng. Ngoại giao chỉ có hiệu quả khi dựa trên nội lực mạnh.',
    q3:  'Đúng! Tư tưởng này xuất hiện từ 1920 (Đại hội Tours) và nhất quán đến cuối đời Bác — đây là chiến lược, không phải sách lược.',
    q4:  'Đúng! Từ nước cần được giúp đỡ → nước đóng góp cho hòa bình thế giới: đây là hiện thực hóa tư tưởng đoàn kết có trách nhiệm.',
    q5:  'Đúng! Bản Yêu sách 8 điểm của nhân dân An Nam (1919) — bước đi đầu tiên của Nguyễn Ái Quốc đưa Việt Nam ra thế giới.',
    q6:  'Đúng! "Hòa nhập nhưng không hòa tan" = tham gia quốc tế một cách chủ động, sáng tạo nhưng giữ vững bản sắc dân tộc.',
    q7:  'Đúng! Việt Nam gia nhập WTO ngày 11/1/2007 — cột mốc hội nhập kinh tế quốc tế sâu rộng nhất lúc bấy giờ.',
    q8:  'Đúng! Hồ Chí Minh không sao chép mà sáng tạo: đưa phong trào GPDT thành bộ phận của cách mạng thế giới.',
    q9:  'Đúng! "Dĩ bất biến, ứng vạn biến" — độc lập, chủ quyền là bất biến, không thể đánh đổi dù với bất kỳ lợi ích vật chất nào.',
    q10: 'Đúng! "Hòa nhập nhưng không hòa tan" — tự tin, ôn hòa bảo vệ lập trường đúng đắn; lắng nghe nhưng không bị cuốn vào sức ép bên ngoài.',
  };

  if (isCorrect) {
    feedbackEl.className   = 'answer-feedback correct';
    feedbackEl.textContent = `✅ ${explanations[questionId] || 'Chính xác! Bạn đã hiểu đúng tư tưởng Hồ Chí Minh.'}`;
  } else {
    feedbackEl.className   = 'answer-feedback wrong';
    feedbackEl.textContent = `❌ Chưa chính xác. Đáp án đúng là ${correct}. ${explanations[questionId] || ''}`;
  }

  // Mark question item
  document.getElementById(questionId).style.borderColor = isCorrect
    ? 'rgba(39,174,96,0.4)'
    : 'rgba(231,76,60,0.4)';
}


function submitQuiz() {
  const answered = Object.keys(window._quizAnswers).length;
  const totalQ   = 10;

  if (answered < totalQ) {
    const missing = totalQ - answered;
    const msgEl   = document.getElementById('result-message');
    if (msgEl) {
      msgEl.textContent = `⚠️ Bạn còn ${missing} câu chưa trả lời! Hãy hoàn thành tất cả câu hỏi.`;
      msgEl.style.color = '#F5C842';
    }
    // Scroll to first unanswered
    for (let i = 1; i <= totalQ; i++) {
      const qEl = document.getElementById(`q${i}`);
      if (qEl && !window._quizAnswers[`q${i}`]) {
        qEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        qEl.style.animation = 'pulse 0.5s ease 3';
        break;
      }
    }
    return;
  }

  window._quizSubmitted = true;

  const score   = Object.values(window._quizAnswers).filter(Boolean).length;
  const scoreEl = document.getElementById('result-score-display');
  const msgEl   = document.getElementById('result-message');
  const starsEl = document.getElementById('result-stars');
  const submitBtn = document.getElementById('btn-submit-quiz');
  const resetBtn  = document.getElementById('btn-reset-quiz');

  if (scoreEl) scoreEl.textContent = `${score} / ${totalQ}`;

  // Stars
  let stars = '';
  if (score >= 9)      stars = '⭐⭐⭐⭐⭐';
  else if (score >= 7) stars = '⭐⭐⭐⭐';
  else if (score >= 5) stars = '⭐⭐⭐';
  else if (score >= 3) stars = '⭐⭐';
  else                 stars = '⭐';
  if (starsEl) starsEl.textContent = stars;

  // Message
  let msg = '';
  if (score === 10)    msg = '🏆 Xuất sắc! Bạn đã hiểu sâu sắc tư tưởng Hồ Chí Minh về đoàn kết quốc tế!';
  else if (score >= 8) msg = '🥇 Rất tốt! Bạn nắm vững kiến thức cốt lõi của chương này!';
  else if (score >= 6) msg = '🥈 Khá tốt! Hãy ôn lại một số nội dung và thử lại!';
  else if (score >= 4) msg = '🥉 Cần cố gắng thêm. Hãy đọc lại phần lý luận và thực tiễn.';
  else                 msg = '📚 Hãy xem lại toàn bộ nội dung và thử lại nhé!';

  if (msgEl) { msgEl.textContent = msg; msgEl.style.color = ''; }

  // Disable submit, show reset
  if (submitBtn) submitBtn.style.display = 'none';
  if (resetBtn)  resetBtn.style.display  = 'inline-flex';

  // Disable all remaining inputs
  document.querySelectorAll('.question-item input[type="radio"]').forEach(inp => inp.disabled = true);
  document.querySelectorAll('.btn-check').forEach(btn => btn.disabled = true);

  // Scroll to result
  document.getElementById('quiz-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


function resetQuiz() {
  window._quizSubmitted = false;
  window._quizAnswers   = {};

  // Re-enable inputs & buttons
  document.querySelectorAll('.question-item input[type="radio"]').forEach(inp => {
    inp.disabled = false;
    inp.checked  = false;
  });
  document.querySelectorAll('.btn-check').forEach(btn => btn.disabled = false);

  // Remove highlights
  document.querySelectorAll('.option').forEach(opt => {
    opt.classList.remove('correct', 'wrong');
  });

  // Clear feedback
  document.querySelectorAll('.answer-feedback').forEach(el => {
    el.className   = 'answer-feedback';
    el.textContent = '';
  });

  // Reset question borders
  for (let i = 1; i <= 10; i++) {
    const qEl = document.getElementById(`q${i}`);
    if (qEl) qEl.style.borderColor = '';
  }

  // Reset result display
  const scoreEl   = document.getElementById('result-score-display');
  const msgEl     = document.getElementById('result-message');
  const starsEl   = document.getElementById('result-stars');
  const submitBtn = document.getElementById('btn-submit-quiz');
  const resetBtn  = document.getElementById('btn-reset-quiz');

  if (scoreEl)   scoreEl.textContent = '—';
  if (msgEl)     { msgEl.textContent = 'Hãy trả lời tất cả câu hỏi để xem kết quả!'; msgEl.style.color = ''; }
  if (starsEl)   starsEl.textContent = '';
  if (submitBtn) submitBtn.style.display = '';
  if (resetBtn)  resetBtn.style.display  = 'none';

  // Scroll to top of quiz
  document.querySelector('.questions-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
