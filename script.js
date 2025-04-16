// Add simple animations on scroll
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add simple fade-in animation for elements when they come into view
    const fadeInElements = document.querySelectorAll('.feature-card, .use-case');

    // Create IntersectionObserver instance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.3,
        rootMargin: '0px'
    });

    // Observe each element
    fadeInElements.forEach(element => {
        observer.observe(element);
    });
});