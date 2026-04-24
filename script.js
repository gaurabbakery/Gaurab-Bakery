let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ADD TO CART */
function addToCart(item){
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
  alert(item + " added to cart");
}

/* CART COUNT */
function updateCart(){
  let el = document.getElementById("cartCount");
  if(el) el.innerText = cart.length;
}

/* ORDER NOW */
function orderNow(item){
  let phone = "9779860228877"; // CHANGE THIS
  let url = `https://wa.me/${phone}?text=I%20want%20${encodeURIComponent(item)}`;
  window.open(url, "_blank");
}

/* CART PAGE */
function goCart(){
  window.location.href = "cart.html";
}

/* SEARCH */
function searchProduct(){
  let input = document.getElementById("search").value.toLowerCase();
  let cards = document.getElementsByClassName("card");

  for(let c of cards){
    c.style.display = c.innerText.toLowerCase().includes(input)
      ? "block"
      : "none";
  }
}

updateCart();