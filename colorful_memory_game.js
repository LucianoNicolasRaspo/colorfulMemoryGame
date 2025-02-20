const colors = ['red', 'blue', 'green', 'purple', 'orange', 'pink', 'red', 'blue', 'green', 'purple', 'orange', 'pink'];
let cards = shuffle(colors.concat(colors));
let selectedCards = [];
let score = 0;
let timeLeft = 30;
let gameInterval;
let gameActive = false; // Variable para controlar si el juego está activo

const startbtn = document.getElementById('startbtn');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');

function generateCards() {
    gameContainer.innerHTML = ''; // Limpiar el contenedor antes de generar cartas nuevas
    for (const color of cards) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.color = color;
        card.textContent = '?';
        card.style.backgroundColor = '#ddd'; // Para que las cartas tengan fondo gris inicialmente
        gameContainer.appendChild(card);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function handleCardClick(event) {
    if (!gameActive) return; // No permitir clics si el juego ha terminado

    const card = event.target;
    if (!card.classList.contains('card') || card.classList.contains('matched') || selectedCards.includes(card)) {
        return;
    }

    if (selectedCards.length === 2) {
        return; // Bloquea más de 2 clics a la vez
    }

    card.textContent = card.dataset.color;
    card.style.backgroundColor = card.dataset.color;
    selectedCards.push(card);

    if (selectedCards.length === 2) {
        gameContainer.removeEventListener("click", handleCardClick); // Bloquear clics mientras se comprueba
        setTimeout(() => {
            checkMatch();
            gameContainer.addEventListener("click", handleCardClick); // Restaurar eventos después de comparar
        }, 500);
    }
}

function checkMatch() {
    if (selectedCards.length < 2) return;

    const [card1, card2] = selectedCards;
    if (card1.dataset.color === card2.dataset.color) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        score += 2;
        scoreElement.textContent = `Puntuación: ${score}`;
    } else {
        card1.textContent = '?';
        card2.textContent = '?';
        card1.style.backgroundColor = '#ddd';
        card2.style.backgroundColor = '#ddd';
    }
    selectedCards = [];
}

function startGame() {
    clearInterval(gameInterval);
    gameActive = true; // Habilitar el juego
    timeLeft = 30;
    startbtn.disabled = true;
    score = 0;
    scoreElement.textContent = `Puntuación: ${score}`;
    timerElement.textContent = `Tiempo Restante: ${timeLeft}`;
    cards = shuffle(colors.concat(colors));
    selectedCards = [];
    generateCards();
    gameContainer.addEventListener('click', handleCardClick);
    startGameTimer();
}

function startGameTimer() {
    gameInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Tiempo Restante: ${timeLeft}`;
        if (timeLeft === 0) {
            clearInterval(gameInterval);
            gameActive = false; // Deshabilitar el juego cuando se acaba el tiempo
            alert('¡Juego terminado!');
            startbtn.disabled = false;
            gameContainer.removeEventListener("click", handleCardClick); // Bloquear clics al terminar
        }
    }, 1000);
}

// Llamar a generateCards cuando la página cargue
window.onload = generateCards;
startbtn.addEventListener("click", startGame);
