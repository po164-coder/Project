let allQuestions = {};
let currentSection = '';
let currentQuestionIndex = 0;
let score = 0;

// Load questions on startup
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        allQuestions = data;
        updateHomeProgress();
    })
    .catch(error => console.error("Error loading questions:", error));

// Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function goHome() {
    updateHomeProgress();
    showScreen('home-screen');
}

// --- The Magic Mirror AI Study Buddy ---
// Add as many keywords and questions here as you want!
const flashcardBank = [
    { keywords: ["fraud", "steal", "embezzle"], q: "What are the primary components of the Fraud Triangle?", a: "Opportunity, Pressure (or Incentive), and Rationalization." },
    { keywords: ["audit", "risk", "model"], q: "What is the Audit Risk Model?", a: "Audit Risk = Inherent Risk × Control Risk × Detection Risk." },
    { keywords: ["tax", "deduction", "dependents"], q: "What is the gross income test limit for a qualifying relative?", a: "The dependent's gross income must be less than the exemption amount for the year." },
    { keywords: ["asset", "depreciation", "macrs"], q: "Under MACRS, what is the standard recovery period for office furniture and fixtures?", a: "7 years." },
    { keywords: ["ethics", "independence", "aicpa"], q: "According to the AICPA, when is independence impaired by financial interests?", a: "When a covered member owns any direct financial interest or a material indirect financial interest in a client." }
];

function searchAITopic() {
    const input = document.getElementById('ai-topic').value.toLowerCase();
    const flashcardDiv = document.getElementById('ai-flashcard');
    const errorDiv = document.getElementById('ai-error');
    
    // Reset views
    flashcardDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    document.getElementById('ai-answer').classList.add('hidden');
    document.getElementById('reveal-btn').classList.remove('hidden');

    if (!input) return;

    // Search for keywords
    let foundCard = null;
    for (let card of flashcardBank) {
        if (card.keywords.some(keyword => input.includes(keyword))) {
            foundCard = card;
            break;
        }
    }

    if (foundCard) {
        document.getElementById('ai-question').innerText = foundCard.q;
        document.getElementById('ai-answer').innerText = foundCard.a;
        flashcardDiv.classList.remove('hidden');
    } else {
        // Princess Fallback Responses
        const fallbacks = [
            "🧜‍♀️ Ariel says: 'I don't have a gadget or gizmo for that topic yet! Try searching for fraud, tax, or assets!'",
            "🥿 Cinderella says: 'Oh my! The clock struck midnight on that topic. Try typing audit or risk!'",
            "🐸 Princess Tiana says: 'You gotta dig a little deeper! Try searching for a specific CPA keyword like ethics or depreciation!'"
        ];
        document.getElementById('error-text').innerText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        errorDiv.classList.remove('hidden');
    }
}

function revealAIAanswer() {
    document.getElementById('ai-answer').classList.remove('hidden');
    document.getElementById('reveal-btn').classList.add('hidden');
}

// --- Main Quiz Logic ---
function startQuiz(section) {
    if (!allQuestions[section] || allQuestions[section].length === 0) {
        alert("Oops! Make sure you added questions to this section in your questions.json file.");
        return;
    }
    
    currentSection = section;
    currentQuestionIndex = 0;
    score = 0;
    
    document.getElementById('quiz-title').innerText = `${section} Exam`;
    document.getElementById('end-quiz-btn').classList.add('hidden');
    showScreen('quiz-screen');
    loadQuestion();
}

function loadQuestion() {
    const qData = allQuestions[currentSection][currentQuestionIndex];
    document.getElementById('question-text').innerText = `Question ${currentQuestionIndex + 1}: ${qData.question}`;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    qData.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'option-btn';
        btn.onclick = () => checkAnswer(index, btn, qData);
        optionsContainer.appendChild(btn);
    });

    document.getElementById('explanation-box').classList.add('hidden');
    updateProgressBar();
}

function checkAnswer(selectedIndex, btnElement, qData) {
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(b => b.disabled = true); 

    if (selectedIndex === qData.correctAnswer) {
        btnElement.classList.add('correct');
        score++;
        setTimeout(nextQuestion, 1200); 
    } else {
        btnElement.classList.add('wrong');
        buttons[qData.correctAnswer].classList.add('correct');
        
        triggerWrongConfetti();
        
        const expBox = document.getElementById('explanation-box');
        document.getElementById('explanation-text').innerText = qData.explanation;
        expBox.classList.remove('hidden');
    }
}

function triggerWrongConfetti() {
    confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#E23636', '#2C1B4D', '#000000'] // Darker colors for wrong answers!
    });
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < allQuestions[currentSection].length) {
        loadQuestion();
    } else {
        document.getElementById('question-container').innerHTML = `<h3>Section Complete!</h3><p>You scored ${score} out of ${allQuestions[currentSection].length}.</p>`;
        document.getElementById('explanation-box').classList.add('hidden');
        document.getElementById('end-quiz-btn').classList.remove('hidden');
        saveProgress();
    }
}

// Progress Tracking
function updateProgressBar() {
    const total = allQuestions[currentSection].length;
    const progress = (currentQuestionIndex / total) * 100;
    document.getElementById('quiz-progress').style.width = `${progress}%`;
}

function saveProgress() {
    let savedData = JSON.parse(localStorage.getItem('magicalCPA')) || { totalScore: 0 };
    savedData.totalScore += score;
    localStorage.setItem('magicalCPA', JSON.stringify(savedData));
}

function updateHomeProgress() {
    let savedData = JSON.parse(localStorage.getItem('magicalCPA')) || { totalScore: 0 };
    
    let levelName = "1 (Mouseketeer)";
    if (savedData.totalScore > 10) levelName = "2 (Jedi Padawan)";
    if (savedData.totalScore > 30) levelName = "3 (Avenger in Training)";
    if (savedData.totalScore > 50) levelName = "4 (CPA Sorcerer Supreme ✨)";

    document.getElementById('user-level').innerText = levelName;
    
    // Assuming 80 is the max score across all tests combined
    let percent = Math.min((savedData.totalScore / 80) * 100, 100);
    document.getElementById('overall-progress').style.width = `${percent}%`;
}
