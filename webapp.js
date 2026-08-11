// Telegram Web App initialization
const tg = window.Telegram.WebApp;

// Initialize Telegram Web App
tg.ready();

// Set background color
tg.setBackgroundColor('#ffffff');
tg.setHeaderColor('#667eea');

// DOM Elements
const nameInput = document.getElementById('name');
const yesBtnElement = document.getElementById('yes-btn');
const noBtnElement = document.getElementById('no-btn');
const submitBtn = document.getElementById('submit-btn');
const messageDiv = document.getElementById('message');
const selectedAnswerDiv = document.getElementById('selected-answer');

// State
let selectedAnswer = null;

// Bot token and chat ID
const BOT_TOKEN = '8218815466:AAFDaT_vU5n276sIgOTsmDmqFV3hBbtpoXU';
const CHAT_ID = '1727171179';

// Event listeners for choice buttons
yesBtnElement.addEventListener('click', function() {
    selectedAnswer = 'Буду';
    updateButtonStates();
    updateMessage();
    checkFormValidity();
});

noBtnElement.addEventListener('click', function() {
    selectedAnswer = 'Не смогу';
    updateButtonStates();
    updateMessage();
    checkFormValidity();
});

// Update button states
function updateButtonStates() {
    yesBtnElement.classList.remove('active');
    noBtnElement.classList.remove('active');

    if (selectedAnswer === 'Буду') {
        yesBtnElement.classList.add('active');
    } else if (selectedAnswer === 'Не смогу') {
        noBtnElement.classList.add('active');
    }
}

// Update message display
function updateMessage() {
    if (selectedAnswer) {
        selectedAnswerDiv.textContent = `✓ Выбран ответ: ${selectedAnswer}`;
    } else {
        selectedAnswerDiv.textContent = '';
    }
}

// Check form validity
function checkFormValidity() {
    const nameValue = nameInput.value.trim();
    const isValid = nameValue.length > 0 && selectedAnswer;
    submitBtn.disabled = !isValid;
}

// Input listener
nameInput.addEventListener('input', checkFormValidity);

// Submit button handler
submitBtn.addEventListener('click', async function() {
    const name = nameInput.value.trim();
    const answer = selectedAnswer;

    if (!name || !answer) {
        showMessage('Пожалуйста, заполните все поля', 'error');
        return;
    }

    submitBtn.disabled = true;
    messageDiv.textContent = 'Отправляем...';

    try {
        // Prepare message
        const text = `🎉 Новый ответ на юбилей!\n\n👤 Имя: ${name}\n✅ Ответ: ${answer}\n\n8 января 2027`;

        // Send message via Telegram Bot API
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'HTML'
            })
        });

        if (response.ok) {
            showMessage('✅ Ответ отправлен! Спасибо за участие!', 'success');
            
            // Reset form
            setTimeout(() => {
                nameInput.value = '';
                selectedAnswer = null;
                updateButtonStates();
                updateMessage();
                submitBtn.disabled = true;
                messageDiv.textContent = '';
                
                // Close Web App after 2 seconds
                setTimeout(() => {
                    tg.close();
                }, 2000);
            }, 1500);
        } else {
            const errorData = await response.json();
            showMessage('❌ Ошибка при отправке. Попробуйте ещё раз.', 'error');
            submitBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('❌ Ошибка соединения. Проверьте интернет.', 'error');
        submitBtn.disabled = false;
    }
});

// Show message function
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
}

// Initialize form
checkFormValidity();

// Telegram Web App button handling
tg.MainButton.text = 'Отправить ответ';
tg.MainButton.onClick(() => {
    submitBtn.click();
});