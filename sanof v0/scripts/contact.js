// Contact JavaScript functionality

// Initialize contact page
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFAQ();
});

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleContactSubmission();
    });
}

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            toggleFAQItem(item);
        });
    });
}

function toggleFAQItem(item) {
    const isActive = item.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(faqItem => {
        faqItem.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        item.classList.add('active');
    }
}

function handleContactSubmission() {
    const formData = new FormData(document.getElementById('contactForm'));
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Validate form data
    if (!validateContactForm(contactData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-icon">⏳</span><span>Sending...</span>';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success modal
        showContactSuccessModal();
        
        // Save to localStorage for potential follow-up
        saveToLocalStorage('lastContactSubmission', {
            ...contactData,
            timestamp: new Date().toISOString()
        });
        
    }, 2000);
}

function validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter a valid name');
    }
    
    if (!data.email || !validateEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (data.phone && !validatePhone(data.phone)) {
        errors.push('Please enter a valid phone number');
    }
    
    if (!data.subject || data.subject.trim().length < 3) {
        errors.push('Please enter a subject');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Please enter a message (at least 10 characters)');
    }
    
    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }
    
    return true;
}

function showFormErrors(errors) {
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
    const form = document.getElementById('contactForm');
    form.insertBefore(errorContainer, form.firstChild);
    
    // Scroll to error
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showContactSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
}

function closeContactModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
}

function openWhatsAppContact() {
    const message = `Hello Sanof Catering,

I'm interested in your catering services and would like to discuss my event requirements.

Please get back to me with more information.

Thank you!`;
    
    openWhatsApp(message);
}

// Global functions for inline event handlers
window.closeContactModal = closeContactModal;
window.openWhatsAppContact = openWhatsAppContact;