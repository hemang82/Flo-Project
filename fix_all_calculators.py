import re

flatpickr_css_link = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">'

theme_css = '''
  <style>
    /* ===== DATE INPUT FIELD ===== */
    .flatpickr-input {
        color: #1A1819 !important;
        font-weight: 600;
        font-family: 'Plus Jakarta Sans', sans-serif;
        caret-color: #FF5E8C;
        background: #FFF0F2 !important;
        border: 2px solid #FF5E8C !important;
        border-radius: 14px;
        padding: 16px 20px 16px 48px !important;
        font-size: 16px !important;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(255, 94, 140, 0.08);
    }
    .flatpickr-input:focus {
        box-shadow: 0 0 0 4px rgba(255, 94, 140, 0.2) !important;
        border-color: #FF5E8C !important;
        outline: none !important;
    }
    .flatpickr-input::placeholder {
        color: #FF5E8C;
        opacity: 0.7;
        font-weight: 500;
    }

    /* ===== CALENDAR POPUP ===== */
    .flatpickr-calendar {
      font-family: 'Plus Jakarta Sans', sans-serif !important;
      border-radius: 20px !important;
      box-shadow: 0 20px 60px -15px rgba(255, 94, 140, 0.25), 0 10px 20px -10px rgba(0,0,0,0.08) !important;
      border: 2px solid #FF5E8C !important;
      padding: 12px !important;
      width: 320px !important;
      background: #fff !important;
    }
    .flatpickr-calendar.open {
      animation: fadeInScale 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes fadeInScale {
      from { opacity: 0; transform: scale(0.92) translateY(-8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .flatpickr-months {
      padding: 4px 0 10px !important;
      align-items: center;
    }
    .flatpickr-month {
      color: #1A1819 !important;
      fill: #FF5E8C !important;
      height: 40px !important;
    }
    .flatpickr-current-month {
      font-size: 16px !important;
      font-weight: 800 !important;
      color: #1A1819 !important;
      padding-top: 4px !important;
    }
    .flatpickr-current-month .flatpickr-monthDropdown-months {
      font-weight: 800 !important;
      font-size: 16px !important;
      color: #1A1819 !important;
    }
    .flatpickr-current-month input.cur-year {
      font-weight: 800 !important;
      font-size: 16px !important;
      color: #1A1819 !important;
    }
    .flatpickr-months .flatpickr-prev-month,
    .flatpickr-months .flatpickr-next-month {
      fill: #FF5E8C !important;
      color: #FF5E8C !important;
      padding: 6px !important;
      border-radius: 10px;
    }
    .flatpickr-months .flatpickr-prev-month:hover,
    .flatpickr-months .flatpickr-next-month:hover {
      background: #FFF0F2 !important;
    }
    .flatpickr-weekdays {
      padding: 4px 0 !important;
    }
    .flatpickr-weekday {
      color: #FF5E8C !important;
      font-weight: 800 !important;
      font-size: 12px !important;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .flatpickr-day {
      border-radius: 12px !important;
      font-weight: 600 !important;
      font-size: 14px !important;
      height: 38px !important;
      line-height: 38px !important;
      max-width: 38px !important;
      color: #1A1819 !important;
      margin: 1px !important;
      transition: all 0.15s ease !important;
    }
    .flatpickr-day:hover {
      background: #FFF0F2 !important;
      border-color: #FF5E8C !important;
      color: #FF5E8C !important;
    }
    .flatpickr-day.today {
      border-color: #FF5E8C !important;
      background: #FFF0F2 !important;
      color: #FF5E8C !important;
      font-weight: 800 !important;
    }
    .flatpickr-day.selected,
    .flatpickr-day.selected:hover,
    .flatpickr-day.selected:focus {
      background: #FF5E8C !important;
      border-color: #FF5E8C !important;
      color: #fff !important;
      box-shadow: 0 4px 14px rgba(255, 94, 140, 0.4) !important;
    }
    .flatpickr-day.flatpickr-disabled,
    .flatpickr-day.flatpickr-disabled:hover,
    .flatpickr-day.prevMonthDay,
    .flatpickr-day.nextMonthDay {
      color: #ddd !important;
    }

    /* Modal Animation */
    #result-modal.show { display: flex !important; }
    #result-modal.show #modal-backdrop { animation: fadeIn 0.3s ease; }
    #result-modal.show #modal-card { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
  </style>
'''

# 1. Update Ovulation Calculator
with open('ovulation-calculator.html', 'r', encoding='utf-8') as f:
    ovul_content = f.read()

# Make sure CSS link is present
if 'flatpickr.min.css' not in ovul_content:
    ovul_content = ovul_content.replace('</head>', f'{flatpickr_css_link}\n</head>')

# Replace style block
ovul_content = re.sub(r'<style>.*?</style>', theme_css, ovul_content, flags=re.DOTALL)

# Wrap input with icon
old_ovul_input = r'<div class="relative">\s*<input type="text" id="calc-last-period"[^>]*>\s*</div>'
new_ovul_input = '''<div class="relative flex items-center">
                <i data-lucide="calendar" class="w-5 h-5 text-[#FF5E8C] absolute left-4 pointer-events-none z-10"></i>
                <input type="text" id="calc-last-period" placeholder="Select date..." class="flatpickr-input w-full cursor-pointer" readonly>
              </div>'''
ovul_content = re.sub(old_ovul_input, new_ovul_input, ovul_content)

with open('ovulation-calculator.html', 'w', encoding='utf-8') as f:
    f.write(ovul_content)

print("Updated ovulation-calculator.html successfully!")

# 2. Update Due Date Calculator
with open('due-date-calculator.html', 'r', encoding='utf-8') as f:
    due_content = f.read()

if 'flatpickr.min.css' not in due_content:
    due_content = due_content.replace('</head>', f'{flatpickr_css_link}\n</head>')

due_content = re.sub(r'<style>.*?</style>', theme_css, due_content, flags=re.DOTALL)

# Wrap due date input with icon
old_due_input = r'<div class="relative">\s*<input type="text" id="calc-due-date-last-period"[^>]*>\s*</div>'
new_due_input = '''<div class="relative flex items-center">
                    <i data-lucide="calendar" class="w-5 h-5 text-[#FF5E8C] absolute left-4 pointer-events-none z-10"></i>
                    <input type="text" id="calc-due-date-last-period" placeholder="Select date..." class="flatpickr-input w-full cursor-pointer" readonly>
                </div>'''
due_content = re.sub(old_due_input, new_due_input, due_content)

# Add Modal to Due Date page if not present
due_modal_html = '''
  <!-- ===== RESULTS MODAL ===== -->
  <div id="result-modal" class="hidden fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div id="modal-backdrop" onclick="closeModal()" class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
    <div id="modal-card" class="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div class="bg-gradient-to-br from-[#FF5E8C] to-[#FF8C69] p-8 text-white text-center relative overflow-hidden">
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
        <div class="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full"></div>
        <div class="relative z-10">
          <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i data-lucide="baby" class="w-8 h-8"></i>
          </div>
          <h3 class="text-2xl font-extrabold font-heading">Pregnancy Due Date</h3>
          <p class="text-white/80 text-sm mt-1">Based on Naegele's Rule (280 days)</p>
        </div>
      </div>
      <div class="p-8 space-y-6">
        <div class="text-center p-6 bg-[#FFF0F2] rounded-2xl border border-[#FF5E8C]/15">
          <p class="text-[10px] font-extrabold text-[#FF5E8C] uppercase tracking-[3px] mb-2">Estimated Due Date (EDD)</p>
          <p id="result-due-date" class="text-3xl font-extrabold text-brand-dark font-heading">...</p>
        </div>
        <a href="index.html#download" class="block w-full py-4 bg-gradient-to-r from-[#FF5E8C] to-[#FF8C69] text-white rounded-xl font-bold text-center shadow-lg shadow-[#FF5E8C]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <i data-lucide="smartphone" class="w-4 h-4 inline mr-2"></i>
          Track Pregnancy in Our Free App
        </a>
        <button onclick="closeModal()" class="block w-full py-3 text-brand-gray font-semibold text-sm hover:text-brand-dark transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>
'''

if 'id="result-modal"' not in due_content:
    due_content = due_content.replace('</main>', f'{due_modal_html}\n</main>')

# Update calculateDueDate JS function to trigger modal
old_due_js = r'function calculateDueDate\(\) \{.*?\n    \}'
new_due_js = '''function calculateDueDate() {
        const lastPeriod = document.getElementById('calc-due-date-last-period').value;
        if (!lastPeriod) return;
        
        const periodDate = new Date(lastPeriod);
        const dueDate = new Date(periodDate);
        dueDate.setDate(periodDate.getDate() + 280);
        
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('result-due-date').textContent = dueDate.toLocaleDateString('en-US', options);
        
        const modal = document.getElementById('result-modal');
        modal.classList.remove('hidden');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
    }

    function closeModal() {
        const modal = document.getElementById('result-modal');
        modal.classList.add('hidden');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }'''

due_content = re.sub(old_due_js, new_due_js, due_content, flags=re.DOTALL)

with open('due-date-calculator.html', 'w', encoding='utf-8') as f:
    f.write(due_content)

print("Updated due-date-calculator.html successfully!")
