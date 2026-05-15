/* Broadway Beer Wine & Spirits — Som Corporate Intake (embedded)
   Renders inline above the service blocks on corporate.html.
   Gathers brief, collects contact info, fires to Formspree → Chris & Jason.
   ──────────────────────────────────────────────────────────────────────────── */

const CORP_ENABLED = true;

// ── Branch question sets ──────────────────────────────────────
const CORP_STEPS = {

  gifting: [
    {
      key: 'gifttype',
      question: 'What kind of gift are you looking for?',
      choices: [
        { label: 'A bottle or bottles',             value: 'bottle'   },
        { label: 'Gift boxes with wine & food',     value: 'giftbox'  },
        { label: 'Both — a mix of options',         value: 'both'     },
        { label: 'Not sure yet, help me decide',    value: 'unsure'   },
      ]
    },
    {
      key: 'quantity',
      question: 'How many people are you gifting?',
      choices: [
        { label: 'Just one special bottle',  value: 'one'    },
        { label: 'A small group (2–10)',      value: 'small'  },
        { label: 'A larger team (11–50)',     value: 'medium' },
        { label: 'Company-wide (50+)',        value: 'large'  },
      ]
    },
    {
      key: 'occasion',
      question: "What's the occasion?",
      choices: [
        { label: 'Client appreciation', value: 'client'  },
        { label: 'Staff recognition',   value: 'staff'   },
        { label: 'Holiday gifting',     value: 'holiday' },
        { label: 'Special occasion',    value: 'special' },
      ]
    },
    {
      key: 'budget',
      question: 'Budget per bottle?',
      choices: [
        { label: 'Under $50',     value: 'under50'  },
        { label: '$50 to $100',   value: '50-100'   },
        { label: '$100 to $200',  value: '100-200'  },
        { label: 'Open budget',   value: 'open'     },
      ]
    },
    {
      key: 'timeline',
      question: 'When do you need it?',
      choices: [
        { label: 'This week',           value: 'urgent'   },
        { label: 'Within the month',    value: 'month'    },
        { label: '1 to 2 months out',   value: 'later'    },
        { label: 'Just planning ahead', value: 'planning' },
      ]
    },
  ],

  cellar: [
    {
      key: 'start',
      question: 'Where are you starting from?',
      choices: [
        { label: 'Building from scratch',    value: 'scratch' },
        { label: 'Refining what I have',     value: 'refine'  },
        { label: 'Setting up an office bar', value: 'office'  },
        { label: 'One significant purchase', value: 'single'  },
      ]
    },
    {
      key: 'focus',
      question: 'Primary focus?',
      choices: [
        { label: 'Wine',    value: 'wine'    },
        { label: 'Spirits', value: 'spirits' },
        { label: 'Both',    value: 'both'    },
      ]
    },
    {
      key: 'budget',
      question: 'Budget range?',
      choices: [
        { label: 'Under $2,000',      value: 'under2k' },
        { label: '$2,000 to $10,000', value: '2k-10k'  },
        { label: '$10,000+',          value: '10k+'    },
        { label: "Let's talk first",  value: 'tbd'     },
      ]
    },
  ],

  event: [
    {
      key: 'type',
      question: 'What kind of event?',
      choices: [
        { label: 'Corporate dinner',    value: 'dinner'      },
        { label: 'Office party',        value: 'party'       },
        { label: 'Client event',        value: 'client'      },
        { label: 'Private celebration', value: 'celebration' },
      ]
    },
    {
      key: 'guests',
      question: 'How many guests?',
      choices: [
        { label: 'Under 25',  value: 'small'  },
        { label: '25 to 75',  value: 'medium' },
        { label: '75 to 150', value: 'large'  },
        { label: '150+',      value: 'xlarge' },
      ]
    },
    {
      key: 'focus',
      question: 'Beverage focus?',
      choices: [
        { label: 'Wine only',       value: 'wine'      },
        { label: 'Beer and wine',   value: 'beer-wine' },
        { label: 'Full bar',        value: 'full'      },
        { label: 'Leave it to you', value: 'surprise'  },
      ]
    },
    {
      key: 'timeline',
      question: 'When is the event?',
      choices: [
        { label: 'This week',         value: 'urgent'   },
        { label: 'This month',        value: 'month'    },
        { label: '1 to 3 months out', value: 'later'    },
        { label: 'Further out',       value: 'planning' },
      ]
    },
  ],
};

const CORP_SERVICE_LABEL = {
  gifting: 'Corporate Gifting',
  cellar:  'Cellar Consulting',
  event:   'Event Planning',
};

// ── State ─────────────────────────────────────────────────────
let corpBranchStep = 0;
let corpAnswers    = {};

// ── Build embedded card ───────────────────────────────────────
function corpBuild() {
  const mount = document.getElementById('som-corp-embed');
  if (!mount) return;

  mount.innerHTML = `
    <div class="som-embed">
      <div class="som-embed-header">
        <img src="/images/about/Chris-Reid.webp" alt="Christopher Reid" />
        <div>
          <h4>Christopher Reid</h4>
          <p>20 Year Industry Vet &nbsp;·&nbsp; WSET</p>
        </div>
      </div>
      <div class="som-embed-body" id="som-corp-body"></div>
    </div>
  `;

  corpRenderService();
}

// ── Step 0 — service selection ────────────────────────────────
function corpRenderService() {
  const body = document.getElementById('som-corp-body');
  body.innerHTML = `
    <p class="som-question">What can we help you with?</p>
    <div class="som-choices">
      <button class="som-choice" data-value="gifting">Corporate Gifting</button>
      <button class="som-choice" data-value="cellar">Cellar Consulting</button>
      <button class="som-choice" data-value="event">Event Planning</button>
    </div>
  `;

  body.querySelectorAll('.som-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      corpAnswers    = { service: btn.dataset.value };
      corpBranchStep = 0;
      btn.classList.add('selected');
      setTimeout(corpRenderBranchStep, 180);
    });
  });
}

// ── Branch steps ──────────────────────────────────────────────
function corpRenderBranchStep() {
  const body  = document.getElementById('som-corp-body');
  const steps = CORP_STEPS[corpAnswers.service];
  const step  = steps[corpBranchStep];
  const total = steps.length + 1;

  body.innerHTML = `
    <div class="som-progress">
      ${Array.from({ length: total }, (_, i) =>
        `<div class="som-progress-dot ${i <= corpBranchStep ? 'active' : ''}"></div>`
      ).join('')}
    </div>
    <p class="som-question">${step.question}</p>
    <div class="som-choices">
      ${step.choices.map(c => `
        <button class="som-choice ${corpAnswers[step.key] === c.value ? 'selected' : ''}"
                data-value="${c.value}">${c.label}</button>
      `).join('')}
    </div>
    <div class="som-nav">
      <button class="som-back">${corpBranchStep === 0 ? 'Change service' : 'Back'}</button>
    </div>
  `;

  body.querySelectorAll('.som-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      corpAnswers[step.key] = btn.dataset.value;
      body.querySelectorAll('.som-choice').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      setTimeout(() => {
        if (corpBranchStep < steps.length - 1) {
          corpBranchStep++;
          corpRenderBranchStep();
        } else {
          corpRenderContact();
        }
      }, 180);
    });
  });

  body.querySelector('.som-back').addEventListener('click', () => {
    if (corpBranchStep > 0) { corpBranchStep--; corpRenderBranchStep(); }
    else corpRenderService();
  });
}

// ── Contact step ──────────────────────────────────────────────
function corpRenderContact() {
  const body  = document.getElementById('som-corp-body');
  const steps = CORP_STEPS[corpAnswers.service];
  const total = steps.length + 1;

  body.innerHTML = `
    <div class="som-progress">
      ${Array.from({ length: total }, () =>
        `<div class="som-progress-dot active"></div>`
      ).join('')}
    </div>
    <div class="som-results-hd" style="margin-bottom:18px;">
      <p class="som-results-label">Almost done.</p>
      <p class="som-results-meta">Who should we get back to?</p>
    </div>
    <div class="som-fields">
      <div class="som-field-row">
        <div class="som-field">
          <label class="som-label">First Name</label>
          <input class="som-input" type="text" id="somc-fname" autocomplete="given-name" placeholder="First" />
        </div>
        <div class="som-field">
          <label class="som-label">Last Name</label>
          <input class="som-input" type="text" id="somc-lname" autocomplete="family-name" placeholder="Last" />
        </div>
      </div>
      <div class="som-field">
        <label class="som-label">Email</label>
        <input class="som-input" type="email" id="somc-email" autocomplete="email" placeholder="your@email.com" />
      </div>
      <div class="som-field">
        <label class="som-label">Phone <span class="som-label-optional">(optional)</span></label>
        <input class="som-input" type="tel" id="somc-phone" autocomplete="tel" placeholder="604-xxx-xxxx" />
      </div>
      <div class="som-field">
        <label class="som-label">Anything to add? <span class="som-label-optional">(optional)</span></label>
        <textarea class="som-input" id="somc-notes" rows="2" placeholder="Specific requests, questions, context..."></textarea>
      </div>
    </div>
    <p id="somc-error" class="som-error" style="display:none;">Please add your name and email so we can reach you.</p>
    <button id="somc-submit" class="som-btn-primary som-submit-btn">Send to Chris &amp; Jason</button>
    <div class="som-nav"><button class="som-back">Back</button></div>
  `;

  document.getElementById('somc-submit').addEventListener('click', corpSubmit);
  body.querySelector('.som-back').addEventListener('click', () => {
    corpBranchStep = CORP_STEPS[corpAnswers.service].length - 1;
    corpRenderBranchStep();
  });
}

// ── Submit ────────────────────────────────────────────────────
async function corpSubmit() {
  const fname = document.getElementById('somc-fname').value.trim();
  const lname = document.getElementById('somc-lname').value.trim();
  const email = document.getElementById('somc-email').value.trim();
  const phone = document.getElementById('somc-phone').value.trim();
  const notes = document.getElementById('somc-notes').value.trim();
  const error = document.getElementById('somc-error');

  if (!fname || !email) { error.style.display = 'block'; return; }
  error.style.display = 'none';

  const btn = document.getElementById('somc-submit');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  const serviceLabel = CORP_SERVICE_LABEL[corpAnswers.service];
  const steps = CORP_STEPS[corpAnswers.service];

  const lines = [
    `Som Corporate Intake — ${serviceLabel}`,
    ``,
    ...steps.map(s => {
      const choice = s.choices.find(c => c.value === corpAnswers[s.key]);
      const key = s.key.charAt(0).toUpperCase() + s.key.slice(1);
      return `${key}: ${choice ? choice.label : '—'}`;
    }),
  ];
  if (phone) lines.push(`Phone: ${phone}`);
  if (notes) lines.push(``, `Notes: ${notes}`);

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_type: serviceLabel,
        first_name:   fname,
        last_name:    lname,
        email:        email,
        message:      lines.join('\n'),
      })
    });

    if (res.ok) {
      corpRenderThankYou(fname);
    } else {
      throw new Error('Send error');
    }
  } catch (e) {
    btn.textContent = 'Send to Chris & Jason';
    btn.disabled = false;
    error.textContent = 'Something went wrong. Try again or email hello@broadwaybeerwine.ca';
    error.style.display = 'block';
  }
}

// ── Thank you ─────────────────────────────────────────────────
function corpRenderThankYou(fname) {
  const body = document.getElementById('som-corp-body');
  body.innerHTML = `
    <div style="text-align:center;padding:24px 0 16px;">
      <div style="width:48px;height:48px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;color:#fff;font-size:1.4rem;">&#10003;</div>
      <p class="som-results-label">Got it, ${fname}.</p>
      <p style="font-size:0.88rem;color:var(--text-muted);line-height:1.7;margin-top:12px;max-width:34ch;margin-left:auto;margin-right:auto;">We will be in touch shortly. If you need something sooner, give us a call or come in.</p>
      <p style="font-size:0.95rem;font-weight:700;color:var(--gold);margin-top:20px;">604-734-8543</p>
    </div>
  `;
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => { if (CORP_ENABLED) corpBuild(); });
