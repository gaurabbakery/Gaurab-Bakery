/* ═══════════════════════════════════════════
   GAURAB BAKERY  —  script.js
═══════════════════════════════════════════ */

const DEFAULT_PRODUCTS = [
  { name:"Chocolate Cake",    desc:"Rich chocolate layered soft cake",        price:"Rs.700", img:"chocolatecake.png"    },
  { name:"Strawberry Cake",   desc:"Fresh cream strawberry delight",           price:"Rs.600", img:"strawberrycake.png"   },
  { name:"ButterScotch Cake", desc:"Buttery cake with rich caramel flavor",    price:"Rs.600", img:"butterscotchcake.png" },
  { name:"BarbieDoll Cake",   desc:"Sweet and creamy barbiedoll cake",         price:"Rs.600", img:"barbiedollcake.png"   },
  { name:"Vanilla Cake",      desc:"Classic soft and fluffy vanilla sponge",   price:"Rs.550", img:"vanillacake.png"      },
  { name:"Black Forest",      desc:"Chocolate sponge with cream and cherries", price:"Rs.750", img:"blackforestcake.png"      },
  { name:"White Forest",      desc:"White chocolate sponge with fresh cream",  price:"Rs.700", img:"whiteforestcake.png"      },
  { name:"Blueberry Cake",    desc:"Soft cake topped with fresh blueberries",  price:"Rs.650", img:"blueberrycake.png"        }
];

const WEIGHT_OPTIONS = [
  { label:"1 Pound",  lbs:1 },
  { label:"2 Pounds", lbs:2 },
  { label:"3 Pounds", lbs:3 },
  { label:"4 Pounds", lbs:4 },
  { label:"5 Pounds", lbs:5 }
];

/* ── Helpers ── */
function getProducts()   { const s=localStorage.getItem("gbProducts"); if(s)return JSON.parse(s); localStorage.setItem("gbProducts",JSON.stringify(DEFAULT_PRODUCTS)); return DEFAULT_PRODUCTS; }
function getCart()       { return JSON.parse(localStorage.getItem("gbCart")     || "[]"); }
function getWishlist()   { return JSON.parse(localStorage.getItem("gbWishlist") || "[]"); }
function saveCart(c)     { localStorage.setItem("gbCart",     JSON.stringify(c)); }
function saveWishlist(w) { localStorage.setItem("gbWishlist", JSON.stringify(w)); }

/* ── FIXED parsePrice: grabs first number from string ── */
/* "Rs.700" → 700,  ".700" would be wrong but this gives 700 correctly */
function parsePrice(s) {
  const m = String(s || "").match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

let products = getProducts();

/* ══════════════════════════════════════════
   ORDER POPUP — same popup used everywhere
══════════════════════════════════════════ */
(function injectPopup() {
  if (document.getElementById("gb-order-overlay")) return;

  const style = document.createElement("style");
  style.textContent = `
    #gb-order-overlay {
      display:none; position:fixed; inset:0; z-index:9999;
      background:rgba(0,0,0,0.55);
      align-items:center; justify-content:center; padding:20px;
    }
    #gb-order-overlay.open { display:flex; }

    #gb-order-popup {
      background:#fff; border-radius:24px;
      padding:26px 22px; width:100%; max-width:360px;
      box-shadow:0 24px 60px rgba(0,0,0,0.22);
      animation:gbPopIn .22s ease;
    }
    @keyframes gbPopIn { from{transform:scale(0.9);opacity:0;} to{transform:scale(1);opacity:1;} }

    #gb-order-popup .pop-img {
      width:100%; height:160px; object-fit:cover;
      border-radius:14px; margin-bottom:14px; display:block; background:#f5f5f5;
    }
    #gb-order-popup .pop-name      { font-size:19px; font-weight:800; color:#1a1a1a; margin-bottom:3px; }
    #gb-order-popup .pop-note      { font-size:12px; color:#aaa; margin-bottom:14px; }
    #gb-order-popup .pop-lbl       { font-size:11px; font-weight:700; color:#888; text-transform:uppercase; letter-spacing:.6px; margin-bottom:8px; }
    #gb-order-popup .pop-weights   { display:flex; flex-wrap:wrap; gap:7px; margin-bottom:16px; }
    #gb-order-popup .pop-w-btn {
      padding:7px 14px; border-radius:20px;
      border:1.5px solid #ddd; background:#fff;
      font-size:13px; font-weight:600; color:#333; cursor:pointer; transition:all .15s;
    }
    #gb-order-popup .pop-w-btn:hover  { border-color:#888; }
    #gb-order-popup .pop-w-btn.active { background:#1a1a1a; color:#fff; border-color:#1a1a1a; }
    #gb-order-popup .pop-price-box {
      background:#f8f8f8; border-radius:13px;
      padding:13px 16px; margin-bottom:18px;
      display:flex; justify-content:space-between; align-items:center;
    }
    #gb-order-popup .pop-price-lbl { font-size:13px; color:#888; font-weight:500; }
    #gb-order-popup .pop-price-val { font-size:22px; font-weight:800; color:#1a1a1a; transition:transform .18s; }
    #gb-order-popup .pop-actions   { display:flex; gap:10px; }
    #gb-order-popup .pop-cancel {
      flex:1; padding:13px; border-radius:14px;
      border:1.5px solid #e0e0e0; background:#fff;
      font-size:14px; font-weight:600; color:#555; cursor:pointer;
    }
    #gb-order-popup .pop-cancel:hover { background:#f5f5f5; }
    #gb-order-popup .pop-confirm {
      flex:2; padding:13px; border-radius:14px;
      border:none; background:#25d366; color:#fff;
      font-size:14px; font-weight:700; cursor:pointer;
      display:flex; align-items:center; justify-content:center; gap:6px;
      transition:opacity .15s;
    }
    #gb-order-popup .pop-confirm:hover { opacity:.88; }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "gb-order-overlay";
  overlay.innerHTML = `
    <div id="gb-order-popup">
      <img class="pop-img" id="popImg" src="" alt="">
      <div class="pop-name" id="popName"></div>
      <div class="pop-note" id="popNote"></div>
      <div class="pop-lbl">Select Weight</div>
      <div class="pop-weights" id="popWeights"></div>
      <div class="pop-price-box">
        <div class="pop-price-lbl">Total Price</div>
        <div class="pop-price-val" id="popPriceVal"></div>
      </div>
      <div class="pop-actions">
        <button class="pop-cancel"  onclick="closeOrderPopup()">Cancel</button>
        <button class="pop-confirm" onclick="confirmOrderPopup()">📲 Order on WhatsApp</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeOrderPopup(); });
})();

/* Popup state */
let _popItem      = null;
let _popBasePrice = 0;
let _popWeight    = WEIGHT_OPTIONS[0];

function openOrderPopup(item) {
  _popItem      = item;
  /* basePrice is the 1-pound price — stored on item, or parsed from item.price */
  _popBasePrice = item.basePrice || parsePrice(item.price);
  _popWeight    = WEIGHT_OPTIONS[0];

  document.getElementById("popImg").src          = item.img;
  document.getElementById("popImg").alt          = item.name;
  document.getElementById("popName").textContent = item.name;
  document.getElementById("popNote").textContent = `Rs.${_popBasePrice} per pound`;

  document.getElementById("popWeights").innerHTML = WEIGHT_OPTIONS.map((w,i) =>
    `<button class="pop-w-btn${i===0?" active":""}" onclick="selectPopWeight(${i})">${w.label}</button>`
  ).join("");

  refreshPopPrice();
  document.getElementById("gb-order-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function selectPopWeight(idx) {
  _popWeight = WEIGHT_OPTIONS[idx];
  document.querySelectorAll("#popWeights .pop-w-btn").forEach((b,i) =>
    b.classList.toggle("active", i===idx));
  refreshPopPrice();
}

function refreshPopPrice() {
  const total = _popBasePrice * _popWeight.lbs;
  const el    = document.getElementById("popPriceVal");
  el.textContent     = `Rs.${total}`;
  el.style.transform = "scale(1.12)";
  setTimeout(() => el.style.transform = "scale(1)", 180);
}

function closeOrderPopup() {
  document.getElementById("gb-order-overlay").classList.remove("open");
  document.body.style.overflow = "";
}

function confirmOrderPopup() {
  if (!_popItem) return;
  const total = _popBasePrice * _popWeight.lbs;
  const text  =
    `Hello! I want to order from Gaurab Bakery:\n\n` +
    `🎂 Cake   : ${_popItem.name}\n` +
    `⚖️ Weight : ${_popWeight.label}\n` +
    `💰 Price  : Rs.${total}\n\n` +
    `Please confirm my order. Thank you!`;
  window.open(`https://wa.me/9779860228877?text=${encodeURIComponent(text)}`);
  closeOrderPopup();
}

/* ══════════════════════════════════════════
   RIPPLE
══════════════════════════════════════════ */
document.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const circle = document.createElement("span");
  const d = Math.max(btn.offsetWidth, btn.offsetHeight);
  const r = btn.getBoundingClientRect();
  circle.style.cssText = `
    position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);
    width:${d}px;height:${d}px;pointer-events:none;
    left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px;
    transform:scale(0);animation:gbRipple .5s linear;z-index:10;`;
  if (getComputedStyle(btn).position==="static") btn.style.position="relative";
  btn.style.overflow="hidden";
  btn.appendChild(circle);
  setTimeout(()=>circle.remove(),550);
});
(function(){
  if(document.getElementById("gb-ripple-kf"))return;
  const s=document.createElement("style");
  s.id="gb-ripple-kf";
  s.textContent="@keyframes gbRipple{to{transform:scale(3);opacity:0;}}";
  document.head.appendChild(s);
})();

/* ══════════════════════════════════════════
   WISHLIST
══════════════════════════════════════════ */
function toggleWishlist(name, btn) {
  let wl=getWishlist(), i=wl.indexOf(name);
  if(i===-1){wl.push(name);btn.textContent="❤️";}
  else{wl.splice(i,1);btn.textContent="🤍";}
  saveWishlist(wl);
  btn.style.transform="scale(1.4)";
  setTimeout(()=>btn.style.transform="scale(1)",220);
}

/* ══════════════════════════════════════════
   CARD HTML
══════════════════════════════════════════ */
function cardHTML(p) {
  const safe  = JSON.stringify(p).replace(/"/g,"&quot;");
  const heart = getWishlist().includes(p.name)?"❤️":"🤍";
  return `
    <div class="card" style="cursor:pointer;position:relative;" onclick="openDetail(${safe})">
      <button style="
        position:absolute;top:10px;right:10px;z-index:5;
        background:rgba(255,255,255,0.92);border:none;
        border-radius:50%;width:36px;height:36px;font-size:16px;
        cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.12);
        display:flex;align-items:center;justify-content:center;transition:transform .2s;
      " onclick="event.stopPropagation();toggleWishlist('${p.name.replace(/'/g,"\\'")}',this)"
         title="Wishlist">${heart}</button>

      <div class="img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy"
          onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><rect fill=%22%23f5f5f5%22 width=%22200%22 height=%22200%22/><text x=%2250%%22 y=%2252%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2248%22>🎂</text></svg>'">
      </div>

      <div class="content">
        <h2>${p.name}</h2>
        <p>${p.desc}</p>
        <div class="price">${p.price} <span style="font-size:11px;font-weight:400;opacity:0.6;">/ pound</span></div>
        <div class="btn-row">
          <button class="order"
            onclick="event.stopPropagation();openOrderPopup(${safe})">Order Now</button>
          <button class="cart"
            onclick="event.stopPropagation();addToCart(${safe},this)">Add to Cart</button>
        </div>
      </div>
    </div>`;
}

/* ══════════════════════════════════════════
   SKELETON LOADER
══════════════════════════════════════════ */
function showSkeletons(n) {
  const st=`<style id="gb-skel-css">
    .skel{border-radius:12px;overflow:hidden;background:#ebebeb;}
    .skel::after{content:'';display:block;height:100%;
      background:linear-gradient(90deg,#ebebeb 25%,#ddd 50%,#ebebeb 75%);
      background-size:200% 100%;animation:shimmer 1.4s infinite;}
    @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
    .sk-card{border-radius:16px;overflow:hidden;background:#fff;border:1px solid #f0f0f0;}
    .sk-img{height:180px;}.sk-line{height:14px;margin:12px 16px 0;border-radius:7px;}
    .sk-short{width:55%;}
  </style>`;
  const cards=Array.from({length:n},()=>`
    <div class="sk-card">
      <div class="skel sk-img"></div>
      <div class="skel sk-line"></div>
      <div class="skel sk-line sk-short"></div>
      <div class="skel sk-line" style="margin-bottom:16px"></div>
    </div>`).join("");
  const g=document.getElementById("productGrid");
  if(g)g.innerHTML=st+cards;
}

/* ══════════════════════════════════════════
   LOAD PRODUCTS
══════════════════════════════════════════ */
function loadProducts() {
  products=getProducts();
  showSkeletons(products.length||4);
  setTimeout(()=>{
    const g=document.getElementById("productGrid");
    if(g)g.innerHTML=products.map(cardHTML).join("");
  },500);
}

/* ══════════════════════════════════════════
   LIVE SEARCH
══════════════════════════════════════════ */
let searchTimer;
function searchProduct() {
  clearTimeout(searchTimer);
  searchTimer=setTimeout(()=>{
    const q=(document.getElementById("search")?.value||"").toLowerCase().trim();
    const fl=products.filter(p=>p.name.toLowerCase().includes(q)||p.desc.toLowerCase().includes(q));
    const g=document.getElementById("productGrid");
    if(!g)return;
    g.innerHTML=fl.length
      ?fl.map(cardHTML).join("")
      :`<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#999;font-size:15px;">
          🔍 No results for "<strong style='color:#555'>${q}</strong>"
        </div>`;
  },260);
}
document.addEventListener("DOMContentLoaded",()=>{
  const s=document.getElementById("search");
  if(s){s.addEventListener("input",searchProduct);s.setAttribute("placeholder","Search cakes...");}
});

/* ══════════════════════════════════════════
   ADD TO CART  — stores basePrice for popup
══════════════════════════════════════════ */
function addToCart(item, btn) {
  const cart=getCart();
  const base=parsePrice(item.price);
  const ex=cart.find(c=>c.name===item.name&&!c.weight);
  if(ex) ex.qty=(ex.qty||1)+1;
  else   cart.push({...item, qty:1, basePrice:base});
  saveCart(cart);
  updateCartBadge();

  if(btn){
    const orig=btn.textContent;
    btn.textContent="✓ Added";
    btn.style.background="#34c759";
    btn.style.color="#fff";
    btn.style.borderColor="#34c759";
    setTimeout(()=>{
      btn.textContent=orig;
      btn.style.background="";
      btn.style.color="";
      btn.style.borderColor="";
    },1800);
  }
  const badge=document.getElementById("cartCount");
  if(badge){badge.style.transform="scale(1.7)";setTimeout(()=>badge.style.transform="scale(1)",300);}
}

/* ══════════════════════════════════════════
   CART BADGE
══════════════════════════════════════════ */
function updateCartBadge() {
  const total=getCart().reduce((s,c)=>s+(c.qty||1),0);
  const el=document.getElementById("cartCount");
  if(el){el.innerText=total;el.style.transition="transform .3s";}
}

/* ══════════════════════════════════════════
   OPEN DETAIL WINDOW
══════════════════════════════════════════ */
function openDetail(p) {
  const params=new URLSearchParams({name:p.name,desc:p.desc,price:p.price,img:p.img});
  window.open("product.html?"+params.toString(),"_blank","width=980,height=820,scrollbars=yes,resizable=yes");
}

function goCart() { window.location.href="cart.html"; }

loadProducts();
updateCartBadge();
