$(document).ready(function () {
  // Učitavanje navigacije
  fetch("/model/nav.html")
    .then((response) => response.text())
    .then((data) => $("#nav-placeholder").html(data))
    .catch((error) => console.error("Error loading navigation:", error));

  // Učitavanje podnožja
  fetch("/model/footer.html")
    .then((response) => response.text())
    .then((data) => $("#footer-placeholder").html(data))
    .catch((error) => console.error("Error loading footer:", error));

  // Učitavanje korpe
  $("#cart-container").load("/model/cart.html", function () {
    initializeCart(); // Inicijalizacija nakon učitavanja
  });

  // Efekat glatkog skrolovanja za header
  const header = $('header')[0];
  let lastScrollTop = 0;
  $(window).on('scroll', () => {
    const scrollTop = window.scrollY;
    if (Math.abs(scrollTop - lastScrollTop) > 5) {
      if (header) header.style.transform = `translateY(-${scrollTop * 0.5}px)`;
      lastScrollTop = scrollTop;
    }
  });

  // Efekat talasa
  $('.wave, .wave-R').on('mouseenter', function () {
    const wave = this;
    wave.style.animation = 'none';
    void wave.offsetWidth;
    wave.style.animation = 'returnToZero 3s cubic-bezier(0.15, 0.1, 0.15, 1.0) forwards';
    $(wave).one('animationend', () => {
      wave.style.animation = '';
    });
  });

  // Tekstualni efekat
  const article = $("#animatedArticle")[0];
  if (article) {
    const paragraphs = article.getElementsByTagName("p");
    const customColors = [
      '#FF8080', '#FFCF96', '#39A7FF', '#FFF78A',
      '#FFC7EA', '#88D66C', '#D8B4F8', '#FAF2D3'
    ];

    Array.from(paragraphs).forEach((paragraph) => {
      const originalText = paragraph.textContent;
      paragraph.textContent = "";

      const words = originalText.split(' ');
      let letterIndex = 0;

      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "word";

        for (let i = 0; i < word.length; i++) {
          const letterSpan = document.createElement("span");
          letterSpan.className = "letter";
          letterSpan.textContent = word[i];
          const randomColor = customColors[Math.floor(Math.random() * customColors.length)];
          letterSpan.style.setProperty('--randomColor', randomColor);
          const delay = letterIndex * 0.010;
          letterSpan.style.animation = `letterAnimation 20s forwards ${delay}s`;
          wordSpan.appendChild(letterSpan);
          letterIndex++;
        }

        paragraph.appendChild(wordSpan);

        if (wordIndex < words.length - 1) {
          paragraph.appendChild(document.createTextNode(" "));
          letterIndex++;
        }
      });
    });
  }

// IMPLEMENTACIJA KORPE
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Funkcija za inicijalizaciju korpe na svim stranicama
function initializeCart() {
  let cartButton = $("#cart-button")[0];
  if (!cartButton) {
    cartButton = document.createElement("div");
    cartButton.id = "cart-button";
    document.body.appendChild(cartButton);
  }

  let cartSidebar = $("#cart-sidebar")[0];
  if (!cartSidebar) {
    cartSidebar = document.createElement("div");
    cartSidebar.id = "cart-sidebar";
    cartSidebar.className = "cart-sidebar";
    cartSidebar.innerHTML = `
      <button id="close-cart">X</button>
      <h2>Checkout</h2>
      <h3 id="totalItem">Total Items: 0</h3>
      <div id="cart-items"></div>
      <div class="cart-actions">
        <p>Ukupno: <span id="total-price">0</span> $</p>
        <button id="proceed-checkout">Place Order</button>
        <button id="continue-shopping">Continue Shopping</button>
        <button id="clear-cart">Clear Cart</button>
      </div>
    `;
    document.body.appendChild(cartSidebar);
  }

  const cartItems = $("#cart-items")[0];
  const totalPrice = $("#total-price")[0];
  const cartCount = $("#cart-count")[0];
  const totalItem = $("#totalItem")[0];
  const proceedCheckout = $("#proceed-checkout")[0];
  const continueShopping = $("#continue-shopping")[0];
  const closeCartButton = $("#close-cart")[0];
  const clearCartButton = $("#clear-cart")[0];

  cartItems.style.overflowY = "auto";
  cartItems.style.maxHeight = "calc(100% - 150px)";

  // Initial setup: only show cart button if cart has items, sidebar stays hidden
  if (cart.length === 0) {
    cartButton.style.display = "none";
    cartSidebar.style.display = "none";
  } else {
    cartButton.style.display = "flex";
    cartSidebar.style.display = "none"; // Sidebar hidden by default
    cartSidebar.style.display = "none";
  }

  function openCart() {
    cartSidebar.style.display = "block"; // Ensure sidebar is visible
    cartSidebar.classList.add("open");  // Add the 'open' class for styling
    cartButton.style.display = "none";   // Hide the cart button
    cartSidebar.style.display = "block"; 
    cartSidebar.classList.add("open"); 
    cartButton.style.display = "none";  
  }

  function closeCart() {
    cartSidebar.classList.remove("open"); // Remove 'open' class
    cartSidebar.style.display = "none";   // Hide sidebar
    cartButton.style.display = cart.length > 0 ? "flex" : "none"; // Show button if cart has items
    cartSidebar.classList.remove("open");
    cartSidebar.style.display = "none";   
    cartButton.style.display = cart.length > 0 ? "flex" : "none"; 
  }

  function dynamicCartSection(item) {
    // [This function remains unchanged]
    let boxDiv = document.createElement("div");
    boxDiv.className = "box";

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.style.marginRight = "15px";
    $(checkbox).on("change", (e) => {
      if (!e.target.checked) {
        const index = cart.findIndex(
          (cartItem) =>
            cartItem.name === item.name &&
            cartItem.selectedSize === item.selectedSize
        );
        if (index > -1) {
          cart.splice(index, 1);
          updateCart();
        }
      }
    });
    boxDiv.appendChild(checkbox);

    let boxImg = document.createElement("img");
    boxImg.src = item.image || '';
    boxImg.style.width = "80px";
    boxImg.style.height = "80px";
    boxImg.style.marginRight = "20px";
    boxDiv.appendChild(boxImg);

    let infoDiv = document.createElement("div");
    infoDiv.className = "item-info";
    infoDiv.style.flex = "1";

    let boxh3 = document.createElement("h3");
    boxh3.textContent = item.name || 'Unnamed Item';
    boxh3.style.marginBottom = "10px";
    infoDiv.appendChild(boxh3);

    let sizeSpan = document.createElement("span");
    sizeSpan.textContent = `Size: ${item.selectedSize || 'N/A'}`;
    sizeSpan.style.display = "block";
    sizeSpan.style.marginBottom = "10px";
    infoDiv.appendChild(sizeSpan);

    let quantityDiv = document.createElement("div");
    quantityDiv.className = "quantity-counter";

    let minusBtn = document.createElement("button");
    minusBtn.textContent = "-";
    $(minusBtn).on("click", () => {
      if (item.quantity > 1) {
        item.quantity--;
        updateCart();
      }
    });
    quantityDiv.appendChild(minusBtn);

    let quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.value = item.quantity || 1;
    quantityInput.min = 1;
    quantityInput.style.width = "60px";
    $(quantityInput).on("change", (e) => {
      let newValue = parseInt(e.target.value);
      if (isNaN(newValue) || newValue < 1) {
        newValue = 1;
      }
      item.quantity = newValue;
      e.target.value = newValue;
      updateCart();
    });
    quantityDiv.appendChild(quantityInput);

    let plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    $(plusBtn).on("click", () => {
      item.quantity = (item.quantity || 1) + 1;
      updateCart();
    });
    quantityDiv.appendChild(plusBtn);

    infoDiv.appendChild(quantityDiv);
    boxDiv.appendChild(infoDiv);

    let boxh4 = document.createElement("h4");
    boxh4.textContent = `Amount: $${(
      parseFloat(item.price?.replace("$", "") || 0) * (item.quantity || 1)
    ).toFixed(2)}`;
    boxh4.style.marginLeft = "20px";
    boxDiv.appendChild(boxh4);

    cartItems.appendChild(boxDiv);
  }

  function updateCart() {
    cartItems.innerHTML = "";
    let totalAmount = 0;

    if (cart.length === 0) {
      cartItems.innerHTML = "<p>Korpa je prazna</p>";
      totalItem.textContent = "Total Items: 0";
      cartSidebar.style.display = "none";
      cartButton.style.display = "none";
    } else {
      cart.forEach((item) => {
        totalAmount +=
          parseFloat(item.price?.replace("$", "") || 0) * (item.quantity || 1);
        dynamicCartSection(item);
      });
      totalItem.textContent = `Total Items: ${cart.length}`;
      cartButton.style.display = "flex"; // Show cart button if there are items
      // Sidebar state is managed by openCart/closeCart, not here
      cartButton.style.display = "flex"; 
    
    }

    totalPrice.textContent = totalAmount.toFixed(2);
    cartCount.textContent = cart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  $(document).on("click", ".cart", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const productData = JSON.parse(this.dataset.product || '{}');
    const sizeSelect = $(this)
      .closest(".box-down")
      .prev()
      .find(".size-select")[0];
    const selectedSize = sizeSelect ? sizeSelect.value : productData.sizes?.[0];

    const existingItem = cart.find(
      (item) =>
        item.name === productData.name && item.selectedSize === selectedSize
    );
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      const productWithSize = { ...productData, selectedSize, quantity: 1 };
      cart.push(productWithSize);
    }

    updateCart();
    openCart(); // Explicitly open sidebar when adding a product
    openCart(); 
  });

  $(cartButton).on("click", (e) => {
    e.stopPropagation();
    if (cartSidebar.classList.contains("open")) {
      closeCart();
    } else {
      openCart(); // Explicitly open sidebar when clicking cart button
      openCart(); 
    }
  });

  $(closeCartButton).on("click", (e) => {
    e.stopPropagation();
    closeCart();
  });

  $(clearCartButton).on("click", () => {
    cart = [];
    localStorage.removeItem("cart");
    updateCart();
  });

  if (continueShopping) {
    $(continueShopping).on("click", (e) => {
      e.stopPropagation();
      closeCart();
    });
  }

  if (proceedCheckout) {
    $(proceedCheckout).on("click", (e) => {
      e.stopPropagation();
      if (cart.length > 0) {
        window.location.href = "error404.html";
      }
    });
  }

  updateCart(); // Initial call to set up cart without opening sidebar
  updateCart(); 
}

// [Rest of your code remains unchanged]
});