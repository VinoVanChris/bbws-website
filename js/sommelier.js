/* Broadway Beer Wine & Spirits — Virtual Sommelier Widget
   Mock-up: swap recommend() for Claude API + Bottlecapps inventory when live.
   ─────────────────────────────────────────────────────────────────────────── */

const SOM = {

  steps: [
    {
      key: 'occasion',
      question: "What's the occasion?",
      choices: [
        { label: 'Dinner tonight',      value: 'dinner'  },
        { label: 'A gift for someone',  value: 'gift'    },
        { label: 'Just for me',         value: 'solo'    },
        { label: 'Something special',   value: 'special' },
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
        { label: 'Under $30',         value: 'low'       },
        { label: '$30 to $60',        value: 'mid'       },
        { label: '$60 to $100',       value: 'high'      },
        { label: 'Whatever it takes', value: 'unlimited' },
      ]
    }
  ],

  occasionLine: {
    dinner:  'Perfect for the table.',
    gift:    'Arrives well.',
    solo:    'Pour yourself a proper glass.',
    special: 'This one earns the occasion.',
  },

  // Returns an array of 3 recommendations
  recommend(answers) {
    const { occasion, type, budget } = answers;
    const o = this.occasionLine[occasion] || '';

    if (type === 'spirits') {
      return [
        {
          tag:      'Single Malt Scotch',
          name:     'The Dalmore 12 Year Old',
          sub:      'Highland, Scotland · 40% ABV',
          quote:    `${o} The gateway into the Dalmore house style. Sherry-finished, dark-fruited, and honest about what it is. Whisky Advocate 88 pts.`,
          price:    '$133.34',
          shopUrl:  'https://shop.broadwaybeerwine.ca/product/s-20089/p-449456/buy-the-dalmore-12-year-old',
          learnUrl: null,
        },
        {
          tag:      'Venezuelan Rum',
          name:     'Diplomatico Reserva Exclusiva',
          sub:      'Venezuela · 8 Year · 40% ABV',
          quote:    `${o} Rich, slow, and unapologetically sweet. Dark toffee, orange peel, and a finish that lingers. The bottle that converts rum sceptics.`,
          price:    '$62–70',
          shopUrl:  'https://shop.broadwaybeerwine.ca',
          learnUrl: null,
        },
        {
          tag:      'Islay Single Malt',
          name:     'Ardbeg 10 Year Old',
          sub:      'Islay, Scotland · 46% ABV',
          quote:    `${o} Smoke, sea salt, and a medicinal edge that earns its reputation. For the drinker who wants to feel something.`,
          price:    '$88–96',
          shopUrl:  'https://shop.broadwaybeerwine.ca',
          learnUrl: null,
        },
      ];
    }

    if (type === 'white') {
      return [
        {
          tag:      'White Wine · Italy',
          name:     'Attems Sauvignon Blanc',
          sub:      'Friuli, Italy',
          quote:    `${o} Crisp, precise, and a natural at the table. One of those bottles that makes everything alongside it taste better.`,
          price:    '$24–28',
          shopUrl:  'https://shop.broadwaybeerwine.ca',
          learnUrl: '/blog/la-brujula-squid.html',
        },
        {
          tag:      'White Wine · France',
          name:     'Domaine Weinbach Riesling',
          sub:      'Alsace, France',
          quote:    `${o} Alsace Riesling at its most honest — floral, mineral, and dry in a way that makes most other whites feel underdressed.`,
          price:    '$42–55',
          shopUrl:  'https://shop.broadwaybeerwine.ca',
          learnUrl: null,
        },
        {
          tag:      'BC White Wine',
          name:     'Okanagan Chardonnay Selection',
          sub:      'British Columbia',
          quote:    `${o} BC Chardonnay has arrived. Come in and we will pull the right one — we carry several that will change your mind about the grape.`,
          price:    '$28–45',
          shopUrl:  'https://shop.broadwaybeerwine.ca',
          learnUrl: '/blog/bc-wine-month.html',
        },
      ];
    }

    if (type === 'bubbles') {
      return [
        {
          tag:      'Champagne',
          name:     'Grower Champagne Selection',
          sub:      'Champagne, France',
          quote:    `${o} Grower Champagne is the answer to everything. We carry several you will not find at the government store — come in and let us pick one.`,
          price:    '$65–90',
          shopUrl:  'https://shop.broadwaybeerwine.ca',
          learnUrl: null,
        },
        {
          tag:      'Sparkling · France',
          name:     'Crémant d\'Alsace',
          sub:      'Alsace, France',
          quote:    `${o} All the elegance of Champagne method, none of the price anxiety. The smartest pour at any table.`,
          price:    '$28–36',
          shopUrl:  'https://shop.broadwaybeerwine.ca',
          learnUrl: null,
        },
        {
          tag:      'BC Sparkling',
          name:     'Okanagan Sparkling Selection',
          sub:      'British Columbia',
          quote:    `${o} BC sparkling is having a moment and it deserves it. Bright, local, and something to talk about.`,
          price:    '$32–48',
          shopUrl:  'https://shop.broadwaybeerwine.ca',
          learnUrl: '/blog/bc-wine-month.html',
        },
      ];
    }

    // Red + Surprise — route by budget
    if (budget === 'low') {
      return [
        {
          tag:      'Red Wine · Argentina',
          name:     'Argentine Malbec',
          sub:      'Mendoza, Argentina',
          quote:    `${o} The grape France let go and Argentina made famous. Rich, dark-fruited, and honest value at this price point.`,
          price:    '$18–25',
          shopUrl:  'https://shop.broadwaybeerwine.ca',
          learnUrl: '/blog/malbec-argentina.html',
        },
        {
          tag:      'Red Wine · France',
          name:     'Côtes du Rhône Rouge',
          sub:      'Southern Rhône, France',
          quote:    `${o} Grenache-led, generous, and wildly food-friendly. The kind of everyday wine southern France has been drinking for centuries.`,
          price:    '$20–28',
          shopUrl:  'https://shop.broadwaybeerwine.ca',
          learnUrl: null,
        },
        {
          tag:      'Natural Wine',
          name:     'Natural Red Selection',
          sub:      'Small Producers · Various',
          quote:    `${o} Low-intervention, minimal sulphites, maximum character. Come in and we will find one that will make you rethink what red wine can taste like.`,
          price:    '$22–30',
          shopUrl:  'https://shop.broadwaybeerwine.ca',
          learnUrl: '/blog/natural-wine-jules-chauvet.html',
        },
      ];
    }

    if (budget === 'mid') {
      return [
        {
          tag:      'Red Wine · Loire Valley',
          name:     'Bernard Baudry Chinon',
          sub:      'Loire Valley, France · Cabernet Franc',
          quote:    `${o} He started with a vineyard so small he called it a handkerchief. Today the Baudry name is shorthand for Chinon done right.`,
          price:    '$35–45',
          shopUrl:  'https://shop.broadwaybeerwine.ca',
          learnUrl: '/blog/bernard-baudry-chinon.html',
        },
        {
          tag:      'Red Wine · Italy',
          name:     'Barbera d\'Asti',
          sub:      'Piedmont, Italy',
          quote:    `${o} High acid, low tannin, and a depth that punches well above its price. One of Italy's most underrated bottles.`,
          price:    '$32–42',
          shopUrl:  'https://shop.broadwaybeerwine.ca',
          learnUrl: null,
        },
        {
          tag:      'Red Wine · Oregon',
          name:     'Willamette Valley Pinot Noir',
          sub:      'Oregon, USA',
          quote:    `${o} Oregon Pinot at this price is one of the best deals in the shop. Earthy, silky, and honest in a way Burgundy charges three times as much for.`,
          price:    '$40–55',
          shopUrl:  'https://shop.broadwaybeerwine.ca',
          learnUrl: null,
        },
      ];
    }

    // high or unlimited
    return [
      {
        tag:      'BC Wine',
        name:     'SKAHA Vineyard Equus 2018',
        sub:      'Okanagan, British Columbia',
        quote:    `${o} Ancient soils, 250 cases, a boutique Okanagan operation doing something genuinely special. One of the best BC bottles on our shelf.`,
        price:    '$65–80',
        shopUrl:  'https://shop.broadwaybeerwine.ca',
        learnUrl: '/blog/skaha-vineyard-equus.html',
      },
      {
        tag:      'Red Wine · Burgundy',
        name:     'Village Burgundy Pinot Noir',
        sub:      'Burgundy, France',
        quote:    `${o} Entry-level Burgundy from a producer worth knowing. The terroir is doing the work — all you have to do is pour it.`,
        price:    '$70–90',
        shopUrl:  'https://shop.broadwaybeerwine.ca',
        learnUrl: null,
      },
      {
        tag:      'BC Wine · Cabernet Franc',
        name:     'Okanagan Cabernet Franc',
        sub:      'British Columbia',
        quote:    `${o} BC Cab Franc is one of the Okanagan's great secrets. Structured, earthy, and age-worthy in a way that will surprise you.`,
        price:    '$60–85',
        shopUrl:  'https://shop.broadwaybeerwine.ca',
        learnUrl: '/blog/bc-wine-month.html',
      },
    ];
  }
};

// ── Widget state ──────────────────────────────────────────────
let somOpen        = false;
let somStep        = 0;
let somAnswers     = {};
let somResults     = [];
let somResultIndex = 0;
let somTouchStartX = 0;

// ── Build DOM ─────────────────────────────────────────────────
function somBuild() {
  const trigger = document.createElement('div');
  trigger.className = 'som-trigger';
  trigger.id = 'som-trigger';
  trigger.setAttribute('aria-label', 'Ask Chris — Virtual Sommelier');
  trigger.innerHTML = `
    <img class="som-trigger-avatar" src="/images/about/Chris-Reid.webp" alt="Christopher Reid" />
    <span class="som-trigger-label">Ask Chris</span>
  `;

  const card = document.createElement('div');
  card.className = 'som-card';
  card.id = 'som-card';
  card.setAttribute('role', 'dialog');
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

  // Swipe support on card body
  card.addEventListener('touchstart', e => { somTouchStartX = e.touches[0].clientX; }, { passive: true });
  card.addEventListener('touchend', e => {
    const diff = somTouchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40 && somResults.length) {
      if (diff > 0) somChangeResult(1);
      else somChangeResult(-1);
    }
  });

  somRenderStep();
}

function somToggle() {
  somOpen = !somOpen;
  document.getElementById('som-card').classList.toggle('open', somOpen);
}

// ── Render question step ──────────────────────────────────────
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
                data-value="${c.value}">${c.label}</button>
      `).join('')}
    </div>
    ${somStep > 0 ? `<div class="som-nav"><button class="som-back">Back</button></div>` : ''}
  `;

  body.querySelectorAll('.som-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      somAnswers[step.key] = btn.dataset.value;
      body.querySelectorAll('.som-choice').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      setTimeout(() => {
        if (somStep < SOM.steps.length - 1) {
          somStep++;
          somRenderStep();
        } else {
          somResults     = SOM.recommend(somAnswers);
          somResultIndex = 0;
          somRenderResult();
        }
      }, 180);
    });
  });

  const back = body.querySelector('.som-back');
  if (back) back.addEventListener('click', () => { somStep--; somRenderStep(); });
}

// ── Render result carousel ────────────────────────────────────
function somRenderResult() {
  const body = document.getElementById('som-body');
  const rec  = somResults[somResultIndex];
  const total = somResults.length;

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
    <div class="som-carousel-nav">
      <button class="som-carousel-arrow" id="som-prev" ${somResultIndex === 0 ? 'disabled' : ''}>&#8592;</button>
      <div class="som-carousel-dots">
        ${Array.from({ length: total }, (_, i) =>
          `<span class="som-carousel-dot ${i === somResultIndex ? 'active' : ''}"></span>`
        ).join('')}
      </div>
      <button class="som-carousel-arrow" id="som-next" ${somResultIndex === total - 1 ? 'disabled' : ''}>&#8594;</button>
    </div>
    <button class="som-restart">Start over</button>
  `;

  document.getElementById('som-prev').addEventListener('click', () => somChangeResult(-1));
  document.getElementById('som-next').addEventListener('click', () => somChangeResult(1));
  body.querySelector('.som-restart').addEventListener('click', () => {
    somStep = 0; somAnswers = {}; somResults = []; somResultIndex = 0;
    somRenderStep();
  });
}

function somChangeResult(dir) {
  const next = somResultIndex + dir;
  if (next < 0 || next >= somResults.length) return;
  somResultIndex = next;
  somRenderResult();
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', somBuild);
