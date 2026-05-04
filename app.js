let currentPath = '';
let currentLevel = 0;
let score = 0;
let questions = [];

// Initialize path selection
function selectPath(path) {
    currentPath = path;
    currentLevel = 0;
    score = 0;
    
    document.getElementById('selection-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    
    // Load local data instead of external fetch for instant reliability
    fetch('questions.json')
        .then(res => res.json())
        .then(data => {
            questions = data.filter(q => q.category === path);
            loadQuestion();
        })
        .catch(err => console.error("Error loading questions:", err));
}

function goBack() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('selection-screen').classList.remove('hidden');
    document.getElementById('feedback-area').classList.add('hidden');
}

function loadQuestion() {
    const q = questions[currentLevel];
    document.getElementById('feedback-area').classList.add('hidden');
    document.getElementById('level-indicator').innerText = `LEVEL ${currentLevel + 1}`;
    document.getElementById('question-text').innerText = q.question;
    
    const list = document.getElementById('options-list');
    list.innerHTML = '';
    
    document.getElementById('progress-fill').style.width = `${(currentLevel / questions.length) * 100}%`;

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-card';
        btn.innerText = opt.text;
        btn.onclick = () => checkAnswer(opt, q.explanation);
        list.appendChild(btn);
    });
}

function checkAnswer(selected, explanation) {
    const feedbackArea = document.getElementById('feedback-area');
    const feedbackText = document.getElementById('feedback-text');
    feedbackArea.classList.remove('hidden');

    if (selected.correct) {
        score++;
        feedbackText.innerHTML = `✅ <strong>Correct!</strong> 🎉 <br> ${explanation}`;
        feedbackArea.style.borderColor = "#27ae60";
    } else {
        feedbackText.innerHTML = `❌ <strong>Incorrect.</strong> <br> ${explanation}`;
        feedbackArea.style.borderColor = "#e74c3c";
    }

    // Scroll to feedback
    feedbackArea.scrollIntoView({ behavior: 'smooth' });
}

function nextQuestion() {
    currentLevel++;
    if (currentLevel < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.remove('hidden');
    
    const rating = Math.round((score / questions.length) * 100);
    document.getElementById('final-score').innerText = `${rating}% READINESS`;
    document.getElementById('career-path').innerText = currentPath.toUpperCase();
}
