/* Broadway Beer Wine & Spirits — Virtual Sommelier Widget
   Simulated mock-up. Replace recommendation logic with Claude API
   + Bottlecapps inventory once shop integration is live.
   ------------------------------------------------------------ */

const SOM = {

  steps: [
    {
      key: 'occasion',
      question: "What's the occasion?",
      choices: [
        { label: 'Dinner tonight',       value: 'dinner'  },
        { label: 'A gift for someone',   value: 'gift'    },
        { label: 'Just for me',          value: 'solo'    },
        { label: 'Something special',    value: 'special' },
      ]
    },
    {
      key: 'type',
      question: "What are you in the mood for?",
      choices: [
        { label: 'Red Wine',    value: 'red'      },
        { label: 'White Wine',  value: 'white'    },
        { label: 'Bubbles',     value: 'bubbles'  },
        { label: 'Spirits',     value: 'spirits'  },
        { label: 'Surprise me', value: 'surprise' },
      ]
    },
    {
      key: 'budget',
      question: "What's your budget?",
      choices: [
        { label: 'Under $30',          value: 'low'       },
        { label: '$30 to $60',         value: 'mid'       },
        { label: '$60 to $100',        value: 'high'      },
        { label: 'Whatever it takes',  value: 'unlimited' },
      ]
    }
  ],

  occasionLine: {
    dinner:  'Perfect for the table.',
    gift:    'Arrives well.',
    solo:    'Pour yourself a proper glass.',
    special: 'This one earns the occasion.',
  },

  recommend(answers) {
    const { occasion, type, budget } = answers;
    const o = this.occasionLine[occasion] || '';

    if (type === 'spirits') {
      return {
        tag:      'Spirits',
        name:     'The Dalmore 12 Year Old',
        sub:      'Single Malt Scotch · Highland, Scotland',
        quote:    `${o} The gateway into the Dalmore house style. Dark fruit, chocolate, and a long sherry finish. Whisky Advocate 88 pts.`,
        price:    '$133.34',
        shopUrl:  'https://shop.broadwaybeerwine.ca/product/s-20089/p-449456/buy-the-dalmore-12-year-old',
        learnUrl: null,
      };
    }

    if (type === 'white') {
      return {
        tag:      'White Wine',
        name:     'Attems Sauvignon Blanc',
        sub:      'Friuli, Italy',
        quote:    `${o} Crisp, precise, and a natural at the table. One of those bottles that makes everything taste better alongside food.`,
        price:    '$24–28',
        shopUrl:  'https://shop.broadwaybeerwine.ca',
        learnUrl: '/blog/la-brujula-squid.html',
      };
    }

    if (type === 'bubbles') {
      return {
        tag:      'Sparkling',
        name:     'Come talk to us',
        sub:      'Champagne & Sparkling Selection',
        quote:    `${o} Bubbles are personal. Come in and we will find the right one — we carry options at every price point worth knowing about.`,
        price:    'From $25',
        shopUrl:  'https://shop.broadwaybeerwine.ca',
        learnUrl: null,
      };
    }

    // Red + Surprise — route by budget
    if (budget === 'low') {
      return {
        tag:      'Red Wine',
        name:     'Argentine Malbec',
        sub:      'Mendoza, Argentina',
        quote:    `${o} The grape France let go and Argentina made famous. Rich, dark-fruited, and honest value at this price.`,
        price:    '$18–25',
        shopUrl:  'https://shop.broadwaybeerwine.ca',
        learnUrl: '/blog/malbec-argentina.html',
      };
    }

    if (budget === 'mid') {
      return {
        tag:      'Red Wine',
        name:     'Bernard Baudry Chinon',
        sub:      'Loire Valley, France · Cabernet Franc',
        quote:    `${o} He started with a vineyard so small he called it a handkerchief. Today the Baudry name is shorthand for Chinon done right.`,
        price:    '$35–45',
        shopUrl:  'https://shop.broadwaybeerwine.ca',
        learnUrl: '/blog/bernard-baudry-chinon.html',
      };
    }

    // high or unlimited
    return {
      tag:      'BC Wine',
      name:     'SKAHA Vineyard Equus 2018',
      sub:      'Okanagan, British Columbia',
      quote:    `${o} Ancient soils, 250 cases, a boutique Okanagan operation doing something genuinely special. One of the best BC bottles on our shelf.`,
      price:    '$65–80',
      shopUrl:  'https://shop.broadwaybeerwine.ca',
      learnUrl: '/blog/skaha-vineyard-equus.html',
    };
  }
};

// ── Widget state ──────────────────────────────────────────────
let somOpen    = false;
let somStep    = 0;
let somAnswers = {};

// ── Build DOM ─────────────────────────────────────────────────
function somBuild() {
  // Trigger button
  const trigger = document.createElement('div');
  trigger.className = 'som-trigger';
  trigger.id = 'som-trigger';
  trigger.setAttribute('aria-label', 'Ask Chris — Virtual Sommelier');
  trigger.innerHTML = `
    <img class="som-trigger-avatar" src="/images/about/Chris-Reid.webp" alt="Christopher Reid" />
    <span class="som-trigger-label">Ask Chris</span>
  `;

  // Card
  const card = document.createElement('div');
  card.className = 'som-card';
  card.id = 'som-card';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-label', 'Broadway Sommelier');
  card.innerHTML = `
    <div class="som-card-header">
      <img src="/images/about/Chris-Reid.webp" alt="Christopher Reid" />
      <div>
        <h4>Christopher Reid</h4>
        <p>Broadway Sommelier &nbsp;·&nbsp; WSET</p>
      </div>
      <button class="som-close" id="som-close" aria-label="Close">&times;</button>
    </div>
    <div class="som-card-body" id="som-body"></div>
  `;

  document.body.appendChild(trigger);
  document.body.appendChild(card);

  trigger.addEventListener('click', somToggle);
  document.getElementById('som-close').addEventListener('click', somToggle);
  somRenderStep();
}

function somToggle() {
  somOpen = !somOpen;
  document.getElementById('som-card').classList.toggle('open', somOpen);
}

// ── Render a question step ────────────────────────────────────
function somRenderStep() {
  const body  = document.getElementById('som-body');
  const step  = SOM.steps[somStep];
  const total = SOM.steps.length;

  body.innerHTML = `
    <div class="som-progress">
      ${Array.from({ length: total }, (_, i) =>
        `<div class="som-progress-dot ${i <= somStep ? 'active' : ''}"></div>`
      ).join('')}
    </div>
    <p class="som-question">${step.question}</p>
    <div class="som-choices">
      ${step.choices.map(c => `
        <button class="som-choice ${somAnswers[step.key] === c.value ? 'selected' : ''}"
                data-value="${c.value}">
          ${c.label}
        </button>
      `).join('')}
    </div>
    <div class="som-nav">
      <button class="som-back" ${somStep === 0 ? 'style="visibility:hidden"' : ''}>Back</button>
      <button class="som-next" ${!somAnswers[step.key] ? 'disabled' : ''}>
        ${somStep === total - 1 ? 'Find My Bottle &rarr;' : 'Next &rarr;'}
      </button>
    </div>
  `;

  body.querySelectorAll('.som-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      somAnswers[step.key] = btn.dataset.value;
      body.querySelectorAll('.som-choice').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      body.querySelector('.som-next').disabled = false;
    });
  });

  body.querySelector('.som-next').addEventListener('click', () => {
    if (somStep < SOM.steps.length - 1) {
      somStep++;
      somRenderStep();
    } else {
      somRenderResult();
    }
  });

  const back = body.querySelector('.som-back');
  if (back) {
    back.addEventListener('click', () => { somStep--; somRenderStep(); });
  }
}

// ── Render recommendation ─────────────────────────────────────
function somRenderResult() {
  const body = document.getElementById('som-body');
  const rec  = SOM.recommend(somAnswers);

  body.innerHTML = `
    <p class="som-result-tag">Chris recommends</p>
    <p class="som-result-name">${rec.name}</p>
    <p class="som-result-sub">${rec.sub}</p>
    <p class="som-result-quote">${rec.quote}</p>
    ${rec.price ? `<p class="som-result-price">${rec.price}</p>` : ''}
    <div class="som-result-actions">
      <a href="${rec.shopUrl}" target="_blank" rel="noopener" class="som-btn-primary">Shop Now</a>
      ${rec.learnUrl ? `<a href="${rec.learnUrl}" class="som-btn-secondary">Read More</a>` : ''}
    </div>
    <button class="som-restart">Start over</button>
  `;

  body.querySelector('.som-restart').addEventListener('click', () => {
    somStep    = 0;
    somAnswers = {};
    somRenderStep();
  });
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', somBuild);
