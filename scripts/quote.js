// Quote JavaScript functionality

// Initialize quote page
document.addEventListener('DOMContentLoaded', function() {
    loadQuoteData();
    initializeQuoteForm();
});

function loadQuoteData() {
    const quoteData = getFromLocalStorage('quoteData');
    
    if (quoteData && quoteData.menu && quoteData.menu.length > 0) {
        displayMenuSummary(quoteData);
        populateGuestCount(quoteData.guests);
    }
}

function displayMenuSummary(quoteData) {
    const menuSummaryCard = document.getElementById('menuSummaryCard');
    const menuSummaryContent = document.getElementById('menuSummaryContent');
    
    menuSummaryCard.style.display = 'block';
    
    menuSummaryContent.innerHTML = `
        <div class="guest-info">
            <span>👥</span>
            <span>For ${quoteData.guests} guests</span>
        </div>
        <div class="selected-items">
            ${quoteData.menu.map(item => `
                <div class="selected-item">
                    <div class="selected-item-info">
                        <div class="selected-item-name">${item.name}</div>
                        <div class="selected-item-details">
                            ${item.quantity} × KSh ${item.price} × ${quoteData.guests}
                        </div>
                    </div>
                    <div class="selected-item-total">
                        KSh ${(item.price * item.quantity * quoteData.guests).toLocaleString()}
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="total-section">
            <div class="total-label">Estimated Total</div>
            <div class="total-amount">KSh ${quoteData.total.toLocaleString()}</div>
        </div>
        <div class="total-note">
            *Final price may vary based on additional services and requirements
        </div>
    `;
}

function populateGuestCount(guests) {
    const guestCountInput = document.getElementById('guestCount');
    if (guestCountInput) {
        guestCountInput.value = guests;
    }
}

function initializeQuoteForm() {
    const quoteForm = document.getElementById('quoteForm');
    
    // Set minimum date to today
    const eventDateInput = document.getElementById('eventDate');
    if (eventDateInput) {
        const today = new Date().toISOString().split('T')[0];
        eventDateInput.min = today;
    }
    
    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleQuoteSubmission();
    });
}

function handleQuoteSubmission() {
    const formData = new FormData(document.getElementById('quoteForm'));
    const quoteData = getFromLocalStorage('quoteData') || {};
    
    const submissionData = {
        // Contact Information
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        eventType: formData.get('eventType'),
        
        // Event Details
        eventDate: formData.get('eventDate'),
        eventTime: formData.get('eventTime'),
        venue: formData.get('venue'),
        guestCount: formData.get('guestCount'),
        
        // Additional Information
        additionalServices: formData.get('additionalServices'),
        specialRequests: formData.get('specialRequests'),
        dietaryRestrictions: formData.get('dietaryRestrictions'),
        
        // Menu Data
        selectedMenu: quoteData.menu || [],
        estimatedTotal: quoteData.total || 0,
        
        // Metadata
        submissionDate: new Date().toISOString()
    };
    
    // Validate form data
    if (!validateQuoteForm(submissionData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('#quoteForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-icon">⏳</span><span>Submitting...</span>';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success modal
        showQuoteSuccessModal();
        
        // Save submission data
        saveToLocalStorage('lastQuoteSubmission', submissionData);
        
        // Clear menu data
        localStorage.removeItem('quoteData');
        
    }, 2000);
}

function validateQuoteForm(data) {
    const errors = [];
    
    // Required fields validation
    if (!data.fullName || data.fullName.trim().length < 2) {
        errors.push('Please enter your full name');
    }
    
    if (!data.email || !validateEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.phone || !validatePhone(data.phone)) {
        errors.push('Please enter a valid phone number');
    }
    
    if (!data.eventType) {
        errors.push('Please select an event type');
    }
    
    if (!data.eventDate) {
        errors.push('Please select an event date');
    } else {
        const eventDate = new Date(data.eventDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (eventDate < today) {
            errors.push('Event date cannot be in the past');
        }
    }
    
    if (!data.venue || data.venue.trim().length < 3) {
        errors.push('Please enter the event venue');
    }
    
    if (!data.guestCount || parseInt(data.guestCount) < 1) {
        errors.push('Please enter a valid number of guests');
    }
    
    if (errors.length > 0) {
        showQuoteFormErrors(errors);
        return false;
    }
    
    return true;
}

function showQuoteFormErrors(errors) {
    // Remove existing error messages
    document.querySelectorAll('.form-error').forEach(error => error.remove());
    
    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-error';
    errorContainer.style.cssText = `
        background: #fee;
        border: 1px solid #fcc;
        color: #c33;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
    `;
    
    errorContainer.innerHTML = `
        <strong>Please correct the following errors:</strong>
        <ul style="margin: 0.5rem 0 0 1rem;">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    
    // Insert error container at the top of the form
    const form = document.getElementById('quoteForm');
    form.insertBefore(errorContainer, form.firstChild);
    
    // Scroll to error
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showQuoteSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
}

function openWhatsAppQuote() {
    const lastSubmission = getFromLocalStorage('lastQuoteSubmission');
    
    let message = `Hello Sanof Catering,

I just submitted a quote request through your website and would like to discuss my event further.`;

    if (lastSubmission) {
        message += `

Event Details:
- Event Type: ${lastSubmission.eventType}
- Date: ${lastSubmission.eventDate}
- Guests: ${lastSubmission.guestCount}
- Venue: ${lastSubmission.venue}`;

        if (lastSubmission.selectedMenu && lastSubmission.selectedMenu.length > 0) {
            message += `
- Estimated Total: KSh ${lastSubmission.estimatedTotal.toLocaleString()}`;
        }
    }

    message += `

Please get back to me with a detailed quote.

Thank you!`;
    
    openWhatsApp(message);
}

// Global functions for inline event handlers
window.closeModal = closeModal;
window.openWhatsAppQuote = openWhatsAppQuote;