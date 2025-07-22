// Menu Builder JavaScript functionality

// Menu data
const menuData = {
    starters: [
        {
            id: 'samosas',
            name: 'Samosas',
            description: 'Crispy pastries filled with spiced vegetables or meat',
            price: 50,
            image: 'Golden crispy samosas with dipping sauce'
        },
        {
            id: 'spring-rolls',
            name: 'Spring Rolls',
            description: 'Fresh vegetables wrapped in crispy pastry',
            price: 60,
            image: 'Fresh spring rolls with vegetables'
        },
        {
            id: 'chicken-wings',
            name: 'Chicken Wings',
            description: 'Marinated and grilled to perfection',
            price: 150,
            image: 'Grilled chicken wings with herbs'
        },
        {
            id: 'fruit-salad',
            name: 'Fruit Salad',
            description: 'Fresh seasonal fruits beautifully arranged',
            price: 80,
            image: 'Colorful fresh fruit salad'
        }
    ],
    mains: [
        {
            id: 'nyama-choma',
            name: 'Nyama Choma',
            description: 'Traditional grilled meat, perfectly seasoned',
            price: 400,
            image: 'Traditional nyama choma grilled meat'
        },
        {
            id: 'pilau',
            name: 'Pilau',
            description: 'Fragrant spiced rice with tender meat',
            price: 250,
            image: 'Aromatic pilau rice with spices'
        },
        {
            id: 'grilled-chicken',
            name: 'Grilled Chicken',
            description: 'Herb-marinated chicken breast, grilled to perfection',
            price: 350,
            image: 'Herb grilled chicken breast'
        },
        {
            id: 'fish-fillet',
            name: 'Fish Fillet',
            description: 'Fresh fish fillet with lemon and herbs',
            price: 450,
            image: 'Grilled fish fillet with lemon'
        },
        {
            id: 'beef-stew',
            name: 'Beef Stew',
            description: 'Tender beef in rich, flavorful sauce',
            price: 300,
            image: 'Hearty beef stew with vegetables'
        },
        {
            id: 'vegetable-curry',
            name: 'Vegetable Curry',
            description: 'Mixed vegetables in aromatic curry sauce',
            price: 200,
            image: 'Colorful vegetable curry'
        }
    ],
    sides: [
        {
            id: 'ugali',
            name: 'Ugali',
            description: 'Traditional cornmeal staple',
            price: 50,
            image: 'Traditional ugali'
        },
        {
            id: 'sukuma-wiki',
            name: 'Sukuma Wiki',
            description: 'Sautéed collard greens with onions',
            price: 80,
            image: 'Sautéed sukuma wiki greens'
        },
        {
            id: 'rice',
            name: 'Rice',
            description: 'Perfectly cooked white rice',
            price: 60,
            image: 'Fluffy white rice'
        },
        {
            id: 'chapati',
            name: 'Chapati',
            description: 'Soft, layered flatbread',
            price: 40,
            image: 'Soft layered chapati bread'
        },
        {
            id: 'mukimo',
            name: 'Mukimo',
            description: 'Traditional mashed potatoes with greens',
            price: 100,
            image: 'Traditional mukimo with greens'
        }
    ],
    desserts: [
        {
            id: 'chocolate-cake',
            name: 'Chocolate Cake',
            description: 'Rich, moist chocolate cake',
            price: 200,
            image: 'Rich chocolate cake slice'
        },
        {
            id: 'vanilla-cake',
            name: 'Vanilla Cake',
            description: 'Light and fluffy vanilla sponge cake',
            price: 180,
            image: 'Light vanilla sponge cake'
        },
        {
            id: 'fruit-tart',
            name: 'Fresh Fruit Tart',
            description: 'Pastry filled with fresh seasonal fruits',
            price: 150,
            image: 'Fresh fruit tart with berries'
        },
        {
            id: 'ice-cream',
            name: 'Ice Cream',
            description: 'Assorted flavors of creamy ice cream',
            price: 100,
            image: 'Assorted ice cream scoops'
        }
    ],
    drinks: [
        {
            id: 'fresh-juice',
            name: 'Fresh Juice',
            description: 'Freshly squeezed fruit juices',
            price: 80,
            image: 'Fresh fruit juice glasses'
        },
        {
            id: 'soda',
            name: 'Soda',
            description: 'Assorted soft drinks',
            price: 60,
            image: 'Assorted soft drinks'
        },
        {
            id: 'water',
            name: 'Water',
            description: 'Bottled drinking water',
            price: 30,
            image: 'Bottled water'
        },
        {
            id: 'tea-coffee',
            name: 'Tea/Coffee',
            description: 'Hot beverages - tea or coffee',
            price: 50,
            image: 'Hot tea and coffee service'
        }
    ]
};

// Menu builder state
let selectedItems = {};
let guestCount = 50;
let currentCategory = 'starters';

// Initialize menu builder
document.addEventListener('DOMContentLoaded', function() {
    initializeMenuBuilder();
    loadSavedMenu();
});

function initializeMenuBuilder() {
    const guestCountInput = document.getElementById('guestCount');
    const tabButtons = document.querySelectorAll('.tab-button');
    const getQuoteBtn = document.getElementById('getQuoteBtn');

    // Guest count input handler
    guestCountInput.addEventListener('input', debounce(function() {
        guestCount = Math.max(1, parseInt(this.value) || 1);
        updateSummary();
        saveMenuToStorage();
    }, 300));

    // Tab button handlers
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            switchCategory(category);
        });
    });

    // Get quote button handler
    getQuoteBtn.addEventListener('click', function() {
        const menuItems = getSelectedMenuItems();
        const total = calculateTotal();
        
        // Save to localStorage for quote page
        saveToLocalStorage('quoteData', {
            menu: menuItems,
            guests: guestCount,
            total: total
        });
        
        // Navigate to quote page
        window.location.href = 'quote.html';
    });

    // Initialize with starters
    switchCategory('starters');
}

function switchCategory(category) {
    currentCategory = category;
    
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // Render menu items
    renderMenuItems(category);
}

function renderMenuItems(category) {
    const menuItemsContainer = document.getElementById('menuItems');
    const items = menuData[category] || [];
    
    menuItemsContainer.innerHTML = items.map(item => `
        <div class="menu-item">
            <div class="item-image">
                <div class="item-price">KSh ${item.price}</div>
                ${item.image}
            </div>
            <div class="item-content">
                <div class="item-header">
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-description">${item.description}</div>
                    </div>
                    <div class="item-checkbox">
                        <input type="checkbox" id="item-${item.id}" 
                               ${selectedItems[item.id] ? 'checked' : ''} 
                               onchange="toggleItem('${item.id}', this.checked)">
                    </div>
                </div>
                <div class="quantity-controls ${selectedItems[item.id] ? 'active' : ''}" id="quantity-${item.id}">
                    <div class="quantity-label">Quantity:</div>
                    <div class="quantity-input">
                        <button class="quantity-btn" onclick="changeQuantity('${item.id}', -1)">−</button>
                        <div class="quantity-value" id="qty-${item.id}">${selectedItems[item.id] || 1}</div>
                        <button class="quantity-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function toggleItem(itemId, isSelected) {
    if (isSelected) {
        selectedItems[itemId] = 1;
        document.getElementById(`quantity-${itemId}`).classList.add('active');
    } else {
        delete selectedItems[itemId];
        document.getElementById(`quantity-${itemId}`).classList.remove('active');
    }
    
    updateSummary();
    saveMenuToStorage();
}

function changeQuantity(itemId, change) {
    if (!selectedItems[itemId]) return;
    
    const newQuantity = Math.max(1, selectedItems[itemId] + change);
    selectedItems[itemId] = newQuantity;
    
    document.getElementById(`qty-${itemId}`).textContent = newQuantity;
    updateSummary();
    saveMenuToStorage();
}

function updateSummary() {
    const summaryContent = document.getElementById('summaryContent');
    const summaryFooter = document.getElementById('summaryFooter');
    const totalAmount = document.getElementById('totalAmount');
    
    const selectedItemsArray = getSelectedMenuItems();
    
    if (selectedItemsArray.length === 0) {
        summaryContent.innerHTML = '<div class="empty-summary"><p>Select items to build your menu</p></div>';
        summaryFooter.style.display = 'none';
        return;
    }
    
    const total = calculateTotal();
    
    summaryContent.innerHTML = `
        <div class="guest-info">
            <span>👥</span>
            <span>For ${guestCount} guests</span>
        </div>
        <div class="selected-items">
            ${selectedItemsArray.map(item => `
                <div class="selected-item">
                    <div class="selected-item-info">
                        <div class="selected-item-name">${item.name}</div>
                        <div class="selected-item-details">
                            ${item.quantity} × KSh ${item.price} × ${guestCount}
                        </div>
                    </div>
                    <div class="selected-item-total">
                        KSh ${(item.price * item.quantity * guestCount).toLocaleString()}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    totalAmount.textContent = `KSh ${total.toLocaleString()}`;
    summaryFooter.style.display = 'block';
}

function getSelectedMenuItems() {
    const items = [];
    
    Object.keys(selectedItems).forEach(itemId => {
        // Find the item in all categories
        let item = null;
        for (const category in menuData) {
            item = menuData[category].find(i => i.id === itemId);
            if (item) break;
        }
        
        if (item) {
            items.push({
                ...item,
                quantity: selectedItems[itemId]
            });
        }
    });
    
    return items;
}

function calculateTotal() {
    const selectedItemsArray = getSelectedMenuItems();
    return selectedItemsArray.reduce((total, item) => {
        return total + (item.price * item.quantity * guestCount);
    }, 0);
}

function saveMenuToStorage() {
    saveToLocalStorage('menuBuilder', {
        selectedItems,
        guestCount,
        currentCategory
    });
}

function loadSavedMenu() {
    const saved = getFromLocalStorage('menuBuilder');
    if (saved) {
        selectedItems = saved.selectedItems || {};
        guestCount = saved.guestCount || 50;
        currentCategory = saved.currentCategory || 'starters';
        
        document.getElementById('guestCount').value = guestCount;
        switchCategory(currentCategory);
        updateSummary();
    }
}

// Global functions for inline event handlers
window.toggleItem = toggleItem;
window.changeQuantity = changeQuantity;