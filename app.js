let allQuestions = {};
let currentSection = '';
let currentBatch = [];
let currentQuestionIndex = 0;
let batchScore = 0;

// The 10 Epic Disney CPA Levels!
const disneyLevels = [
    { threshold: 0, name: "1 - Mouseketeer 🐭" },
    { threshold: 10, name: "2 - Star Command Recruit 🚀" },
    { threshold: 25, name: "3 - Jedi Padawan ⚔️" },
    { threshold: 45, name: "4 - Prince/Princess of Genovia 👑" },
    { threshold: 70, name: "5 - Wakandan Scholar 🐾" },
    { threshold: 100, name: "6 - Keyblade Master 🗝️" },
    { threshold: 150, name: "7 - Fairy Godmother ✨" },
    { threshold: 200, name: "8 - Jedi Knight 🌌" },
    { threshold: 250, name: "9 - Sorcerer Supreme 🪄" },
    { threshold: 300, name: "10 - Genie of the Lamp 🧞‍♂️ (Max Level!)" }
];

// Load questions on startup
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        allQuestions = data;
        updateDashboard();
    })
    .catch(error => console.error("Error loading questions:", error));

// --- Navigation ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function goHome() {
    updateDashboard();
    showScreen('home-screen');
}

// --- The Magic Mirror AI Chatbot ---
const flashcardBank = [
    { keywords: ["fraud", "steal", "embezzle"], q: "What are the primary components of the Fraud Triangle?", a: "Opportunity, Pressure (or Incentive), and Rationalization." },
    { keywords: ["audit", "risk"], q: "What is the Audit Risk Model?", a: "Audit Risk = Inherent Risk × Control Risk × Detection Risk." },
    { keywords: ["tax", "dependents"], q: "What is the gross income test limit for a qualifying relative?", a: "The dependent's gross income must be less than the exemption amount for the year." },
    { keywords: ["asset", "macrs"], q: "Under MACRS, what is the standard recovery period for office furniture and fixtures?", a: "7 years." },
    { keywords: ["ethics", "independence"], q: "According to the AICPA, when is independence impaired by financial interests?", a: "When a covered member owns any direct financial interest or a material indirect financial interest in a client." }
];

function searchAITopic() {
    const input = document.getElementById('ai-topic').value.toLowerCase();
    const flashcardDiv = document.getElementById('ai-flashcard');
    const errorDiv = document.getElementById('ai-error');
    
    // Reset
    flashcardDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    document.getElementById('ai-reveal-area').classList.add('hidden');
    document.getElementById('user-ai-answer').value = '';
    document.getElementById('submit-ai-btn').classList.remove('hidden');

    if (!input) return;

    let foundCard = flashcardBank.find(card => card.keywords.some(k => input.includes(k)));

    if (foundCard) {
        document.getElementById('ai-question').innerText = foundCard.q;
        document.getElementById('ai-answer').innerText = foundCard.a;
        flashcardDiv.classList.remove('hidden');
    } else {
        errorDiv.innerHTML = "<p>🧞‍♂️ Genie says: 'I don't have that wish granted yet! Try searching for fraud, audit, tax, or assets!'</p><button onclick='resetAISearch()'>Try Again</button>";
        errorDiv.classList.remove('hidden');
    }
}

function submitAIAnswer() {
    document.getElementById('submit-ai-btn').classList.add('hidden');
    document.getElementById('ai-reveal-area').classList.remove('hidden');
}

function resetAISearch() {
    document.getElementById('ai-topic').value = '';
    document.getElementById('ai-flashcard').classList.add('hidden');
    document.getElementById('ai-error').classList.add('hidden');
}

// --- Main Quiz Logic (Batches of 5) ---
function startQuiz(section) {
    if (!allQuestions[section] || allQuestions[section].length === 0) {
        alert("Oops! Make sure your questions.json has questions for " + section);
        return;
    }
    
    currentSection = section;
    currentQuestionIndex = 0;
    batchScore = 0;
    
    // Shuffle all questions for this section and slice exactly 5!
    let shuffled = [...allQuestions[section]].sort(() => 0.5 - Math.random());
    currentBatch = shuffled.slice(0, 5);
    
    document.getElementById('quiz-title').innerText = `${section} Exam`;
    document.getElementById('batch-complete').classList.add('hidden');
    document.getElementById('question-container').classList.remove('hidden');
    
    showScreen('quiz-screen');
    loadQuestion();
}

function loadQuestion() {
    const qData = currentBatch[currentQuestionIndex];
    document.getElementById('batch-counter').innerText = `Question ${currentQuestionIndex + 1} of ${currentBatch.length}`;
    document.getElementById('question-text').innerText = qData.question;
    
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

    let isCorrect = (selectedIndex === qData.correctAnswer);

    if (isCorrect) {
        btnElement.classList.add('correct');
        batchScore++;
        setTimeout(nextQuestion, 1200); 
    } else {
        btnElement.classList.add('wrong');
        buttons[qData.correctAnswer].classList.add('correct');
        triggerWrongConfetti();
        document.getElementById('explanation-text').innerText = qData.explanation;
        document.getElementById('explanation-box').classList.remove('hidden');
    }

    saveSectionStats(currentSection, isCorrect);
}

function triggerWrongConfetti() {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 }, colors: ['#E23636', '#2C1B4D'] });
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentBatch.length) {
        loadQuestion();
    } else {
        // End of Batch!
        document.getElementById('question-container').classList.add('hidden');
        document.getElementById('explanation-box').classList.add('hidden');
        document.getElementById('batch-score-text').innerText = `You scored ${batchScore} out of ${currentBatch.length}!`;
        document.getElementById('batch-complete').classList.remove('hidden');
        updateDashboard();
    }
}

// --- Dashboard & Progress Tracking ---
function updateProgressBar() {
    const progress = (currentQuestionIndex / currentBatch.length) * 100;
    document.getElementById('quiz-progress').style.width = `${progress}%`;
}

function saveSectionStats(section, isCorrect) {
    let stats = JSON.parse(localStorage.getItem('cpaStats')) || {};
    if (!stats[section]) stats[section] = { correct: 0, total: 0 };
    
    stats[section].total += 1;
    if (isCorrect) stats[section].correct += 1;
    
    localStorage.setItem('cpaStats', JSON.stringify(stats));
}

function updateDashboard() {
    let stats = JSON.parse(localStorage.getItem('cpaStats')) || {};
    
    // Calculate Total Score
    let totalCorrect = 0;
    let weakestSection = "Keep playing!";
    let lowestPercent = 100;

    for (let sec in stats) {
        totalCorrect += stats[sec].correct;
        let percent = (stats[sec].correct / stats[sec].total) * 100;
        if (percent < lowestPercent && stats[sec].total > 2) { // Need at least 3 attempts to judge
            lowestPercent = percent;
            weakestSection = `${sec} (${Math.round(percent)}% Accuracy)`;
        }
    }

    document.getElementById('total-score').innerText = totalCorrect;
    document.getElementById('weakest-section').innerText = weakestSection;

    // Determine Disney Level
    let currentLevelObj = disneyLevels[0];
    let nextLevelObj = disneyLevels[1];

    for (let i = 0; i < disneyLevels.length; i++) {
        if (totalCorrect >= disneyLevels[i].threshold) {
            currentLevelObj = disneyLevels[i];
            nextLevelObj = disneyLevels[i + 1] || disneyLevels[i];
        }
    }

    document.getElementById('user-level').innerText = currentLevelObj.name;

    // Mini Progress bar for the next level
    let range = nextLevelObj.threshold - currentLevelObj.threshold;
    let progressIntoLevel = totalCorrect - currentLevelObj.threshold;
    let percentToNext = range === 0 ? 100 : (progressIntoLevel / range) * 100;
    document.getElementById('level-progress').style.width = `${percentToNext}%`;
}
