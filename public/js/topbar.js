// Cargar categorías dinámicamente
async function loadCategories() {
    try {
        // Chequear si existe cookie categoriesCache
        const savedCategories = getCategoriesFromCookie();
        
        if (savedCategories && savedCategories.length > 0) {
            // Usar datos guardados sin hacer fetch
            renderCategories(savedCategories);
        } else {
            // Solo cargar si no hay cache
            const res = await fetch('/getCategories');
            const data = await res.json();

            if (data.success && data.categories && data.categories.length > 0) {
                renderCategories(data.categories);
                // Guardar en cookie para futuras cargas
                saveCategoriesToCookie(data.categories);
            }
        }
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}

// Obtener categorías desde cookie
function getCategoriesFromCookie() {
    const cookieName = 'categoriesCache';
    const cookies = getCookieString();
    const cookieMatch = cookies.match(new RegExp(`${cookieName}=(.+?);`));
    if (cookieMatch) {
        try {
            const categories = JSON.parse(decodeURIComponent(cookieMatch[1]));
            return categories;
        } catch (e) {
            console.error('Error al parsear cookie:', e);
        }
    }
    return [];
}

// Guardar categorías en cookie
function saveCategoriesToCookie(categories) {
    const cookieName = 'categoriesCache';
    const encodedData = encodeURIComponent(JSON.stringify(categories));
    document.cookie = `${cookieName}=${encodedData}; path=/; max-age=86400`; // 24 horas
}

// Obtener todas las cookies como string
function getCookieString() {
    let cookieString = '';
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
        cookieString += cookie + ';';
    });
    return cookieString;
}

// Actualizar el badge del carrito
function updateTopBar() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalQuantity = 0;
    cart.forEach(item => {
        totalQuantity += item.quantity;
    });
    const desktopBadge = document.getElementById('desktopCartBadge');
    const mobileBadge = document.getElementById('mobileCartBadge');
    if (desktopBadge) {
        if (totalQuantity > 0) {
            desktopBadge.style.display = 'flex';
            desktopBadge.innerText = totalQuantity;
        } else {
            desktopBadge.style.display = 'none';
        }

    }

    if (mobileBadge) {
        if (totalQuantity > 0) {
            mobileBadge.style.display = 'flex';
            mobileBadge.innerText = totalQuantity;
        } else {
            mobileBadge.style.display = 'none';
        }
    }
}

// Actualizar al cargar el documento (garantiza que badge se calcule en cada render)
document.addEventListener('DOMContentLoaded', () => {
    try { updateTopBar(); } catch(e) { /* no-op */ }
});

// También al restaurar desde bfcache (navegador back/forward cache)
window.addEventListener('pageshow', (event) => {
    try { updateTopBar(); } catch(e) { /* no-op */ }
});

// Escuchar cambios de localStorage desde otras pestañas
window.addEventListener('storage', (e) => {
    if (e.key === 'cart') {
        try { updateTopBar(); } catch(err) { /* no-op */ }
    }
});

// Exponer globalmente por si otros scripts necesitan forzar la actualización
window.updateTopBar = updateTopBar;

// Renderizar categorías
function renderCategories(categories) {
    const megaMenu = document.querySelector('.mega-menu');
    const mobileMenu = document.querySelector('.mobile-menu-links');

    if (!megaMenu || !mobileMenu) return;

    // Limpiar contenido actual
    megaMenu.innerHTML = '';
    mobileMenu.innerHTML = '';

    // Crear contenedor grid para las categorías
    const gridContainer = document.createElement('div');
    gridContainer.className = 'category-grid';
    gridContainer.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;';

    // Crear elementos para cada categoría
    categories.forEach(category => {
        // Desktop: Mega menu card
        const megaCard = document.createElement('a');
        megaCard.href = `/category/${category.id}`;
        megaCard.className = 'category-nav-card';
        megaCard.innerHTML = `
            <img src="${category.images && category.images.length > 0 ? `data:image/jpeg;base64,${category.images[0].file}` : '/images/logo.png'}"
                 alt="${category.name}">
            <div class="category-nav-overlay"><h6>${category.name}</h6></div>
        `;
        gridContainer.appendChild(megaCard);

        // Mobile: Menu button
        const mobileBtn = document.createElement('a');
        mobileBtn.href = `/category/${category.id}`;
        mobileBtn.className = 'mobile-menu-btn';
        mobileBtn.innerHTML = `
            <i class="fas fa-folder"></i>
            ${category.name}
        `;
        mobileMenu.appendChild(mobileBtn);
    });

    megaMenu.appendChild(gridContainer);
}

// Cargar categorías al iniciar
document.addEventListener('DOMContentLoaded', loadCategories);
