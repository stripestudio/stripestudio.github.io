// Gallery JavaScript functionality

// Gallery data
const galleryData = [
    {
        id: 1,
        title: 'Elegant Wedding Reception',
        category: 'weddings',
        image: 'Elegant wedding reception with beautiful table settings and floral centerpieces',
        description: 'A beautiful outdoor wedding reception with custom menu and professional service'
    },
    {
        id: 2,
        title: 'Corporate Lunch Event',
        category: 'corporate',
        image: 'Professional corporate lunch setup with modern presentation',
        description: 'Executive lunch meeting with gourmet menu and seamless service'
    },
    {
        id: 3,
        title: 'Graduation Celebration',
        category: 'graduation',
        image: 'Colorful graduation party setup with festive decorations',
        description: 'Family graduation party with traditional and modern dishes'
    },
    {
        id: 4,
        title: 'Traditional Nyama Choma',
        category: 'food',
        image: 'Perfectly grilled nyama choma with traditional sides',
        description: 'Our signature grilled meat served with traditional accompaniments'
    },
    {
        id: 5,
        title: 'Buffet Setup',
        category: 'service',
        image: 'Professional buffet setup with variety of dishes',
        description: 'Elegant buffet presentation for a large corporate event'
    },
    {
        id: 6,
        title: 'Wedding Cake Display',
        category: 'desserts',
        image: 'Beautiful multi-tier wedding cake with elegant decorations',
        description: 'Custom wedding cake with matching dessert table'
    },
    {
        id: 7,
        title: 'Memorial Service Catering',
        category: 'memorial',
        image: 'Respectful memorial service catering setup',
        description: 'Compassionate catering service for a community memorial'
    },
    {
        id: 8,
        title: 'Birthday Party Setup',
        category: 'birthday',
        image: 'Colorful birthday party catering with fun decorations',
        description: "Children's birthday party with kid-friendly menu and decorations"
    },
    {
        id: 9,
        title: 'Pilau and Rice Dishes',
        category: 'food',
        image: 'Aromatic pilau and rice dishes beautifully presented',
        description: 'Our popular rice dishes prepared with authentic spices'
    },
    {
        id: 10,
        title: 'Fresh Appetizers',
        category: 'food',
        image: 'Elegant appetizer display with samosas and fresh items',
        description: 'Variety of fresh appetizers and finger foods'
    },
    {
        id: 11,
        title: 'Outdoor Event Setup',
        category: 'service',
        image: 'Outdoor catering setup with tents and professional service',
        description: 'Complete outdoor catering setup for a large community event'
    },
    {
        id: 12,
        title: 'Dessert Table',
        category: 'desserts',
        image: 'Beautiful dessert table with cakes and sweet treats',
        description: 'Elegant dessert presentation with variety of sweet options'
    }
];

// Gallery state
let currentFilter = 'all';
let displayedItems = 8;
let currentLightboxIndex = 0;
let filteredData = [];

// Initialize gallery
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
});

function initializeGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    // Filter button handlers
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            setActiveFilter(filter);
            filterGallery(filter);
        });
    });

    // Load more button handler
    loadMoreBtn.addEventListener('click', function() {
        displayedItems += 4;
        renderGallery();
        
        if (displayedItems >= filteredData.length) {
            this.style.display = 'none';
        }
    });

    // Lightbox handlers
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));
    
    // Close lightbox on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    navigateLightbox(-1);
                    break;
                case 'ArrowRight':
                    navigateLightbox(1);
                    break;
            }
        }
    });

    // Initialize with all items
    filterGallery('all');
}

function setActiveFilter(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
}

function filterGallery(filter) {
    currentFilter = filter;
    displayedItems = 8;
    
    if (filter === 'all') {
        filteredData = [...galleryData];
    } else {
        filteredData = galleryData.filter(item => item.category === filter);
    }
    
    renderGallery();
    updateLoadMoreButton();
}

function renderGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    const itemsToShow = filteredData.slice(0, displayedItems);
    
    galleryGrid.innerHTML = itemsToShow.map((item, index) => `
        <div class="gallery-item" onclick="openLightbox(${filteredData.indexOf(item)})">
            <div class="gallery-image">
                <div class="image-placeholder">${item.image}</div>
                <div class="gallery-overlay">
                    <div class="gallery-overlay-icon">🔍</div>
                </div>
                <div class="gallery-category">${getCategoryDisplayName(item.category)}</div>
            </div>
            <div class="gallery-info">
                <h3 class="gallery-title">${item.title}</h3>
                <p class="gallery-description">${item.description}</p>
            </div>
        </div>
    `).join('');

    // Add animation to new items
    const galleryItems = galleryGrid.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (displayedItems >= filteredData.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-flex';
    }
}

function getCategoryDisplayName(category) {
    const categoryNames = {
        'weddings': 'Wedding',
        'corporate': 'Corporate',
        'graduation': 'Graduation',
        'food': 'Food',
        'service': 'Service',
        'desserts': 'Desserts',
        'memorial': 'Memorial',
        'birthday': 'Birthday'
    };
    
    return categoryNames[category] || category;
}

function openLightbox(index) {
    currentLightboxIndex = index;
    const item = filteredData[index];
    
    document.getElementById('lightboxImage').textContent = item.image;
    document.getElementById('lightboxTitle').textContent = item.title;
    document.getElementById('lightboxDescription').textContent = item.description;
    document.getElementById('lightboxCategory').textContent = getCategoryDisplayName(item.category);
    
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;
    
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = filteredData.length - 1;
    } else if (currentLightboxIndex >= filteredData.length) {
        currentLightboxIndex = 0;
    }
    
    const item = filteredData[currentLightboxIndex];
    document.getElementById('lightboxImage').textContent = item.image;
    document.getElementById('lightboxTitle').textContent = item.title;
    document.getElementById('lightboxDescription').textContent = item.description;
    document.getElementById('lightboxCategory').textContent = getCategoryDisplayName(item.category);
}

// Global function for inline event handlers
window.openLightbox = openLightbox;