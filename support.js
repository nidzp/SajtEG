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
    const messageField = document.getElementById('message');
    const formStatus = document.getElementById('form-status');
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
            if (messageField && !messageField.value.trim()) {
                messageField.value = summaryText;
            }
        }
        if (aiHiddenField) {
            aiHiddenField.value = summaryText;
        }
    }
    if (contactForm && aiHiddenField && aiSummaryBox) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        contactForm.addEventListener('submit', async event => {
            event.preventDefault();
            aiHiddenField.value = aiSummaryBox.textContent.trim();
            if (formStatus) {
                formStatus.textContent = 'Slanje poruke...';
                formStatus.classList.remove('is-success', 'is-error');
                formStatus.classList.add('is-pending');
            }
            if (submitButton) {
                submitButton.disabled = true;
            }
            contactForm.classList.add('is-submitting');
            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: formData
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                if (formStatus) {
                    formStatus.textContent = 'Poruka je uspešno poslata. Uskoro ćemo vam odgovoriti.';
                    formStatus.classList.remove('is-pending');
                    formStatus.classList.add('is-success');
                }
                contactForm.reset();
                if (messageField && aiSummaryBox.classList.contains('has-data')) {
                    messageField.value = aiSummaryBox.textContent.trim();
                }
                if (aiHiddenField) {
                    aiHiddenField.value = aiSummaryBox.textContent.trim();
                }
            } catch (error) {
                if (formStatus) {
                    formStatus.textContent = 'Došlo je do greške prilikom slanja. Pokušajte ponovo kasnije ili nas pozovite.';
                    formStatus.classList.remove('is-pending');
                    formStatus.classList.add('is-error');
                }
                console.error('Slanje poruke nije uspelo.', error);
            } finally {
                contactForm.classList.remove('is-submitting');
                if (submitButton) {
                    submitButton.disabled = false;
                }
            }
        });
    }
});
