const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('[data-next]');
const photoCards = document.querySelectorAll('.photo-card');
const revealButtons = document.querySelectorAll('.heart-reveal');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modalMessage');
const closeModal = document.getElementById('closeModal');
const modalOk = document.getElementById('modalOk');
const musicaFundo = document.getElementById('musicaFundo');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const musicText = document.getElementById('musicText');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
let musicaIniciada = false;

function atualizarBotaoMusica() {
  if (!musicaFundo || !musicToggle) return;

  if (musicaFundo.paused) {
    musicIcon.textContent = '♪';
    musicText.textContent = 'tocar';
    musicToggle.classList.remove('playing');
  } else {
    musicIcon.textContent = '♫';
    musicText.textContent = 'tocando';
    musicToggle.classList.add('playing');
  }
}

function tocarMusica() {
  if (!musicaFundo || musicaIniciada) return;

  musicaFundo.volume = 0.45;
  musicaFundo.play()
    .then(() => {
      musicaIniciada = true;
      atualizarBotaoMusica();
    })
    .catch(() => atualizarBotaoMusica());
}

function atualizarProgresso(page) {
  const total = pages.length;
  const step = Number(page.dataset.step || 1);
  if (progressBar) progressBar.style.width = `${(step / total) * 100}%`;
  if (progressText) progressText.textContent = `${step} de ${total}`;
}

function showPage(id) {
  tocarMusica();
  let activePage = null;

  pages.forEach(page => {
    const active = page.id === id;
    page.classList.toggle('active', active);
    if (active) activePage = page;
  });

  if (activePage) atualizarProgresso(activePage);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function mostrarMensagem(message) {
  modalMessage.textContent = message;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}

function hideModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}

if (musicToggle) {
  musicToggle.addEventListener('click', () => {
    if (!musicaFundo) return;

    if (musicaFundo.paused) {
      musicaFundo.volume = 0.45;
      musicaFundo.play()
        .then(() => {
          musicaIniciada = true;
          atualizarBotaoMusica();
        })
        .catch(() => atualizarBotaoMusica());
    } else {
      musicaFundo.pause();
      atualizarBotaoMusica();
    }
  });
}

navButtons.forEach(button => {
  button.addEventListener('click', () => showPage(button.dataset.next));
});

photoCards.forEach(card => {
  card.addEventListener('click', () => mostrarMensagem(card.dataset.message));
});

revealButtons.forEach(button => {
  button.addEventListener('click', () => mostrarMensagem(button.dataset.message));
});

if (closeModal) closeModal.addEventListener('click', hideModal);
if (modalOk) modalOk.addEventListener('click', hideModal);
if (modal) {
  modal.addEventListener('click', event => {
    if (event.target === modal) hideModal();
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') hideModal();
});

atualizarBotaoMusica();
atualizarProgresso(document.querySelector('.page.active'));

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const proposalActions = document.getElementById('proposalActions');
const yesMessage = document.getElementById('yesMessage');

function criarCoracao() {
  const heart = document.createElement('span');
  const simbolos = ['❤️', '💖', '💗', '💕', '💘', '💞'];
  heart.className = 'floating-heart';
  heart.textContent = simbolos[Math.floor(Math.random() * simbolos.length)];
  heart.style.setProperty('--x', `${Math.random() * 94 + 3}vw`);
  heart.style.setProperty('--size', `${Math.random() * 20 + 22}px`);
  heart.style.setProperty('--duration', `${Math.random() * 1.8 + 3.2}s`);
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 5600);
}

function chuvaDeCoracoes(quantidade = 45) {
  for (let i = 0; i < quantidade; i++) {
    setTimeout(criarCoracao, i * 70);
  }
}

function moverBotaoNao() {
  if (!noBtn || !proposalActions) return;

  noBtn.classList.add('runaway');
  const area = proposalActions.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();
  const maxX = Math.max(0, area.width - btn.width - 8);
  const maxY = Math.max(0, area.height - btn.height - 8);
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

if (yesBtn) {
  yesBtn.addEventListener('click', () => {
    tocarMusica();
    chuvaDeCoracoes(65);
    if (yesMessage) {
      yesMessage.textContent = 'Eu sabia que o botão certo era esse. Te amo infinitamente! 💍❤️';
    }
    if (noBtn) {
      noBtn.style.opacity = '0';
      noBtn.style.pointerEvents = 'none';
    }
    setTimeout(() => showPage('final'), 4300);
  });
}

if (noBtn) {
  ['mouseenter', 'mouseover', 'touchstart', 'pointerdown', 'focus'].forEach(eventName => {
    noBtn.addEventListener(eventName, event => {
      event.preventDefault();
      moverBotaoNao();
    });
  });

  noBtn.addEventListener('click', event => {
    event.preventDefault();
    moverBotaoNao();
  });
}
