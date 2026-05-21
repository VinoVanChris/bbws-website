// Fetches live price + stock from Barnet at build time.
// Data is baked into the HTML; no browser fetch required.
// Keys are Barnet product IDs (strings).
const PRODUCT_IDS = [
  // ── Wines (pairings + party) ──────────────────────────────
  '5137095', // Hugel Gentil
  '5136405', // Sperling Speritz Pet Nat
  '5152901', // Beaujolais Villages Drouhin
  '5137775', // Champagne Duval-Leroy Brut
  '5137456', // JC Boisset Les Ursulines
  '5137768', // Domaine Baudry Les Granges
  '5136585', // Perrin Cotes du Rhone Villages
  '5207395', // Pamplemousse Jus Foch Nouveau
  '5136959', // Astro Bunny Pet-Nat
  '5190638', // Orofino Gamay
  '5136731', // Attems Sauvignon Blanc
  '5137205', // Averill Creek Chardonnay
  '5137756', // Michele Chiarlo Le Orme Barbera
  '5137673', // Escorihuela 1884 Malbec
  '5136921', // Argyle Reserve Pinot Noir
  '5237614', // Tantalus Riesling
  '5137539', // Bottega Gold Prosecco
  '5136539', // Chateau Petit Vedrines Sauternes
  '5136825', // Yoshi No Gawa Honjozo
  // ── Beer (party planner) ──────────────────────────────────
  '5136855', // Four Winds Featherweight IPA 6PK
  '5136425', // Driftwood Fat Tug IPA 4PK
  '5137453', // Parallel 49 Craft Lager 6PK
  '5182416', // Backcountry Sh*tty Kitty Lager 4PK
  '5137412', // Heineken 12PK
  '5136481', // Stella Artois 12PK
  // ── Spirits (party planner) ───────────────────────────────
  '5137692', // Montelobos Mezcal
  '5137700', // Johnnie Walker Black Label 12yr
  '5136371', // Basil Hayden's Kentucky Bourbon
  '5136625', // Glenlivet 12yr
  '5137260', // Hendrick's Flora Adora Gin
  '5137656', // Aviation American Gin
  '5136378', // Absolut Vodka
  '5137525', // Tito's Handmade Vodka
  '5136549', // Appleton Estate Signature Blend Rum
  '5240757', // Kraken Black Spiced Rum
  '5137267', // Casamigos Blanco Tequila
  '5137603', // Don Julio Reposado Tequila
];

const BASE      = 'https://barnetnetwork.com/api/shop/739-360/products/';
const SHOP_BASE = 'https://barnetnetwork.com/shop/739-360/products/';

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

module.exports = async function () {
  const results = {};
  await Promise.all(
    PRODUCT_IDS.map(async (id) => {
      try {
        const res = await fetch(BASE + id);
        if (!res.ok) return;
        const d = await res.json();
        const slug = toSlug(d.description || d.name || id);
        results[id] = {
          price:   parseFloat(d.price || d.net_price || 0).toFixed(2),
          inStock: !!d.available_for_sale,
          url:     SHOP_BASE + id + '-' + slug,
        };
      } catch (_) {}
    })
  );
  return results;
};
