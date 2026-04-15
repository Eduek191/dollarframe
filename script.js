/* ============================================================
   AUREX — Shared JavaScript
   script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // LUCIDE ICONS
  // ============================================================
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ============================================================
  // NAVBAR — scroll effect + hamburger
  // ============================================================
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-menu .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ============================================================
  // SCROLL ANIMATIONS — IntersectionObserver
  // ============================================================
  const fadeEls = document.querySelectorAll('.fade-up, .fade-in');
  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  }

  // ============================================================
  // NUMBER COUNTER ANIMATION
  // ============================================================
  function animateCounter(el, target, prefix, suffix, decimals) {
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;
    const increment = target / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      const formatted = decimals > 0
        ? current.toFixed(decimals)
        : Math.floor(current).toLocaleString();
      el.textContent = prefix + formatted + suffix;
    }, stepTime);
  }

  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.counter);
          const prefix = el.dataset.prefix || '';
          const suffix = el.dataset.suffix || '';
          const decimals = parseInt(el.dataset.decimals || '0');
          animateCounter(el, target, prefix, suffix, decimals);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  // ============================================================
  // ROI CALCULATOR (plans.html)
  // ============================================================
  const calcForm = document.getElementById('roi-calculator');
  if (calcForm) {
    const amountInput = document.getElementById('calc-amount');
    const durationInput = document.getElementById('calc-duration');
    const durationDisplay = document.getElementById('duration-display');
    const planSelect = document.getElementById('calc-plan');
    const resultReturn = document.getElementById('result-return');
    const resultTotal = document.getElementById('result-total');
    const resultMonthly = document.getElementById('result-monthly');

    const planRates = {
      starter: 0.08,
      growth: 0.105,
      premium: 0.13,
      institutional: 0.155
    };

    function calculateROI() {
      const amount = parseFloat(amountInput.value) || 0;
      const months = parseInt(durationInput.value) || 12;
      const plan = planSelect.value;
      const annualRate = planRates[plan] || 0.08;
      const monthlyRate = annualRate / 12;

      if (durationDisplay) {
        durationDisplay.textContent = months + ' month' + (months !== 1 ? 's' : '');
      }

      const totalReturn = amount * monthlyRate * months;
      const totalValue = amount + totalReturn;
      const monthlyIncome = amount * monthlyRate;

      if (resultReturn) {
        resultReturn.textContent = '$' + totalReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
      if (resultTotal) {
        resultTotal.textContent = '$' + totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
      if (resultMonthly) {
        resultMonthly.textContent = '$' + monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    }

    [amountInput, durationInput, planSelect].forEach(el => {
      if (el) el.addEventListener('input', calculateROI);
    });

    // Initial calculation
    calculateROI();
  }

  // ============================================================
  // FAQ ACCORDION (plans.html)
  // ============================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        faqItems.forEach(i => i.classList.remove('open'));
        // Toggle current
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  // ============================================================
  // CONTACT FORM VALIDATION (contact.html)
  // ============================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const fields = contactForm.querySelectorAll('[data-required]');
      fields.forEach(field => {
        const parent = field.closest('.form-field');
        if (!field.value.trim()) {
          if (parent) parent.classList.add('error');
          valid = false;
        } else {
          if (parent) parent.classList.remove('error');
        }
      });

      const emailField = contactForm.querySelector('#form-email');
      if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailParent = emailField.closest('.form-field');
        if (!emailRegex.test(emailField.value)) {
          if (emailParent) emailParent.classList.add('error');
          const errorEl = emailParent ? emailParent.querySelector('.form-error') : null;
          if (errorEl) errorEl.textContent = 'Please enter a valid email address.';
          valid = false;
        }
      }

      if (valid) {
        const successMsg = document.getElementById('form-success');
        if (successMsg) successMsg.classList.add('show');
        contactForm.reset();
        setTimeout(() => {
          if (successMsg) successMsg.classList.remove('show');
        }, 5000);
      }
    });

    // Live validation
    contactForm.querySelectorAll('[data-required]').forEach(field => {
      field.addEventListener('blur', () => {
        const parent = field.closest('.form-field');
        if (!field.value.trim()) {
          if (parent) parent.classList.add('error');
        } else {
          if (parent) parent.classList.remove('error');
        }
      });
    });
  }

  // ============================================================
  // SVG LINE CHART — Returns chart (dashboard.html)
  // ============================================================
  const lineChartSvg = document.getElementById('returns-svg');
  if (lineChartSvg) {
    drawLineChart(lineChartSvg);
  }

  function drawLineChart(svg) {
    const W = svg.clientWidth || 480;
    const H = 180;
    const pad = { top: 20, right: 20, bottom: 30, left: 50 };

    // Monthly data (cumulative portfolio value over 12 months)
    const data = [
      12500, 12608, 12718, 12890, 13012, 13145,
      13280, 13400, 13542, 13689, 13850, 14023
    ];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const minV = 12200;
    const maxV = 14200;

    function xPos(i) {
      return pad.left + (i / (data.length - 1)) * (W - pad.left - pad.right);
    }
    function yPos(v) {
      return pad.top + (1 - (v - minV) / (maxV - minV)) * (H - pad.top - pad.bottom);
    }

    // Build path
    let pathD = '';
    let areaD = '';
    data.forEach((v, i) => {
      const x = xPos(i);
      const y = yPos(v);
      if (i === 0) {
        pathD += `M ${x} ${y}`;
        areaD += `M ${x} ${H - pad.bottom} L ${x} ${y}`;
      } else {
        const cx = xPos(i - 0.5);
        pathD += ` C ${cx} ${yPos(data[i-1])}, ${cx} ${y}, ${x} ${y}`;
        areaD += ` C ${cx} ${yPos(data[i-1])}, ${cx} ${y}, ${x} ${y}`;
      }
    });
    areaD += ` L ${xPos(data.length - 1)} ${H - pad.bottom} Z`;

    // Grid lines
    let gridHTML = '';
    const gridCount = 4;
    for (let i = 0; i <= gridCount; i++) {
      const y = pad.top + (i / gridCount) * (H - pad.top - pad.bottom);
      const val = maxV - (i / gridCount) * (maxV - minV);
      gridHTML += `<line x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}" stroke="rgba(201,168,76,0.08)" stroke-width="1"/>`;
      gridHTML += `<text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" fill="#5c5a57" font-size="10" font-family="DM Sans, sans-serif">$${(val/1000).toFixed(1)}k</text>`;
    }

    // Month labels
    let labelsHTML = '';
    months.forEach((m, i) => {
      if (i % 2 === 0) {
        labelsHTML += `<text x="${xPos(i)}" y="${H - 8}" text-anchor="middle" fill="#5c5a57" font-size="10" font-family="DM Sans, sans-serif">${m}</text>`;
      }
    });

    // Dots
    let dotsHTML = '';
    data.forEach((v, i) => {
      dotsHTML += `<circle cx="${xPos(i)}" cy="${yPos(v)}" r="3" fill="var(--color-gold)" opacity="0.6"/>`;
    });
    // Highlight last
    dotsHTML += `<circle cx="${xPos(data.length-1)}" cy="${yPos(data[data.length-1])}" r="5" fill="var(--color-gold)" stroke="rgba(201,168,76,0.3)" stroke-width="4"/>`;

    svg.innerHTML = `
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#c9a84c" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#c9a84c" stop-opacity="0"/>
        </linearGradient>
      </defs>
      ${gridHTML}
      <path d="${areaD}" fill="url(#areaGrad)"/>
      <path d="${pathD}" fill="none" stroke="#c9a84c" stroke-width="2" stroke-linecap="round"/>
      ${labelsHTML}
      ${dotsHTML}
    `;
  }

  // Redraw on resize
  window.addEventListener('resize', () => {
    const svg = document.getElementById('returns-svg');
    if (svg) drawLineChart(svg);
  });

  // ============================================================
  // PLAN CARDS — "Choose Plan" button scroll to calculator
  // ============================================================
  document.querySelectorAll('[data-plan-select]').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.planSelect;
      const planSelect = document.getElementById('calc-plan');
      if (planSelect) {
        planSelect.value = plan;
        planSelect.dispatchEvent(new Event('input'));
        const calcSection = document.getElementById('calculator');
        if (calcSection) {
          calcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ============================================================
  // RANGE INPUT — track fill
  // ============================================================
  document.querySelectorAll('input[type="range"]').forEach(range => {
    function updateFill() {
      const min = parseFloat(range.min) || 0;
      const max = parseFloat(range.max) || 100;
      const val = parseFloat(range.value) || 0;
      const pct = ((val - min) / (max - min)) * 100;
      range.style.background = `linear-gradient(to right, var(--color-gold) 0%, var(--color-gold) ${pct}%, var(--color-surface-2) ${pct}%, var(--color-surface-2) 100%)`;
    }
    range.addEventListener('input', updateFill);
    updateFill();
  });

});
