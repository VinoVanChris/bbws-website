// Fetches live price + stock from Barnet at build time.
// Data is baked into the HTML; no browser fetch required.
// Keys are Barnet product IDs (strings).
const PRODUCT_IDS = [
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
  '5137692', // Montelobos Mezcal
  '5137756', // Michele Chiarlo Le Orme Barbera
  '5137673', // Escorihuela 1884 Malbec
  '5136921', // Argyle Reserve Pinot Noir
  '5237614', // Tantalus Riesling
  '5137539', // Bottega Gold Prosecco
  '5136539', // Chateau Petit Vedrines Sauternes
  '5136825', // Yoshi No Gawa Honjozo
];

const BASE = 'https://barnetnetwork.com/api/shop/739-360/products/';

module.exports = async function () {
  const results = {};
  await Promise.all(
    PRODUCT_IDS.map(async (id) => {
      try {
        const res = await fetch(BASE + id);
        if (!res.ok) return;
        const d = await res.json();
        results[id] = {
          price:   parseFloat(d.price || d.net_price || 0).toFixed(2),
          inStock: !!d.available_for_sale,
        };
      } catch (_) {}
    })
  );
  return results;
};
