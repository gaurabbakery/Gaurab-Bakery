// PRODUCT DATABASE
const products = [
  {
    name: "Chocolate Cake",
    desc: "Rich chocolate layered soft cake",
    price: "Rs.700",
    img: "chocolatecake.png"
  },
  {
    name: "Strawberry Cake",
    desc: "Fresh cream strawberry delight",
    price: "Rs.600",
    img: "strawberrycake.png"
  },
  {
    name: "ButterScotch Cake",
    desc: "Buttery cake with rich caramel flavor",
    price: "Rs.600",
    img: "butterscotchcake.png"
  },
  {
    name: "BarbieDoll Cake",
    desc: "Sweet and creamy barbiedoll cake",
    price: "Rs.600",
    img: "barbiedollcake.png"
  }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* LOAD PRODUCTS */
function loadProducts(){
  let grid = document.getElementById("productGrid");

  grid.innerHTML = products.map(p => `
    <div class="card">

      <div class="img-wrap">
        <img src="${p.img}">
      </div>

      <div class="content">
        <h2>${p.name}</h2>
        <p>${p.desc}</p>
        <div class="price">${p.price}</div>

        <div class="btn-row">
          <button class="order" onclick='orderNow(${JSON.stringify(p)})'>
            Order Now
          </button>

          <button class="cart" onclick='addToCart(${JSON.stringify(p)})'>
            Add to Cart
          </button>
        </div>
      </div>

    </div>
  `).join("");
}

/* ADD TO CART */
function addToCart(item){
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
  alert(item.name + " added to cart");
}

/* CART COUNT */
function updateCart(){
  let el = document.getElementById("cartCount");
  if(el) el.innerText = cart.length;
}

/* ORDER */
function orderNow(item){
  let phone = "9779860228877";
  let text = `I want to order:\n${item.name}\nPrice: ${item.price}`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`);
}

/* SEARCH */
function searchProduct(){
  let input = document.getElementById("search").value.toLowerCase();
  let filtered = products.filter(p =>
    p.name.toLowerCase().includes(input)
  );

  let grid = document.getElementById("productGrid");
  grid.innerHTML = filtered.map(p => `
    <div class="card">
      <div class="img-wrap">
        <img src="${p.img}">
      </div>

      <div class="content">
        <h2>${p.name}</h2>
        <p>${p.desc}</p>
        <div class="price">${p.price}</div>

        <div class="btn-row">
          <button class="order" onclick='orderNow(${JSON.stringify(p)})'>Order Now</button>
          <button class="cart" onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
        </div>
      </div>
    </div>
  `).join("");
}

/* GO CART */
function goCart(){
  window.location.href = "cart.html";
}

loadProducts();
updateCart();
