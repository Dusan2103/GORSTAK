fetch('/data/data.json')
  .then(response => response.json())
  .then(data => {
    const productContainer = document.getElementById('home-product-container');

    function renderProducts(products) {
      productContainer.innerHTML = '';
      products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('el-wrapper', 'mix');
        productElement.setAttribute('data-price', product.price.replace('$', ''));
        productElement.setAttribute('data-name', product.name.toLowerCase());

        let productClass = product.type.toLowerCase().replace('t-shirt', 'tshirt').replace(' ', '-');
        productElement.classList.add(productClass);

        productElement.innerHTML = `
          <div class="box-up">
            <img class="img" src="${product.image}" alt="${product.name}" data-hover="${product.hover || ''}">
            <div class="img-info">
              <div class="info-inner">
                <span class="p-name">${product.name}</span>
                <span class="p-company">${product.company}</span>
              </div>
              <div class="a-size">Available sizes: <span class="size">${product.sizes.join(', ')}</span></div>
            </div>
          </div>
          <div class="box-down">
            <div class="h-bg">
              <div class="h-bg-inner"></div>
            </div>
            <a class="view-details" href="/model/products/products.html?id=${product.id}">
            <span class="price">${product.price}</span>
            <span class="add-to-cart">
            <span class="txt">View Details</span>
            </span>
            </a>
          </div>
        `;
        productContainer.appendChild(productElement);
      });
    }

    const hoodies = data.products.filter(product => product.type.toLowerCase() === 'hoodie').slice(0, 12);
    renderProducts(hoodies);
  })
  .catch(error => console.error('Error loading products:', error));
