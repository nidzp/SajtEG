// JavaScript for the dedicated support/FAQ page.
// Provides interactive toggling for categories and subquestions.

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