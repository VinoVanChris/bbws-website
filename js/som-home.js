/* Broadway Beer Wine & Spirits - Som Homepage Intake
   General intake widget embedded in "What Sets Us Apart" section.
   Five funnels: Gift, Find a Bottle, Party/Event, Corporate, Something Else.
   Fires to Formspree → Chris & Jason. No API required.
   ──────────────────────────────────────────────────────────────── */

const SOM_HOME_ENABLED = true;

// ── Branch question sets ──────────────────────────────────────
const HOME_STEPS = {

  gift: [
    {
      key: 'recipient',
      question: 'Who is it for?',
      choices: [
        { label: 'Partner or spouse',  value: 'partner'   },
        { label: 'Friend',             value: 'friend'    },
        { label: 'Parent or family',   value: 'family'    },
        { label: 'Colleague or client', value: 'colleague' },
      ]
    },
    {
      key: 'occasion',
      question: "What's the occasion?",
      choices: [
        { label: 'Birthday',      value: 'birthday'     },
        { label: 'Anniversary',   value: 'anniversary'  },
        { label: 'Housewarming',  value: 'housewarming' },
        { label: 'Thank you',     value: 'thankyou'     },
      ]
    },
    {
      key: 'drink',
      question: 'What do they usually drink?',
      choices: [
        { label: 'Red wine',   value: 'red'      },
        { label: 'White wine', value: 'white'    },
        { label: 'Bubbles',    value: 'bubbles'  },
        { label: 'Spirits',    value: 'spirits'  },
      ]
    },
    {
      key: 'budget',
      question: "What's your budget?",
      choices: [
        { label: 'Under $50',   value: 'under50'  },
        { label: '$50 to $100', value: '50-100'   },
        { label: '$100 to $200', value: '100-200' },
        { label: 'Open budget', value: 'open'     },
      ]
    },
  ],

  bottle: [
    {
      key: 'request',
      type: 'text',
      question: 'What are you looking for?',
      placeholder: 'Bottle name, producer, region, anything you know...',
    },
    {
      key: 'budget',
      question: 'Any idea on budget?',
      choices: [
        { label: 'Under $50',    value: 'under50'  },
        { label: '$50 to $100',  value: '50-100'   },
        { label: '$100 to $200', value: '100-200'  },
        { label: 'No idea yet',  value: 'open'     },
      ]
    },
  ],

  event: [
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
        { label: 'Wine',            value: 'wine'      },
        { label: 'Beer and wine',   value: 'beer-wine' },
        { label: 'Full bar',        value: 'full'      },
        { label: 'Leave it to you', value: 'surprise'  },
      ]
    },
    {
      key: 'budget',
      question: 'Budget range?',
      choices: (answers) => {
        const g = answers.guests;
        if (g === 'small')  return [ // under 25
          { label: 'Under $750',          value: 'under750' },
          { label: '$750 to $2,000',      value: '750-2k'   },
          { label: '$2,000 to $4,000',    value: '2k-4k'    },
          { label: 'Open budget',         value: 'open'     },
        ];
        if (g === 'medium') return [ // 25-75
          { label: 'Under $2,000',        value: 'under2k'  },
          { label: '$2,000 to $5,000',    value: '2k-5k'    },
          { label: '$5,000 to $10,000',   value: '5k-10k'   },
          { label: 'Open budget',         value: 'open'     },
        ];
        if (g === 'large')  return [ // 75-150
          { label: 'Under $4,000',        value: 'under4k'  },
          { label: '$4,000 to $10,000',   value: '4k-10k'   },
          { label: '$10,000 to $20,000',  value: '10k-20k'  },
          { label: 'Open budget',         value: 'open'     },
        ];
        return [                          // 150+
          { label: 'Under $8,000',        value: 'under8k'  },
          { label: '$8,000 to $20,000',   value: '8k-20k'   },
          { label: '$20,000+',            value: '20k+'     },
          { label: 'Open budget',         value: 'open'     },
        ];
      }
    },
    {
      key: 'timeline',
      question: 'When is it?',
      choices: [
        { label: 'This week',         value: 'urgent'   },
        { label: 'This month',        value: 'month'    },
        { label: '1 to 3 months out', value: 'later'    },
        { label: 'Further out',       value: 'planning' },
      ]
    },
  ],

  corporate: [
    {
      key: 'gifttype',
      question: 'What do you need?',
      choices: [
        { label: 'Bottles',                    value: 'bottles' },
        { label: 'Gift boxes with wine & food', value: 'giftbox' },
        { label: 'A mix of both',              value: 'both'    },
        { label: 'Not sure yet',               value: 'unsure'  },
      ]
    },
    {
      key: 'quantity',
      question: 'How many people?',
      choices: [
        { label: 'Just a few',          value: 'few'   },
        { label: 'A team (10-50)',       value: 'team'  },
        { label: 'Company-wide (50+)',  value: 'large'  },
        { label: 'One special bottle',  value: 'one'    },
      ]
    },
    {
      key: 'budget',
      question: 'Budget per person?',
      choices: [
        { label: 'Under $50',   value: 'under50' },
        { label: '$50 to $100', value: '50-100'  },
        { label: '$100+',       value: '100+'    },
        { label: 'Open budget', value: 'open'    },
      ]
    },
  ],

  other: [
    {
      key: 'message',
      type: 'text',
      question: "What can we help with?",
      placeholder: 'Tell us what you are looking for and we will get back to you.',
    },
  ],

};

const HOME_SERVICE_LABEL = {
  gift:      'Personal Gift',
  bottle:    'Find a Specific Bottle',
  event:     'Party / Event',
  corporate: 'Corporate Order',
  other:     'General Inquiry',
};

// ── State ─────────────────────────────────────────────────────
let homeBranchStep = 0;
let homeAnswers    = {};

// ── Build embedded card ───────────────────────────────────────
function homeSomBuild() {
  const mount = document.getElementById('som-home-embed');
  if (!mount) return;

  mount.innerHTML = `
    <div class="som-embed som-embed--fill">
      <div class="som-embed-header">
        <img src="/images/about/Chris-Reid.webp" alt="Christopher Reid" />
        <div>
          <h4>Christopher Reid</h4>
          <p>20 Year Industry Vet &nbsp;·&nbsp; WSET</p>
        </div>
      </div>
      <div class="som-embed-body" id="som-home-body"></div>
    </div>
  `;

  homeRenderService();
}

// ── Step 0 - service selection ────────────────────────────────
function homeRenderService() {
  const body = document.getElementById('som-home-body');
  body.innerHTML = `
    <p class="som-question">How can we help?</p>
    <div class="som-choices">
      <button class="som-choice" data-value="gift">A gift for someone</button>
      <button class="som-choice" data-value="bottle">Looking for a specific bottle</button>
      <button class="som-choice" data-value="event">Planning a party or event</button>
      <button class="som-choice" data-value="corporate">Corporate order</button>
      <button class="som-choice" data-value="other">Something else</button>
    </div>
  `;

  body.querySelectorAll('.som-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      homeAnswers    = { service: btn.dataset.value };
      homeBranchStep = 0;
      btn.classList.add('selected');
      setTimeout(homeRenderBranchStep, 180);
    });
  });
}

// ── Branch steps ──────────────────────────────────────────────
function homeRenderBranchStep() {
  const body  = document.getElementById('som-home-body');
  const steps = HOME_STEPS[homeAnswers.service];
  const step  = steps[homeBranchStep];
  const total = steps.length + 1;
  const isText  = step.type === 'text';
  const choices = !isText && (typeof step.choices === 'function' ? step.choices(homeAnswers) : step.choices);

  body.innerHTML = `
    <div class="som-progress">
      ${Array.from({ length: total }, (_, i) =>
        `<div class="som-progress-dot ${i <= homeBranchStep ? 'active' : ''}"></div>`
      ).join('')}
    </div>
    <p class="som-question">${step.question}</p>
    ${isText ? `
      <div class="som-field" style="margin-bottom:10px;">
        <textarea class="som-input" id="home-text-input" rows="3"
          placeholder="${step.placeholder}"></textarea>
      </div>
      <button class="som-btn-primary" id="home-text-next"
        style="padding:10px 24px;border:none;border-radius:8px;cursor:pointer;font-size:0.75rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
        Continue
      </button>
    ` : `
      <div class="som-choices">
        ${choices.map(c => `
          <button class="som-choice ${homeAnswers[step.key] === c.value ? 'selected' : ''}"
                  data-value="${c.value}">${c.label}</button>
        `).join('')}
      </div>
    `}
    <div class="som-nav">
      <button class="som-back">${homeBranchStep === 0 ? 'Change' : 'Back'}</button>
    </div>
  `;

  if (isText) {
    const next = document.getElementById('home-text-next');
    next.addEventListener('click', () => {
      const val = document.getElementById('home-text-input').value.trim();
      if (!val) return;
      homeAnswers[step.key] = val;
      homeAdvance(steps);
    });
    document.getElementById('home-text-input').addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); next.click(); }
    });
  } else {
    body.querySelectorAll('.som-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        homeAnswers[step.key] = btn.dataset.value;
        body.querySelectorAll('.som-choice').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        setTimeout(() => homeAdvance(steps), 180);
      });
    });
  }

  body.querySelector('.som-back').addEventListener('click', () => {
    if (homeBranchStep > 0) { homeBranchStep--; homeRenderBranchStep(); }
    else homeRenderService();
  });
}

function homeAdvance(steps) {
  if (homeBranchStep < steps.length - 1) {
    homeBranchStep++;
    homeRenderBranchStep();
  } else {
    homeRenderContact();
  }
}

// ── Contact step ──────────────────────────────────────────────
function homeRenderContact() {
  const body  = document.getElementById('som-home-body');
  const steps = HOME_STEPS[homeAnswers.service];
  const total = steps.length + 1;

  body.innerHTML = `
    <div class="som-progress">
      ${Array.from({ length: total }, () =>
        `<div class="som-progress-dot active"></div>`
      ).join('')}
    </div>
    <div class="som-results-hd" style="margin-bottom:16px;">
      <p class="som-results-label">Almost done.</p>
      <p class="som-results-meta">Who should we get back to?</p>
    </div>
    <div class="som-fields">
      <div class="som-field-row">
        <div class="som-field">
          <label class="som-label">First Name</label>
          <input class="som-input" type="text" id="somh-fname" autocomplete="given-name" placeholder="First" />
        </div>
        <div class="som-field">
          <label class="som-label">Last Name</label>
          <input class="som-input" type="text" id="somh-lname" autocomplete="family-name" placeholder="Last" />
        </div>
      </div>
      <div class="som-field">
        <label class="som-label">Email</label>
        <input class="som-input" type="email" id="somh-email" autocomplete="email" placeholder="your@email.com" />
      </div>
      <div class="som-field">
        <label class="som-label">Phone <span class="som-label-optional">(optional)</span></label>
        <input class="som-input" type="tel" id="somh-phone" autocomplete="tel" placeholder="604-xxx-xxxx" />
      </div>
    </div>
    <p id="somh-error" class="som-error" style="display:none;">Please add your name and email so we can reach you.</p>
    <button id="somh-submit" class="som-btn-primary som-submit-btn">Send to Chris &amp; Jason</button>
    <div class="som-nav"><button class="som-back">Back</button></div>
  `;

  document.getElementById('somh-submit').addEventListener('click', homeSubmit);
  body.querySelector('.som-back').addEventListener('click', () => {
    homeBranchStep = HOME_STEPS[homeAnswers.service].length - 1;
    homeRenderBranchStep();
  });
}

// ── Submit ────────────────────────────────────────────────────
async function homeSubmit() {
  const fname = document.getElementById('somh-fname').value.trim();
  const lname = document.getElementById('somh-lname').value.trim();
  const email = document.getElementById('somh-email').value.trim();
  const phone = document.getElementById('somh-phone').value.trim();
  const error = document.getElementById('somh-error');

  if (!fname || !email) { error.style.display = 'block'; return; }
  error.style.display = 'none';

  const btn = document.getElementById('somh-submit');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  const serviceLabel = HOME_SERVICE_LABEL[homeAnswers.service];
  const steps = HOME_STEPS[homeAnswers.service];

  const lines = [`Som Intake - ${serviceLabel}`, ``];
  steps.forEach(s => {
    const key = s.key.charAt(0).toUpperCase() + s.key.slice(1);
    if (s.type === 'text') {
      lines.push(`${key}: ${homeAnswers[s.key] || '-'}`);
    } else {
      const choice = s.choices.find(c => c.value === homeAnswers[s.key]);
      lines.push(`${key}: ${choice ? choice.label : '-'}`);
    }
  });
  if (phone) lines.push(`Phone: ${phone}`);

  try {
    const res = await fetch('https://formspree.io/f/mojrgdnq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        service_type: serviceLabel,
        first_name:   fname,
        last_name:    lname,
        email:        email,
        message:      lines.join('\n'),
      })
    });

    if (res.ok) {
      homeRenderThankYou(fname);
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
function homeRenderThankYou(fname) {
  const body = document.getElementById('som-home-body');
  body.innerHTML = `
    <div style="text-align:center;padding:24px 0 16px;">
      <div style="width:48px;height:48px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;color:#fff;font-size:1.4rem;">&#10003;</div>
      <p class="som-results-label">Got it, ${fname}.</p>
      <p style="font-size:0.85rem;color:var(--text-muted);line-height:1.7;margin-top:12px;">We will be in touch shortly. If you need something sooner, give us a call or come in.</p>
      <p style="font-size:0.95rem;font-weight:700;color:var(--gold);margin-top:20px;">604-734-8543</p>
    </div>
  `;
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => { if (SOM_HOME_ENABLED) homeSomBuild(); });
