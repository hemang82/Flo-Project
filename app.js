// TrackFlow Landing Page Interactions

document.addEventListener('DOMContentLoaded', () => {
  initScreenSwitcher();
  initCycleSimulator();
  initFAQ();
  initMobileMenu();
  initScrollAnimations();
  initMockNotifications();
  initSymptomLogger();
  initPaywallTeaser();
});

/* ==========================================
   iPhone Mockup Screen Switcher & Sliding Carousel
   ========================================== */
function initScreenSwitcher() {
  const carousel = document.getElementById('phone-carousel');
  const sliderPill = document.getElementById('segmented-slider');
  const promoButtons = document.querySelectorAll('.segmented-btn');
  const inAppButtons = document.querySelectorAll('[data-switch-to]');

  const screenIndices = {
    home: 0,
    calendar: 1,
    tracker: 2,
    articles: 3
  };

  function switchToScreen(screenName) {
    const index = screenIndices[screenName];
    if (index === undefined || !carousel) return;

    // 1. Slide the iPhone screen container
    carousel.style.transform = `translateX(-${index * 25}%)`;

    // 2. Update the outer segmented control pill position
    const activePromoBtn = document.querySelector(`.segmented-btn[data-switch-to="${screenName}"]`);
    if (activePromoBtn && sliderPill) {
      sliderPill.style.width = `${activePromoBtn.offsetWidth}px`;
      // offsetLeft of button minus container padding (4px)
      sliderPill.style.transform = `translateX(${activePromoBtn.offsetLeft - 4}px)`;

      // Toggle active color class on buttons
      promoButtons.forEach(btn => {
        if (btn === activePromoBtn) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // 3. Update the bottom navigation bar active states inside the mockup
    const bottomTabs = document.querySelectorAll('#phone-nav-bar [data-switch-to]');
    bottomTabs.forEach(tab => {
      const isTargetTab = tab.getAttribute('data-switch-to') === screenName;
      const icon = tab.querySelector('i');
      const text = tab.querySelector('span');

      if (isTargetTab) {
        if (icon) {
          icon.classList.remove('text-brand-gray');
          icon.classList.add('text-brand-pink');
          // Add fill color if applicable
          if (icon.hasAttribute('data-lucide') && icon.getAttribute('data-lucide') === 'book-open') {
            icon.classList.add('fill-brand-pink/20');
          }
        }
        if (text) {
          text.classList.remove('text-brand-gray');
          text.classList.add('text-brand-pink');
        }
      } else {
        if (icon) {
          icon.classList.add('text-brand-gray');
          icon.classList.remove('text-brand-pink');
          icon.classList.remove('fill-brand-pink/20');
        }
        if (text) {
          text.classList.add('text-brand-gray');
          text.classList.remove('text-brand-pink');
        }
      }
    });
  }

  // Bind Promo Buttons (outer Segmented Control)
  promoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-switch-to');
      switchToScreen(target);
    });
  });

  // Bind In-App Action Elements
  inAppButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-switch-to');
      switchToScreen(target);
    });
  });

  // Run initialization on resize to make sure offset calculation is accurate
  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.segmented-btn.active');
    if (currentActive) {
      const target = currentActive.getAttribute('data-switch-to');
      switchToScreen(target);
    }
  });

  // Initial setup trigger (Home Screen)
  setTimeout(() => {
    switchToScreen('home');
  }, 100);
}

/* ==========================================
   Interactive Cycle Phase Simulator
   ========================================== */
const PHASES = [
  {
    id: 1,
    name: 'Menstrual Phase',
    days: 'Days 1 - 5',
    estrogen: 'Low',
    progesterone: 'Low',
    desc: 'The beginning of your cycle. Estrogen and progesterone are at their baseline, and your body sheds the uterine lining. Focus on rest, warm nourishing foods, and gentle movement like stretching or walking.',
    tips: {
      food: 'Warm broths, herbal teas, iron-rich foods (spinach, lentils)',
      energy: 'Low - focus on deep rest and restorative sleep',
      workout: 'Gentle walking, light stretching, restorative yoga'
    },
    color: '#FF85A2', // Matches primary brand color
    dashoffset: 283 * 0.85,
    rotation: 324
  },
  {
    id: 2,
    name: 'Follicular Phase',
    days: 'Days 6 - 12',
    estrogen: 'Rising',
    progesterone: 'Low',
    desc: 'Your body prepares for ovulation. Follicle-stimulating hormone (FSH) prompts ovaries to mature eggs. Rising estrogen levels boost your mood, confidence, brainpower, and physical energy.',
    tips: {
      food: 'Fermented foods (kimchi, kefir), fresh vegetables, lean proteins',
      energy: 'Rising - perfect time to plan projects and start new routines',
      workout: 'Strength training, steady-state running, hiking'
    },
    color: '#FF8C69',
    dashoffset: 283 * 0.6,
    rotation: 54
  },
  {
    id: 3,
    name: 'Ovulatory Phase',
    days: 'Days 13 - 15',
    estrogen: 'Peak',
    progesterone: 'Low',
    desc: 'A surge in Luteinizing Hormone (LH) triggers the release of the egg. This is your peak fertility window. Estrogen is at its maximum, making you feel high energy, highly social, and confident.',
    tips: {
      food: 'Fresh berries, hydrating fruits, light steamed veggies, fiber-rich seeds',
      energy: 'Peak - maximum stamina, confidence, and social energy',
      workout: 'HIIT, high-intensity workouts, power yoga, dancing'
    },
    color: '#FF4D6D',
    dashoffset: 283 * 0.45,
    rotation: 108
  },
  {
    id: 4,
    name: 'Luteal Phase',
    days: 'Days 16 - 28',
    estrogen: 'Moderate',
    progesterone: 'High',
    desc: 'Progesterone rises to support a potential pregnancy, winding down your energy. If fertilisation doesn\'t occur, hormone levels drop. You might feel a nesting instinct, increased appetite, and need for self-care.',
    tips: {
      food: 'Healthy fats (avocado, nuts), root vegetables, dark chocolate',
      energy: 'Declining - time to finish tasks, organize, and slow down',
      workout: 'Pilates, Vinyasa yoga, swimming, moderate walking'
    },
    color: '#C05E8C',
    dashoffset: 283 * 0.1,
    rotation: 234
  }
];

function initCycleSimulator() {
  const dialTextPhase = document.getElementById('dial-phase');
  const dialTextDays = document.getElementById('dial-days');
  const dialTextHormones = document.getElementById('dial-hormones');
  
  const simTitle = document.getElementById('sim-title');
  const simDays = document.getElementById('sim-days');
  const simDesc = document.getElementById('sim-desc');
  const simFood = document.getElementById('sim-food');
  const simEnergy = document.getElementById('sim-energy');
  const simWorkout = document.getElementById('sim-workout');
  
  const slider = document.getElementById('sim-slider');
  const phaseButtons = document.querySelectorAll('[data-phase-id]');
  
  const dialCircle = document.getElementById('dial-circle');
  const dialPointer = document.getElementById('dial-pointer');
  
  function updateSimulator(phaseIndex) {
    const phase = PHASES[phaseIndex];
    if (!phase) return;

    // Update Text details
    dialTextPhase.textContent = phase.name.split(' ')[0];
    dialTextDays.textContent = phase.days;
    dialTextHormones.textContent = `Estrogen: ${phase.estrogen} | Progesterone: ${phase.progesterone}`;
    
    simTitle.textContent = phase.name;
    simDays.textContent = phase.days;
    simDesc.textContent = phase.desc;
    
    simFood.textContent = phase.tips.food;
    simEnergy.textContent = phase.tips.energy;
    simWorkout.textContent = phase.tips.workout;

    // Update Dial UI
    if (dialCircle) {
      dialCircle.style.strokeDashoffset = phase.dashoffset;
      dialCircle.style.stroke = phase.color;
    }
    if (dialPointer) {
      dialPointer.style.transform = `rotate(${phase.rotation}deg)`;
      const dot = dialPointer.querySelector('div');
      if (dot) {
        dot.style.borderColor = phase.color;
      }
    }

    // Update Slider value
    if (slider) {
      slider.value = phase.id;
    }

    // Update Phase buttons
    phaseButtons.forEach(btn => {
      const id = parseInt(btn.getAttribute('data-phase-id'));
      if (id === phase.id) {
        btn.style.backgroundColor = phase.color;
        btn.style.borderColor = phase.color;
        btn.classList.add('text-white', 'scale-105');
        btn.classList.remove('bg-white', 'text-brand-dark');
      } else {
        btn.style.backgroundColor = '';
        btn.style.borderColor = '';
        btn.classList.remove('text-white', 'scale-105');
        btn.classList.add('bg-white', 'text-brand-dark');
      }
    });
  }

  // Bind Slider change
  if (slider) {
    slider.addEventListener('input', (e) => {
      const phaseId = parseInt(e.target.value);
      updateSimulator(phaseId - 1);
    });
  }

  // Bind Buttons click
  phaseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const phaseId = parseInt(btn.getAttribute('data-phase-id'));
      updateSimulator(phaseId - 1);
    });
  });

  // Initialize with Menstrual Phase (Index 0)
  updateSimulator(0);
}

/* ==========================================
   FAQ Accordions
   ========================================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other FAQs
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-content').style.maxHeight = '0px';
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
      });

      // Toggle current FAQ
      if (isOpen) {
        item.classList.remove('active');
        content.style.maxHeight = '0px';
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* ==========================================
   Responsive Mobile Menu
   ========================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');

    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      menuIconOpen.classList.add('hidden');
      menuIconClose.classList.remove('hidden');
      setTimeout(() => {
        mobileMenu.classList.remove('opacity-0', '-translate-y-4');
      }, 50);
    } else {
      mobileMenu.classList.add('opacity-0', '-translate-y-4');
      menuIconOpen.classList.remove('hidden');
      menuIconClose.classList.add('hidden');
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
      }, 300);
    }
  });

  // Close menu on link click
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('opacity-0', '-translate-y-4', 'hidden');
      menuIconOpen.classList.remove('hidden');
      menuIconClose.classList.add('hidden');
    });
  });
}

/* ==========================================
   Intersection Observer for Scroll Entries
   ========================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
      el.classList.add('transition-all', 'duration-700', 'ease-out', 'opacity-0', 'translate-y-10');
      observer.observe(el);
    });
  } else {
    animatedElements.forEach(el => {
      el.classList.remove('opacity-0', 'translate-y-10');
    });
  }
}

/* ==========================================
   NEW SIMULATOR INTERACTIVE ENHANCEMENTS
   ========================================== */

// 1. Smart Reminders / Push Notifications Loop (cycles every 9 seconds: 4.5s visible, 4.5s hidden)
function initMockNotifications() {
  const notif = document.getElementById('phone-notification');
  const notifIcon = document.getElementById('notif-icon');
  const notifTitle = document.getElementById('notif-title');
  const notifBody = document.getElementById('notif-body');
  if (!notif) return;

  const alerts = [
    {
      icon: 'droplets',
      colorClass: 'text-blue-500',
      bgClass: 'bg-blue-500/10',
      title: 'Hydration Check 💧',
      body: 'Log your water intake to keep cramps away during Menstruation.'
    },
    {
      icon: 'sparkles',
      colorClass: 'text-brand-pink',
      bgClass: 'bg-brand-pink/10',
      title: 'Cycle Update 🌸',
      body: 'Your menstrual phase starts in 2 days. Get prepped!'
    },
    {
      icon: 'pill',
      colorClass: 'text-purple-500',
      bgClass: 'bg-purple-500/10',
      title: 'Daily Reminder 💊',
      body: 'Time to take your contraceptive/vitamin supplement.'
    },
    {
      icon: 'smile',
      colorClass: 'text-emerald-500',
      bgClass: 'bg-emerald-500/10',
      title: 'Self-Care Check-In 🧘‍♀️',
      body: 'How are you feeling today? Tap to log your symptoms.'
    }
  ];

  let currentIndex = 0;

  function triggerNotification() {
    const alert = alerts[currentIndex];
    
    // Update text content
    if (notifTitle) notifTitle.textContent = alert.title;
    if (notifBody) notifBody.textContent = alert.body;

    // Update container classes
    if (notifIcon) {
      const iconParent = notifIcon.parentElement;
      if (iconParent) {
        iconParent.className = `w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${alert.bgClass} ${alert.colorClass}`;
      }
      notifIcon.setAttribute('data-lucide', alert.icon);
    }
    
    // Re-create icons dynamically
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Slide down notification banner
    notif.classList.remove('-translate-y-32', 'opacity-0');
    notif.classList.add('translate-y-0', 'opacity-100');

    // Slide up/hide after 4.5 seconds
    setTimeout(() => {
      notif.classList.remove('translate-y-0', 'opacity-100');
      notif.classList.add('-translate-y-32', 'opacity-0');
    }, 4500);

    // Increment index
    currentIndex = (currentIndex + 1) % alerts.length;
  }

  // Trigger the first notification after 3 seconds, then repeat every 9 seconds
  setTimeout(() => {
    triggerNotification();
    setInterval(triggerNotification, 9000);
  }, 3000);
}

// 2. Interactive Symptom Logger Modal (Screen 2: Calendar)
function initSymptomLogger() {
  const addLogBtn = document.getElementById('add-log-btn');
  const closeLoggerBtn = document.getElementById('close-logger-btn');
  const loggerModal = document.getElementById('logger-modal');
  const saveLoggerBtn = document.getElementById('save-logger-btn');
  const resetLoggerBtn = document.getElementById('reset-logger-btn');
  const symptomBtns = document.querySelectorAll('.symptom-btn');
  const moodBtns = document.querySelectorAll('.mood-btn');
  const flowTags = document.querySelectorAll('.symptom-tag');
  const calendarDay19Log = document.getElementById('calendar-day-19-log');
  const logStatusText = document.getElementById('log-status-text');
  const logSubText = document.getElementById('log-sub-text');

  if (!addLogBtn || !loggerModal) return;

  let selectedFlow = 'medium';
  let selectedSymptoms = [];
  let selectedMoods = [];

  // Slide up sheet
  addLogBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loggerModal.classList.remove('translate-y-full');
  });

  // Close sheet
  function closeLogger() {
    loggerModal.classList.add('translate-y-full');
  }
  if (closeLoggerBtn) {
    closeLoggerBtn.addEventListener('click', closeLogger);
  }

  // Flow Tag selection
  flowTags.forEach(tag => {
    tag.addEventListener('click', () => {
      flowTags.forEach(t => {
        t.className = "symptom-tag text-[9px] py-1.5 border border-gray-100 rounded-xl font-bold bg-white text-brand-dark hover:border-brand-pink/30 hover:bg-brand-pink/5 transition-all";
      });
      tag.className = "symptom-tag text-[9px] py-1.5 border border-[#FF5E8C] rounded-xl font-bold bg-[#FF5E8C] text-white transition-all";
      selectedFlow = tag.getAttribute('data-value');
    });
  });

  // Symptoms selection toggle
  symptomBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const symptom = btn.getAttribute('data-symptom');
      const idx = selectedSymptoms.indexOf(symptom);
      if (idx > -1) {
        selectedSymptoms.splice(idx, 1);
        btn.className = "symptom-btn flex items-center justify-center gap-1 text-[9px] py-1.5 border border-gray-100 rounded-xl font-bold bg-white text-brand-dark hover:border-brand-pink/30 transition-all";
      } else {
        selectedSymptoms.push(symptom);
        btn.className = "symptom-btn flex items-center justify-center gap-1 text-[9px] py-1.5 border border-[#FF5E8C] rounded-xl font-bold bg-[#FF5E8C]/10 text-[#FF5E8C] transition-all";
      }
    });
  });

  // Mood selection toggle
  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.getAttribute('data-mood');
      const idx = selectedMoods.indexOf(mood);
      if (idx > -1) {
        selectedMoods.splice(idx, 1);
        btn.className = "mood-btn flex items-center justify-center gap-1 text-[9px] py-1.5 border border-gray-100 rounded-xl font-bold bg-white text-brand-dark hover:border-brand-pink/30 transition-all";
      } else {
        selectedMoods.push(mood);
        btn.className = "mood-btn flex items-center justify-center gap-1 text-[9px] py-1.5 border border-[#FF5E8C] rounded-xl font-bold bg-[#FF5E8C]/10 text-[#FF5E8C] transition-all";
      }
    });
  });

  // Reset logger values
  if (resetLoggerBtn) {
    resetLoggerBtn.addEventListener('click', () => {
      selectedFlow = 'medium';
      selectedSymptoms = [];
      selectedMoods = [];
      
      flowTags.forEach(t => {
        if (t.getAttribute('data-value') === 'medium') {
          t.className = "symptom-tag text-[9px] py-1.5 border border-[#FF5E8C] rounded-xl font-bold bg-[#FF5E8C] text-white transition-all";
        } else {
          t.className = "symptom-tag text-[9px] py-1.5 border border-gray-100 rounded-xl font-bold bg-white text-brand-dark hover:border-brand-pink/30 hover:bg-brand-pink/5 transition-all";
        }
      });

      symptomBtns.forEach(btn => {
        btn.className = "symptom-btn flex items-center justify-center gap-1 text-[9px] py-1.5 border border-gray-100 rounded-xl font-bold bg-white text-brand-dark hover:border-brand-pink/30 transition-all";
      });

      moodBtns.forEach(btn => {
        btn.className = "mood-btn flex items-center justify-center gap-1 text-[9px] py-1.5 border border-gray-100 rounded-xl font-bold bg-white text-brand-dark hover:border-brand-pink/30 transition-all";
      });
    });
  }

  // Save logger status & display changes
  if (saveLoggerBtn) {
    saveLoggerBtn.addEventListener('click', () => {
      closeLogger();

      // Replace droplet icon inside August 19 calendar day cell with a high-fidelity logged indicators state
      if (calendarDay19Log) {
        calendarDay19Log.innerHTML = `
          <div class="flex items-center justify-center gap-0.5 mt-0.5 animate-pulse">
            <span class="w-1.5 h-1.5 rounded-full bg-white shadow-sm"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-sm"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-[#FAF8F9] shadow-sm"></span>
          </div>
        `;
      }

      // Update text in dashboard card details
      if (logStatusText) {
        logStatusText.textContent = "Saved Successfully";
        logStatusText.className = "text-[11px] font-extrabold text-emerald-500 font-heading";
      }

      if (logSubText) {
        let textSummary = `Flow: ${selectedFlow.charAt(0).toUpperCase() + selectedFlow.slice(1)}`;
        const combined = selectedSymptoms.concat(selectedMoods);
        if (combined.length > 0) {
          textSummary += ` (${combined.slice(0, 2).join(', ')})`;
        }
        logSubText.textContent = textSummary;
        logSubText.className = "text-[9px] text-brand-gray/90 font-bold mt-0.5";
      }

      // Turn Add Log button into green "Logged!" feedback state
      addLogBtn.textContent = "Logged!";
      addLogBtn.className = "w-full mt-3 py-2.5 bg-emerald-500 text-white rounded-full font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all text-center pointer-events-none";

      // Show simulator success toast
      showSimulatorToast("Daily logs updated successfully! 🎉");
    });
  }
}

// 3. Premium Paywall / Teaser Mode (Screen 3: Articles)
function initPaywallTeaser() {
  const premiumArticles = document.querySelectorAll('.premium-article');
  const paywallModal = document.getElementById('paywall-modal');
  const closePaywallBtn = document.getElementById('close-paywall-btn');

  if (!paywallModal || premiumArticles.length === 0) return;

  premiumArticles.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      // Slide up paywall sheet
      paywallModal.classList.remove('translate-y-full');
    });
  });

  if (closePaywallBtn) {
    closePaywallBtn.addEventListener('click', () => {
      // Hide paywall sheet
      paywallModal.classList.add('translate-y-full');
    });
  }
}

// Helper to show inline Toast alerts in the simulator
function showSimulatorToast(message) {
  const phoneViewport = document.querySelector('.phone-viewport');
  if (!phoneViewport) return;

  // Remove existing toast if any
  const oldToast = phoneViewport.querySelector('.simulator-toast');
  if (oldToast) oldToast.remove();

  const toast = document.createElement('div');
  toast.className = "simulator-toast absolute bottom-18 inset-x-6 z-50 bg-[#1A1819]/95 text-white text-[10px] font-bold py-2 px-4 rounded-full shadow-xl text-center backdrop-blur-sm transition-all duration-300 opacity-0 transform translate-y-2 border border-white/10";
  toast.textContent = message;
  
  phoneViewport.appendChild(toast);
  
  // Animate slide up & fade-in
  setTimeout(() => {
    toast.classList.remove('opacity-0', 'translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');
  }, 50);

  // Fade-out and delete after 3 seconds
  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}
