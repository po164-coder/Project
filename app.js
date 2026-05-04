let allQuestions = {};
let currentSection = '';
let currentQuestionIndex = 0;
let score = 0;
let totalQuestionsAttempted = 0;

// Load questions on startup
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        allQuestions = data;
        updateHomeProgress();
    })
    .catch(error => console.error("Error loading questions:", error));

// --- Navigation ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function goHome() {
    updateHomeProgress();
    showScreen('home-screen');
}

// --- AI Study Buddy Logic ---
const aiFlashcards = [
    { q: "What are the components of the Fraud Triangle?", a: "Opportunity, Pressure (Incentive), and Rationalization." },
    { q: "What is the basic Accounting Equation?", a: "Assets = Liabilities + Equity." },
    { q: "How do you calculate the current ratio?", a: "Current Assets / Current Liabilities." }
];
let currentAIIndex = 0;

function startAIQuiz() {
    showScreen('ai-screen');
    currentAIIndex = Math.floor(Math.random() * aiFlashcards.length);
    document.getElementById('ai-question').innerText = aiFlashcards[currentAIIndex].q;
    document.getElementById('ai-answer').innerText = aiFlashcards[currentAIIndex].a;
    document.getElementById('ai-answer').classList.add('hidden');
    document.getElementById('reveal-btn').classList.remove('hidden');
}

function revealAIAanswer() {
    document.getElementById('ai-answer').classList.remove('hidden');
    document.getElementById('reveal-btn').classList.add('hidden');
}

// --- Main Quiz Logic ---
function startQuiz(section) {
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
    document.getElementById('question-text').innerText = `${currentQuestionIndex + 1}. ${qData.question}`;
    
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
    buttons.forEach(b => b.disabled = true); // Disable further clicks

    totalQuestionsAttempted++;

    if (selectedIndex === qData.correctAnswer) {
        btnElement.classList.add('correct');
        score++;
        setTimeout(nextQuestion, 1000); // Auto-advance if correct
    } else {
        btnElement.classList.add('wrong');
        buttons[qData.correctAnswer].classList.add('correct');
        
        // The requested feature: Confetti on WRONG answers!
        triggerWrongConfetti();
        
        const expBox = document.getElementById('explanation-box');
        document.getElementById('explanation-text').innerText = qData.explanation;
        expBox.classList.remove('hidden');
    }
}

function triggerWrongConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E23636', '#000000'] // Darker/Red confetti for failure!
    });
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < allQuestions[currentSection].length) {
        loadQuestion();
    } else {
        document.getElementById('question-container').innerHTML = `<h3>Quiz Complete!</h3><p>You scored ${score} out of ${allQuestions[currentSection].length}.</p>`;
        document.getElementById('explanation-box').classList.add('hidden');
        document.getElementById('end-quiz-btn').classList.remove('hidden');
        saveProgress();
    }
}

// --- Progress & Levels ---
function updateProgressBar() {
    const total = allQuestions[currentSection].length;
    const progress = (currentQuestionIndex / total) * 100;
    document.getElementById('quiz-progress').style.width = `${progress}%`;
}

function saveProgress() {
    let savedData = JSON.parse(localStorage.getItem('cpaDisneyProgress')) || { totalScore: 0, examsTaken: 0 };
    savedData.totalScore += score;
    savedData.examsTaken += 1;
    localStorage.setItem('cpaDisneyProgress', JSON.stringify(savedData));
}

function updateHomeProgress() {
    let savedData = JSON.parse(localStorage.getItem('cpaDisneyProgress')) || { totalScore: 0, examsTaken: 0 };
    
    // Determine level based on total score across all time
    let levelName = "Mouseketeer";
    if (savedData.totalScore > 10) levelName = "Jedi Padawan";
    if (savedData.totalScore > 30) levelName = "Avenger in Training";
    if (savedData.totalScore > 50) levelName = "CPA Sorcerer Supreme ✨";

    document.getElementById('user-level').innerText = levelName;
    
    // Fake overall progress bar based on an arbitrary "end goal" of 80 points
    let percent = Math.min((savedData.totalScore / 80) * 100, 100);
    document.getElementById('overall-progress').style.width = `${percent}%`;
}
