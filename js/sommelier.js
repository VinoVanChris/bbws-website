/* Broadway Beer Wine & Spirits — Virtual Sommelier Widget
   Curated panel with tag-based filtering.
   Swap SOM.filter() for Claude API + Bottlecapps inventory when live.
   ─────────────────────────────────────────────────────────────────── */

const SOM_ENABLED = false; // set to true to activate

const SOM = {

  // ── Quiz steps ────────────────────────────────────────────────
  steps: [
    {
      key: 'occasion',
      question: "What's the occasion?",
      choices: [
        { label: 'Dinner tonight',     value: 'dinner'  },
        { label: 'A gift for someone', value: 'gift'    },
        { label: 'Just for me',        value: 'solo'    },
        { label: 'Something special',  value: 'special' },
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

  // ── Bottle library ────────────────────────────────────────────
  // type:   which quiz answers show this bottle
  // budget: which budget tiers include this bottle
  // tags:   matched by filter chips
  bottles: [

    // RED
    {
      type: ['red', 'surprise'],
      budget: ['low'],
      tags: ['value', 'bold', 'food'],
      name: 'Argentine Malbec',
      sub: 'Mendoza, Argentina',
      quote: 'The grape France let go and Argentina made famous. Rich, dark-fruited, and honest value at this price.',
      price: '$18–25',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: '/blog/malbec-argentina.html',
    },
    {
      type: ['red', 'surprise'],
      budget: ['low'],
      tags: ['value', 'food', 'light'],
      name: 'Côtes du Rhône Rouge',
      sub: 'Southern Rhône, France',
      quote: 'Grenache-led, generous, wildly food-friendly. Southern France has been drinking this for centuries.',
      price: '$20–28',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: null,
    },
    {
      type: ['red', 'surprise'],
      budget: ['low', 'mid'],
      tags: ['natural', 'unusual', 'light'],
      name: 'Natural Red Selection',
      sub: 'Small Producers · Various',
      quote: 'Low-intervention, minimal sulphites, maximum character. Come in and we will find one that changes how you think about red wine.',
      price: '$22–30',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: '/blog/natural-wine-jules-chauvet.html',
    },
    {
      type: ['red'],
      budget: ['low', 'mid'],
      tags: ['light', 'natural', 'food', 'value'],
      name: 'Beaujolais Villages',
      sub: 'Beaujolais, France · Gamay',
      quote: 'Light, bright, and endlessly drinkable. The bottle that convinces people they actually love red wine.',
      price: '$22–32',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: null,
    },
    {
      type: ['red'],
      budget: ['mid'],
      tags: ['unusual', 'food', 'age-worthy', 'light'],
      name: 'Bernard Baudry Chinon',
      sub: 'Loire Valley, France · Cabernet Franc',
      quote: 'He started with a vineyard so small he called it a handkerchief. Today the Baudry name is shorthand for Chinon done right.',
      price: '$35–45',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: '/blog/bernard-baudry-chinon.html',
    },
    {
      type: ['red'],
      budget: ['mid'],
      tags: ['value', 'food', 'unusual'],
      name: "Barbera d'Asti",
      sub: 'Piedmont, Italy',
      quote: 'High acid, low tannin, and a depth that punches well above its price. One of Italy\'s most underrated bottles.',
      price: '$32–42',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: null,
    },
    {
      type: ['red'],
      budget: ['mid'],
      tags: ['light', 'value', 'food'],
      name: 'Willamette Valley Pinot Noir',
      sub: 'Oregon, USA',
      quote: 'Oregon Pinot at this price is one of the best deals in the shop. Earthy, silky, honest in a way Burgundy charges three times as much for.',
      price: '$40–55',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: null,
    },
    {
      type: ['red'],
      budget: ['mid', 'high'],
      tags: ['local', 'light', 'food'],
      name: 'BC Pinot Noir Selection',
      sub: 'Okanagan, British Columbia',
      quote: 'The Okanagan is producing Pinot that belongs in this conversation. Come in and we will pull the right one.',
      price: '$38–65',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: '/blog/bc-wine-month.html',
    },
    {
      type: ['red', 'surprise'],
      budget: ['high', 'unlimited'],
      tags: ['local', 'unusual', 'age-worthy', 'bold'],
      name: 'SKAHA Vineyard Equus 2018',
      sub: 'Okanagan, British Columbia',
      quote: 'Ancient soils, 250 cases, a boutique Okanagan operation doing something genuinely special. One of the best BC bottles on our shelf.',
      price: '$65–80',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: '/blog/skaha-vineyard-equus.html',
    },
    {
      type: ['red'],
      budget: ['high', 'unlimited'],
      tags: ['light', 'age-worthy'],
      name: 'Village Burgundy Pinot Noir',
      sub: 'Burgundy, France',
      quote: 'Entry-level Burgundy from a producer worth knowing. The terroir is doing the work — all you have to do is pour it.',
      price: '$70–90',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: null,
    },
    {
      type: ['red'],
      budget: ['high', 'unlimited'],
      tags: ['local', 'age-worthy', 'unusual', 'bold'],
      name: 'Okanagan Cabernet Franc',
      sub: 'British Columbia',
      quote: 'BC Cab Franc is one of the Okanagan\'s great secrets. Structured, earthy, and age-worthy in a way that will surprise you.',
      price: '$60–85',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: '/blog/bc-wine-month.html',
    },
    {
      type: ['red'],
      budget: ['unlimited'],
      tags: ['bold', 'age-worthy', 'unusual'],
      name: 'Brunello di Montalcino',
      sub: 'Tuscany, Italy · Sangiovese',
      quote: 'Italy at its most serious. Structured, long-lived, and worth every dollar when you open it at the right moment.',
      price: '$95–140',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: null,
    },

    // WHITE
    {
      type: ['white', 'surprise'],
      budget: ['low', 'mid'],
      tags: ['crisp', 'food', 'value'],
      name: 'Attems Sauvignon Blanc',
      sub: 'Friuli, Italy',
      quote: 'Crisp, precise, and a natural at the table. One of those bottles that makes everything alongside it taste better.',
      price: '$24–28',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: null,
    },
    {
      type: ['white'],
      budget: ['low', 'mid'],
      tags: ['natural', 'unusual', 'crisp'],
      name: 'Natural White Selection',
      sub: 'Small Producers · Various',
      quote: 'Skin contact, low intervention, alive in the glass. Come in and we will find one suited to where you are at.',
      price: '$24–35',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: '/blog/natural-wine-jules-chauvet.html',
    },
    {
      type: ['white'],
      budget: ['mid', 'high'],
      tags: ['unusual', 'crisp', 'age-worthy', 'food'],
      name: 'Domaine Weinbach Riesling',
      sub: 'Alsace, France',
      quote: 'Alsace Riesling at its most honest — floral, mineral, dry in a way that makes most other whites feel underdressed.',
      price: '$42–55',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: null,
    },
    {
      type: ['white', 'surprise'],
      budget: ['mid'],
      tags: ['local', 'rich', 'food'],
      name: 'Okanagan Chardonnay Selection',
      sub: 'British Columbia',
      quote: 'BC Chardonnay has arrived. We carry several that will change your mind about the grape — come in and we will pull the right one.',
      price: '$28–45',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: '/blog/bc-wine-month.html',
    },
    {
      type: ['white'],
      budget: ['high', 'unlimited'],
      tags: ['rich', 'age-worthy', 'unusual', 'food'],
      name: 'White Burgundy Selection',
      sub: 'Burgundy, France · Chardonnay',
      quote: 'Burgundy white at this level is one of the most satisfying bottles you can open. We keep a few worth knowing.',
      price: '$75–120',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: null,
    },
    {
      type: ['white'],
      budget: ['high', 'unlimited'],
      tags: ['local', 'unusual', 'crisp'],
      name: 'BC White Rhone Blend',
      sub: 'Okanagan, British Columbia',
      quote: 'Roussanne and Viognier from the Okanagan. The kind of bottle that earns a long dinner conversation.',
      price: '$55–80',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: '/blog/bc-wine-month.html',
    },

    // BUBBLES
    {
      type: ['bubbles', 'surprise'],
      budget: ['low', 'mid'],
      tags: ['value', 'food'],
      name: "Crémant d'Alsace",
      sub: 'Alsace, France',
      quote: 'All the elegance of Champagne method, none of the price anxiety. The smartest pour at any table.',
      price: '$28–36',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: null,
    },
    {
      type: ['bubbles'],
      budget: ['low', 'mid'],
      tags: ['natural', 'unusual', 'grower'],
      name: 'Pét-Nat Selection',
      sub: 'Various Regions',
      quote: 'Pétillant naturel — ancient method, lively bubbles, zero pretension. The wine world\'s most honest fizz.',
      price: '$26–38',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: null,
    },
    {
      type: ['bubbles', 'surprise'],
      budget: ['mid', 'high'],
      tags: ['local', 'unusual'],
      name: 'Okanagan Sparkling Selection',
      sub: 'British Columbia',
      quote: 'BC sparkling is having a moment and it deserves it. Bright, local, and something to talk about.',
      price: '$32–55',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: '/blog/bc-wine-month.html',
    },
    {
      type: ['bubbles'],
      budget: ['high', 'unlimited'],
      tags: ['unusual', 'grower', 'age-worthy'],
      name: 'Grower Champagne Selection',
      sub: 'Champagne, France',
      quote: 'Grower Champagne is the answer to everything. We carry several you will not find at the government store — come in and we will pick one.',
      price: '$65–95',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: null,
    },
    {
      type: ['bubbles'],
      budget: ['unlimited'],
      tags: ['grower', 'age-worthy', 'unusual'],
      name: 'Blanc de Blancs Champagne',
      sub: 'Champagne, France · 100% Chardonnay',
      quote: 'Pure Chardonnay Champagne. Precise, mineral, and built to age. The connoisseur\'s pour.',
      price: '$85–130',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: null,
    },

    // SPIRITS
    {
      type: ['spirits', 'surprise'],
      budget: ['mid', 'high', 'unlimited'],
      tags: ['sweet', 'smooth'],
      name: 'The Dalmore 12 Year Old',
      sub: 'Highland, Scotland · 40% ABV',
      quote: 'The gateway into the Dalmore house style. Sherry-finished, dark-fruited, and honest about what it is. Whisky Advocate 88 pts.',
      price: '$133.34',
      shopUrl: 'https://shop.broadwaybeerwine.ca/product/s-20089/p-449456/buy-the-dalmore-12-year-old',
      learnUrl: null,
    },
    {
      type: ['spirits'],
      budget: ['mid'],
      tags: ['sweet', 'smooth', 'value'],
      name: 'Diplomatico Reserva Exclusiva',
      sub: 'Venezuela · 8 Year · 40% ABV',
      quote: 'Rich, slow, and unapologetically sweet. Dark toffee, orange peel, a finish that lingers. The bottle that converts rum sceptics.',
      price: '$62–70',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: null,
    },
    {
      type: ['spirits', 'surprise'],
      budget: ['mid', 'high'],
      tags: ['smoky', 'unusual'],
      name: 'Ardbeg 10 Year Old',
      sub: 'Islay, Scotland · 46% ABV',
      quote: 'Smoke, sea salt, and a medicinal edge that earns its reputation. For the drinker who wants to feel something.',
      price: '$88–96',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: null,
    },
    {
      type: ['spirits'],
      budget: ['mid'],
      tags: ['smooth', 'value'],
      name: 'Glenfiddich 12 Year Old',
      sub: 'Speyside, Scotland · 40% ABV',
      quote: 'The world\'s most approachable single malt, and rightly so. Pear, vanilla, oak — the gateway Scotch.',
      price: '$58–65',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: null,
    },
    {
      type: ['spirits'],
      budget: ['low', 'mid'],
      tags: ['smoky', 'unusual'],
      name: 'Mezcal Joven Selection',
      sub: 'Oaxaca, Mexico · Espadín',
      quote: 'Smoke from the earth, not the barrel. Complex, rustic, and unlike anything else in the spirits world.',
      price: '$55–70',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: null,
    },
    {
      type: ['spirits'],
      budget: ['low', 'mid'],
      tags: ['local', 'unusual'],
      name: 'BC Craft Gin Selection',
      sub: 'British Columbia',
      quote: 'BC botanicals, BC water, made by people who care. We carry several and will match you to the right one.',
      price: '$42–62',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: null,
    },
    {
      type: ['spirits'],
      budget: ['mid', 'high'],
      tags: ['unusual', 'smooth'],
      name: 'Japanese Whisky Selection',
      sub: 'Japan',
      quote: 'Precision in a glass. Japanese whisky earns its reputation every time. We have a short but considered selection.',
      price: '$70–110',
      shopUrl: 'https://shop.broadwaybeerwine.ca',
      learnUrl: null,
    },
  ],

  // ── Chip sets per drink type ──────────────────────────────────
  chips: {
    red:      ['Lighter style', 'Full-bodied', 'Natural wine', 'Something local', 'Best value', 'Unusual pick', 'Food-friendly', 'Age-worthy'],
    white:    ['Crisp & dry', 'Rich & textured', 'Natural wine', 'Something local', 'Best value', 'Unusual pick', 'Food-friendly'],
    bubbles:  ['Something local', 'Best value', 'Unusual pick', 'Grower producer', 'Natural / Pét-Nat'],
    spirits:  ['Smoky', 'Sweet & smooth', 'Something local', 'Best value', 'Unusual pick'],
    surprise: ['Lighter style', 'Full-bodied', 'Natural wine', 'Something local', 'Best value', 'Unusual pick'],
  },

  // chip label to internal tag
  chipTag: {
    'Lighter style':      'light',
    'Full-bodied':        'bold',
    'Natural wine':       'natural',
    'Natural / Pét-Nat':  'natural',
    'Something local':    'local',
    'Best value':         'value',
    'Unusual pick':       'unusual',
    'Food-friendly':      'food',
    'Age-worthy':         'age-worthy',
    'Crisp & dry':        'crisp',
    'Rich & textured':    'rich',
    'Grower producer':    'grower',
    'Smoky':              'smoky',
    'Sweet & smooth':     'sweet',
  },

  // readable labels for summary line
  typeLabel: {
    red: 'Red Wine', white: 'White Wine', bubbles: 'Bubbles',
    spirits: 'Spirits', surprise: 'Surprise',
  },
  budgetLabel: {
    low: 'Under $30', mid: '$30–60', high: '$60–100', unlimited: 'No limit',
  },
  occasionLabel: {
    dinner: 'Dinner', gift: 'Gift', solo: 'Just for me', special: 'Special occasion',
  },

  // ── Filter ────────────────────────────────────────────────────
  filter(answers, activeTags) {
    const { type, budget } = answers;

    let pool = this.bottles.filter(b =>
      b.type.includes(type) && b.budget.includes(budget)
    );

    if (activeTags.size > 0) {
      const tagged = pool.filter(b =>
        [...activeTags].some(tag => b.tags.includes(tag))
      );
      if (tagged.length >= 2) pool = tagged;
    }

    return pool;
  },
};

// ── State ─────────────────────────────────────────────────────
let somOpen        = false;
let somStep        = 0;
let somAnswers     = {};
let somActiveFilters = new Set();

// ── Build DOM ─────────────────────────────────────────────────
function somBuild() {
  const trigger = document.createElement('div');
  trigger.className = 'som-trigger';
  trigger.id = 'som-trigger';
  trigger.setAttribute('aria-label', 'Ask Chris — Virtual Sommelier');
  trigger.innerHTML = `
    <img class="som-trigger-avatar" src="/images/about/Chris-Reid.webp" alt="Christopher Reid" />
    <span class="som-trigger-label">Som</span>
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

  somRenderStep();
}

function somToggle() {
  somOpen = !somOpen;
  document.getElementById('som-card').classList.toggle('open', somOpen);
}

// ── Quiz ──────────────────────────────────────────────────────
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
          somActiveFilters = new Set();
          somRenderResults();
        }
      }, 180);
    });
  });

  const back = body.querySelector('.som-back');
  if (back) back.addEventListener('click', () => { somStep--; somRenderStep(); });
}

// ── Results panel ─────────────────────────────────────────────
function somRenderResults() {
  const body   = document.getElementById('som-body');
  const type   = somAnswers.type;
  const chips  = SOM.chips[type] || SOM.chips.surprise;
  const bottles = SOM.filter(somAnswers, somActiveFilters);

  const meta = [
    SOM.occasionLabel[somAnswers.occasion],
    SOM.typeLabel[type],
    SOM.budgetLabel[somAnswers.budget],
  ].filter(Boolean).join(' · ');

  body.innerHTML = `
    <div class="som-results-hd">
      <p class="som-results-label">Here's what I'd pull for you</p>
      <p class="som-results-meta">${meta}</p>
    </div>
    <div class="som-chips">
      ${chips.map(label => `
        <button class="som-chip ${somActiveFilters.has(SOM.chipTag[label]) ? 'active' : ''}"
                data-tag="${SOM.chipTag[label]}">${label}</button>
      `).join('')}
    </div>
    <div id="som-bottle-list"></div>
    <button class="som-restart">Start over</button>
  `;

  somRenderBottles(bottles);

  body.querySelectorAll('.som-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const tag = chip.dataset.tag;
      if (somActiveFilters.has(tag)) {
        somActiveFilters.delete(tag);
        chip.classList.remove('active');
      } else {
        somActiveFilters.add(tag);
        chip.classList.add('active');
      }
      somRenderBottles(SOM.filter(somAnswers, somActiveFilters));
    });
  });

  body.querySelector('.som-restart').addEventListener('click', () => {
    somStep = 0;
    somAnswers = {};
    somActiveFilters = new Set();
    somRenderStep();
  });
}

function somRenderBottles(bottles) {
  const list = document.getElementById('som-bottle-list');
  if (!list) return;

  if (!bottles.length) {
    list.innerHTML = `
      <div class="som-empty">
        <p>Nothing quite matches those filters. Try a different combination — or come in and ask me directly.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = bottles.map(b => `
    <div class="som-bottle">
      <p class="som-bottle-name">${b.name}</p>
      <p class="som-bottle-sub">${b.sub}</p>
      <p class="som-bottle-quote">${b.quote}</p>
      <div class="som-bottle-footer">
        ${b.price ? `<span class="som-bottle-price">${b.price}</span>` : '<span></span>'}
        <div class="som-bottle-links">
          <a href="${b.shopUrl}" target="_blank" rel="noopener" class="som-btn-primary">Shop</a>
        </div>
      </div>
    </div>
  `).join('');
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => { if (SOM_ENABLED) somBuild(); });
