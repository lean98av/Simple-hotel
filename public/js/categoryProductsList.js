// ============================================
// Scroll Infinito - Category Products
// ============================================
let currentPage = 1;
let grid, trigger, observer, loadingIndicator;
let isLoading = false;

function showLoading() {
    if (loadingIndicator) loadingIndicator.style.display = 'flex';
}

function hideLoading() {
    if (loadingIndicator) loadingIndicator.style.display = 'none';
}

async function loadProducts(page, order, reset = false) {
    if (!categoryId) return;
    if (isLoading) return;
    isLoading = true;
    showLoading();
    try {
        const res = await fetch(`/fetchCategoryAndProducts?categoryId=${categoryId}&page=${page}&order=${order}`);
        const data = await res.json();

        if (reset && grid) {
            grid.innerHTML = '';
            currentPage = 1;
            // re-create observer if it was disconnected
            if (observer) observer.disconnect();
        }

        if (data.products && data.products.length > 0 && grid) {
            data.products.forEach(product => {
                const col = document.createElement('div');
                col.className = 'col-6 col-md-4 col-lg-3';
                col.innerHTML = `
                    <a href="/product/${product.id}" class="text-decoration-none text-reset">
                        <div class="card product-card">
                            ${product.images && product.images.length > 0 ? `
                                <img src="data:image/jpeg;base64,${product.images[0].file}"
                                     class="card-img-top product-img" alt="${product.name}">
                            ` : `<img src='/images/logo.png' class="card-img-top product-img" alt="${product.name}">`}
                            <div class="card-body">
                                <div class="product-price">$${Number(product.price).toLocaleString('es-ES')}</div>
                                <h6 class="card-title product-title">${product.name}</h6>
                            </div>
                        </div>
                    </a>`;
                grid.appendChild(col);
            });
            // if we reset the grid (new order), recreate observer to continue infinite scroll
            if (reset && observer) {
                observer.disconnect();
                createObserver();
            }
            // mark the current page after successful load
            currentPage = page;
            hideLoading();
        } else {
            // no more products: disconnect observer and show end indicator
            if (observer) observer.disconnect();
            const endMsg = document.createElement('div');
            endMsg.className = 'text-center text-muted my-3';
            endMsg.textContent = 'No hay más productos';
            if (grid) grid.parentElement.appendChild(endMsg);
            hideLoading();
        }
    } catch (err) {
        console.error('Error loading products', err);
        hideLoading();
    } finally {
        isLoading = false;
    }
}

function createObserver() {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading) {
                const nextPage = currentPage + 1;
                const order = (document.getElementById('orderSelect')?.value) || 'DESC';
                loadProducts(nextPage, order);
            }
    }, { root: null, rootMargin: '200px', threshold: 0.1 });
    if (trigger) observer.observe(trigger);
}

function _onScrollFallback() {
    if (isLoading) return;
    const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 300);
    if (nearBottom) {
        const next = currentPage + 1;
        console.debug('scroll fallback triggered, loading page', next);
        loadProducts(next, document.getElementById('orderSelect')?.value || 'DESC');
    }
}

// Inicializar scroll infinito
function initScrollInfiniteProducts() {
    grid = document.getElementById('productsGrid');
    // loading indicator is separate
    loadingIndicator = document.getElementById('loadingIndicator');
    const orderSelect = document.getElementById('orderSelect');
    trigger = document.getElementById('scrollTrigger');
    if (!grid || !trigger) return;

    currentPage = parseInt(grid.dataset.currentPage) || 1;
    console.debug('initScrollInfiniteProducts', { categoryId, currentPage, gridChildren: grid.children.length });

    // if an orderSelect exists, attach change handler
    if (orderSelect) {
        // Also add click listener to the hidden input to trigger the dropdown
        orderSelect.addEventListener('click', () => {
            const btn = document.querySelector('.filter-dropdown-btn');
            if (btn) {
                const bsDropdown = new bootstrap.Dropdown(btn);
                bsDropdown.toggle();
            }
        });

        orderSelect.addEventListener('change', () => {
            const order = orderSelect.value;
            currentPage = 1;
            loadProducts(1, order, true);
        });
    }

    // setup observer and initial load
    createObserver();
    // If the server already rendered products into the grid, don't re-fetch page 1
    if (!grid.children || grid.children.length === 0) {
        loadProducts(currentPage, 'DESC');
    }
}

// Exponer globalmente para que el ejs pueda llamarlo
window.initScrollInfiniteProducts = initScrollInfiniteProducts;
