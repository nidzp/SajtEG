// JavaScript for the dedicated support/FAQ page.
// Provides interactive toggling for categories and subquestions.

// Ensure shared UI (theme + language) is loaded
(function loadSharedUI(){
    if (document.getElementById('eg-ui-js')) return;
    const s = document.createElement('script');
    s.src = 'assets/ui.js';
    s.id = 'eg-ui-js';
    document.head.appendChild(s);
})();

document.addEventListener('DOMContentLoaded', () => {
    // Hide the preloader after the intro animation has played
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 4000);
    }
    // Toggle display of subquestion groups when category headings are clicked
    document.querySelectorAll('.support-category').forEach(category => {
        const header = category.querySelector('h2');
        header.addEventListener('click', () => {
            category.classList.toggle('open');
        });
        // Toggle individual answers when subquestions are clicked
        category.querySelectorAll('.subquestion').forEach(item => {
            const question = item.querySelector('h3');
            question.addEventListener('click', () => {
                item.classList.toggle('open');
            });
        });
    });
});
