let productData;
let cart = [];
let count;
let cartItemLen = document.getElementById("cart-item-len");
let productQuantity = document.getElementById("product-quantity");
let productPrice = document.getElementById("product-price-1");
let subTotal = document.getElementById("sub-total-price");
let removeItem = document.getElementById("remove-item");
let cartContainer = document.getElementById("cart-container");
let total = document.getElementById("total-price");
let confirmOrder = document.querySelector(".total-container");
let checkout = document.getElementById("total-price-confirm");
let confirmSubTotal = document.getElementById("confirm-sub-total");
let checkoutTotal = document.getElementById("checkout");
let modelContainer = document.querySelector("#modal-container");
let cartConfirmation = document.querySelector("#cart-confirmation");
fetch("items.json")
  .then((res) => res.json())
  .then((data) => {
    let productContainer = document.getElementById("productContainer");
    productData = data;
    count = document.querySelector(".qun-input");
    productData.forEach((card) => {
      productContainer.innerHTML += `
        <div class="card">
                <div class="card-body">
                  <img
                    class="product-img"
                    src="${card.img}"
                    alt="${card.name} "
                  />
                  <div class="cart-action">
                    <button class="add-to-cart" onclick = 'addToCart(${
                      card.id
                    },this)'>
                      <img
                        src="images/icon-add-to-cart.svg"
                        alt="Add to cart icon"
                      />
                      Add to cart
                    </button>
                    <div class="add-to-cart-hover">
                      <span onclick = 'decrement(${card.id},this)'
                        ><img src="images/icon-decrement-quantity.svg" alt=""
                      /></span>
                      <input type='number' class='qun-input' value = '${
                        card.quantity
                      }'>
                      <span onclick = 'increment(${card.id},this)' 
                        ><img src="images/icon-increment-quantity.svg" alt=""  
                      /></span>
                    </div>
                  </div>
                </div>
                <div class="card-footer">
                  <span class="product-type">${card.type}</span>
                  <h4 class="product-name">${card.name}</h4>
                  <p>$${Number(card.price).toFixed(2)}</p>
                </div>
              </div>
        `;
    });
  });
function addToCart(id, button) {
  cart.push(productData[id]);
  button.classList.add("order");
  console.log(cart);
  updateCart();
}
function increment(id, button) {
  productData[id].quantity++;
  const cartItem = cart.find((item) => item.id === id);
  if (cartItem) {
    cartItem.quantity = productData[id].quantity;
    const inputField = button.previousElementSibling;
    inputField.value = cartItem.quantity;
  }
  updateCart();
}
function decrement(id, button) {
  if (productData[id].quantity > 0) {
    productData[id].quantity--;
    const cartItem = cart.find((item) => item.id === id);
    if (cartItem) {
      cartItem.quantity = productData[id].quantity;
      const inputField = button.nextElementSibling;
      inputField.value = cartItem.quantity;
    }
  }
  updateCart();
}
function updateCart() {
  cartItemLen.textContent = `(${cart.length})`;
  displayCartItem();
  updateModal();
}

function removeItemFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  const product = productData.find((item) => item.id === id);
  if (product) {
    product.quantity = 1;
  }
  const addButton = document.querySelector(
    `.add-to-cart[onclick*='addToCart(${id},']`
  );
  addButton.classList.remove("order");
  updateCart();
}

function displayCartItem() {
  if (cart.length === 0) {
    cartContainer.innerHTML = `<div class="empty-cart">
    <img src="images/illustration-empty-cart.svg" alt="">
    <h6>Your items will appear here</h6>
  </div>`;
    confirmOrder.style.display = "none";
    return;
  }
  if (cart.length > 0) {
    cartContainer.innerHTML = "";
    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("check-out-item");
      cartItem.innerHTML = `
      <div class="product-content">  
        <h6>${item.name}</h6>
        <p>
          <span id="product-quantity">${item.quantity}x </span>
          <span id="product-price-1"> @ $${item.price.toFixed(2)} </span>
          <span id="sub-total-price">${(item.quantity * item.price).toFixed(
            2
          )}</span>
        </p>
      </div>
      <div class="remove-item">
        <button class="remove" data-id="${item.id}">&times;</button>
      </div>
    `;
      cartContainer.appendChild(cartItem);
    });
    document.querySelectorAll(".remove").forEach((button) => {
      button.addEventListener("click", (event) => {
        const id = parseInt(event.target.getAttribute("data-id"));
        removeItemFromCart(id);
      });
    });
    total.textContent =
      "$" +
      cart
        .reduce((acc, item) => {
          return acc + item.price * item.quantity;
        }, 0)
        .toFixed(2);
  }
  confirmOrder.style.display = "block";
}
function displayModal() {
  modelContainer.classList.remove("hide");
}
function updateModal() {
  cartConfirmation.innerHTML = "";
  cart.forEach((item) => {
    const confirmList = document.createElement("div");
    confirmList.classList.add("confirm-list");
    confirmList.innerHTML = `
      <div class="confirm-item">
        <div class="product-content-confirm">
          <img src="${item.img}" alt="">
          <div>
            <h5>${item.name}</h5>
            <p>
              <span id="confirm-quantity" style="color: #c83b0f;">${item.quantity} </span>
              <span id="confirm-price" style="color: #948f8f; font-weight: normal;"> @ $${item.price.toFixed(2)}</span>
            </p>
          </div>
        </div>
        <div class="confirm-sub-total">
          <p><span id="confirm-sub-total">$${(item.price * item.quantity).toFixed(2)}</span> </p>
        </div>
      </div>
    `;
    cartConfirmation.appendChild(confirmList);
  });

  const orderTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  const totalContainer = document.createElement("div");
  totalContainer.classList.add("total-container");
  totalContainer.innerHTML = `
    <div class="total">
      <h4>Order Total: </h4>
      <h2 id="total-price-confirm">$${orderTotal}</h2>
    </div>
  `;
  cartConfirmation.appendChild(totalContainer);
}

checkoutTotal.addEventListener("click", displayModal);

updateCart();
