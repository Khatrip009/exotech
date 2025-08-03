// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mainNav = document.getElementById('main-nav');

    if (hamburgerMenu && mainNav) {
        hamburgerMenu.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            // Toggle hamburger icon between bars and times
            const icon = hamburgerMenu.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a navigation link is clicked (for single-page navigation or on mobile)
        mainNav.querySelectorAll('.header__nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    hamburgerMenu.querySelector('i').classList.remove('fa-times');
                    hamburgerMenu.querySelector('i').classList.add('fa-bars');
                }
            });
        });
    }

    // --- Smooth Scrolling for Anchor Links (if any) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Scroll-triggered Animations (Intersection Observer) ---
    // Select all elements that need to be animated on scroll
    const elementsToAnimate = document.querySelectorAll(
        '.section, .service-card, .process-step, .team-member-card, .portfolio-card'
    );

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animate-in class to trigger the CSS animation
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe each element individually.
    elementsToAnimate.forEach((element) => {
        observer.observe(element);
    });

    // --- Contact Form Submission (Asynchronous) ---
    const contactForm = document.getElementById('contactForm');
    const formStatusMessage = document.getElementById('formStatusMessage');

    if (contactForm && formStatusMessage) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission (page reload)

            const formData = new FormData(contactForm);
            const formEndpoint = 'https://formspree.io/f/mqalddrg'; // Your Formspree endpoint

            // Clear previous messages and hide
            formStatusMessage.textContent = '';
            formStatusMessage.classList.remove('show', 'success', 'error');

            try {
                const response = await fetch(formEndpoint, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Important for Formspree's JSON response
                    }
                });

                if (response.ok) {
                    formStatusMessage.textContent = 'Thank you! Your message has been sent successfully.';
                    formStatusMessage.classList.add('show', 'success');
                    contactForm.reset(); // Clear the form fields
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        formStatusMessage.textContent = data.errors.map(error => error.message).join(', ');
                    } else {
                        formStatusMessage.textContent = 'Oops! There was a problem sending your message.';
                    }
                    formStatusMessage.classList.add('show', 'error');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                formStatusMessage.textContent = 'Network error. Please try again later.';
                formStatusMessage.classList.add('show', 'error');
            }

            // Hide message after a few seconds
            setTimeout(() => {
                formStatusMessage.classList.remove('show');
            }, 5000);
        });
    }
});
