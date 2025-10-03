let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = cart.reduce((sum, item) => sum + item.price, 0);

function addToCart(productName, price) {
  cart.push({ name: productName, price: price });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById("cart-items");
  const totalText = document.getElementById("total");

  if (cartList && totalText) {
    cartList.innerHTML = '';
    total = 0;
    cart.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - Rp ${item.price.toLocaleString()}`;
      cartList.appendChild(li);
      total += item.price;
    });
    totalText.textContent = `Total: Rp ${total.toLocaleString()}`;
  }
}
updateCart();