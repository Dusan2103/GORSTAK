fetch("/data/data.json")
  .then((response) => response.json())
  .then((data) => {
    const productContainer = document.getElementById("product-container");

    function renderProducts(products) {
      productContainer.innerHTML = "";
      products.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.classList.add("el-wrapper", "mix");
        productElement.setAttribute(
          "data-price",
          product.price.replace("$", "")
        );
        productElement.setAttribute("data-name", product.name.toLowerCase());
        productElement.classList.add(product.type.toLowerCase());

        let productClass = product.type
          .toLowerCase()
          .replace("t-shirt", "tshirt")
          .replace(" ", "-");
        productElement.classList.add(productClass);

        productElement.innerHTML = `
          <div class="box-up">
            <img class="img" src="${product.image}" alt="${
          product.name
        }" data-hover="${product.hover || ""}">
            <div class="img-info">
              <div class="info-inner">
                <span class="p-name">${product.name}</span>
                <span class="p-company">${product.company}</span>
              </div>
              <div class="a-size">Available sizes: 
                <select class="size-select">
                  ${product.sizes
                    .map((size) => `<option value="${size}">${size}</option>`)
                    .join("")}
                </select>
              </div>
            </div>
          </div>
          <div class="box-down">
            <div class="h-bg">
              <div class="h-bg-inner"></div>
            </div>
            <a class="cart" href="#" data-product='${JSON.stringify(product)}'>
              <span class="price">${product.price}</span>
              <span class="add-to-cart">
                <span class="txt">Add to cart</span>
              </span>
            </a>
          </div>
        `;
        productContainer.appendChild(productElement);
      });
    }

    renderProducts(data.products);

    var mixer = mixitup("#product-container", {
      selectors: { target: ".mix" },
      animation: { duration: 350 },
    });

    $("#filter-type").on("change", function () {
      let filterValue = $(this).val();
      if (filterValue) {
        mixer.filter(`.${filterValue}`);
      } else {
        mixer.filter("all");
      }
    });

    $("#filter--text").on("keyup", function () {
      let searchText = $(this).val().toLowerCase();
      let filteredProducts = data.products.filter((product) =>
        product.name.toLowerCase().includes(searchText)
      );
      renderProducts(filteredProducts);
      mixer.forceRefresh();
    });

    $(".js-reset").on("click", function () {
      $("#filter-type").val("");
      $("#filter--text").val("");
      renderProducts(data.products);
      mixer.forceRefresh();
    });

    $("#sort-price").on("change", function () {
      let sortValue = $(this).val();
      mixer.sort(sortValue);
    });
  })
  .catch((error) => console.error("Error loading products:", error));

