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

    // Populate the AI summary on the contact page using the last chat interaction
    const aiSummaryBox = document.getElementById('ai-summary');
    const aiHiddenField = document.getElementById('ai-hidden');
    const contactForm = document.getElementById('contact-form');
    if (aiSummaryBox) {
        const defaultMessage = 'Niste koristili asistenta na početnoj stranici.';
        let summaryText = defaultMessage;
        if (window.sessionStorage) {
            try {
                const stored = sessionStorage.getItem('chatSummary');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed.question && parsed.answer) {
                        summaryText = `Pitanje: ${parsed.question}\nOdgovor asistenta: ${parsed.answer}`;
                    }
                }
            } catch (error) {
                summaryText = defaultMessage;
            }
        }
        aiSummaryBox.textContent = summaryText;
        if (summaryText !== defaultMessage) {
            aiSummaryBox.classList.add('has-data');
        }
        if (aiHiddenField) {
            aiHiddenField.value = summaryText;
        }
    }
    if (contactForm && aiHiddenField && aiSummaryBox) {
        contactForm.addEventListener('submit', () => {
            aiHiddenField.value = aiSummaryBox.textContent.trim();
        });
    }
});
