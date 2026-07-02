// Mock Product Data
const productsData = [
    {
        id: 1,
        title: "Wireless Noise-Canceling Headphones",
        category: "electronics",
        price: 299,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500"
    },
    {
        id: 2,
        title: "Minimalist Cotton T-Shirt",
        category: "clothing",
        price: 25,
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=500"
    },
    {
        id: 3,
        title: "Smart Fitness Watch",
        category: "electronics",
        price: 199,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=500"
    },
    {
        id: 4,
        title: "Leather Classic Wallet",
        category: "accessories",
        price: 45,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=500"
    },
    {
        id: 5,
        title: "Ultra-Wide Gaming Monitor",
        category: "electronics",
        price: 499,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=500"
    },
    {
        id: 6,
        title: "Polarized Sunglasses",
        category: "accessories",
        price: 120,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=500"
    },
    {
        id: 7,
        title: "Denim Jacket",
        category: "clothing",
        price: 89,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=500"
    },
    {
        id: 8,
        title: "Mechanical Keyboard",
        category: "electronics",
        price: 150,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=500"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('products-grid');
    const noProductsMsg = document.getElementById('no-products');
    const productCountSpan = document.getElementById('product-count');
    
    // Filters
    const categoryCheckboxes = document.querySelectorAll('.category-filter');
    const priceFilter = document.getElementById('price-filter');
    const priceValue = document.getElementById('price-value');
    const resetBtn = document.getElementById('reset-filters');
    const sortSelect = document.getElementById('sort-select');

    let currentProducts = [...productsData];

    // Initial Render
    renderProducts();

    // Event Listeners for Filters and Sorting
    categoryCheckboxes.forEach(cb => {
        cb.addEventListener('change', applyFiltersAndSort);
    });

    priceFilter.addEventListener('input', (e) => {
        priceValue.textContent = e.target.value;
        applyFiltersAndSort();
    });

    sortSelect.addEventListener('change', applyFiltersAndSort);

    resetBtn.addEventListener('click', () => {
        categoryCheckboxes.forEach(cb => cb.checked = false);
        priceFilter.value = 1000;
        priceValue.textContent = '1000';
        sortSelect.value = 'featured';
        applyFiltersAndSort();
    });

    function applyFiltersAndSort() {
        // 1. Filter by Category
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        let filtered = productsData;
        
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(p => selectedCategories.includes(p.category));
        }

        // 2. Filter by Price
        const maxPrice = parseInt(priceFilter.value);
        filtered = filtered.filter(p => p.price <= maxPrice);

        // 3. Sort
        const sortBy = sortSelect.value;
        if (sortBy === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        } else {
            // 'featured' - sort by ID or just keep original relative order
            filtered.sort((a, b) => a.id - b.id);
        }

        currentProducts = filtered;
        renderProducts();
    }

    function renderProducts() {
        productsGrid.innerHTML = '';
        productCountSpan.textContent = currentProducts.length;

        if (currentProducts.length === 0) {
            noProductsMsg.classList.remove('hidden');
            return;
        }

        noProductsMsg.classList.add('hidden');

        currentProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            // Generate Stars based on rating
            const fullStars = Math.floor(product.rating);
            const halfStar = product.rating % 1 !== 0;
            let starsHTML = '';
            for(let i=0; i<5; i++){
                if(i < fullStars) starsHTML += '★';
                else if(i === fullStars && halfStar) starsHTML += '⯪';
                else starsHTML += '☆';
            }

            card.innerHTML = `
                <div class="product-img" style="background-image: url('${product.image}')">
                    <span class="category-tag">${capitalizeFirst(product.category)}</span>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-rating">${starsHTML} ${product.rating}</div>
                    <div class="product-price">$${product.price}</div>
                    <button class="btn add-to-cart">Add to Cart</button>
                </div>
            `;
            productsGrid.appendChild(card);
        });
    }

    function capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});
