/**
 * UniQ Fisioterapia e Pilates - Script Principal (script.js)
 * Interatividade moderna e acessível em JavaScript Vanilla (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initServiceTabs();
  initBookingAssistant();
  initScrollSpy();
  initImageFallbacks();
});

/* ==========================================================================
   Header Dinâmico ao Rolar
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   Menu Mobile Acessível (Drawer)
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const links = document.querySelectorAll('.mobile-drawer .nav-link');

  if (!toggleBtn || !drawer) return;

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      drawer.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  };

  toggleBtn.addEventListener('click', () => {
    const isCurrentlyOpen = drawer.classList.contains('open');
    toggleMenu(!isCurrentlyOpen);
  });

  // Fechar ao clicar em qualquer link
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(true);
    });
  });

  // Fechar com tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleMenu(true);
      toggleBtn.focus();
    }
  });
}

/* ==========================================================================
   Smooth Scroll com Offset para Header Fixo
   ========================================================================== */
function initSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Atualizar URL sem recarregar
        history.pushState(null, '', targetId);
      }
    });
  });
}

/* ==========================================================================
   Filtro de Abas dos Serviços
   ========================================================================== */
function initServiceTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  if (!tabButtons.length || !serviceCards.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter') || 'all';

      // Atualizar estado ativo dos botões
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filtrar cards com animação suave
      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   Assistente Interativo de Agendamento (WhatsApp Link Generator)
   ========================================================================== */
function initBookingAssistant() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('userName');
    const serviceSelect = document.getElementById('userService');
    const shiftSelect = document.getElementById('userShift');

    const name = nameInput ? nameInput.value.trim() : '';
    const service = serviceSelect ? serviceSelect.value : 'Pilates';
    const shift = shiftSelect ? shiftSelect.value : 'Manhã';

    let messageText = `Olá! Gostaria de agendar uma aula na UniQ Fisioterapia e Pilates.\n`;
    if (name) {
      messageText += `*Meu Nome:* ${name}\n`;
    }
    messageText += `*Interesse:* ${service}\n`;
    messageText += `*Turno de Preferência:* ${shift}\n`;
    messageText += `Podem me informar os horários disponíveis para 2026? Obrigado(a)!`;

    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/5555999386663?text=${encodedMessage}`;

    // Abrir o WhatsApp
    window.location.href = whatsappUrl;
  });
}

/* ==========================================================================
   ScrollSpy para Navegação Ativa
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   Política de Imagens Resilientes (Zero-Broken-Image Policy)
   ========================================================================== */
function initImageFallbacks() {
  const images = document.querySelectorAll('img');

  images.forEach(img => {
    img.addEventListener('error', () => {
      // Cria um elegante fallback com a paleta da UniQ
      const altText = img.getAttribute('alt') || 'UniQ Fisioterapia e Pilates';
      const parent = img.parentElement;
      if (parent) {
        const fallback = document.createElement('div');
        fallback.className = 'img-fallback-wrapper';
        fallback.innerHTML = `
          <div class="img-fallback-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </div>
          <strong style="font-family: var(--font-heading); font-size: 1rem; color: var(--color-dark); margin-bottom: 0.25rem;">UniQ Fisioterapia e Pilates</strong>
          <span style="font-size: 0.85rem; color: var(--color-text-muted);">${altText}</span>
        `;
        img.style.display = 'none';
        parent.appendChild(fallback);
      }
    });
  });
}
