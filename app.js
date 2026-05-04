const careerData = {
    tax: {
        title: "Tax Professional",
        firmRatings: "Deloitte (4.8/5), PwC (4.7/5), EY (4.6/5)",
        desc: "Specialized in regulatory compliance and strategic tax planning.",
        levels: 10
    },
    audit: {
        title: "Auditor",
        firmRatings: "KPMG (4.7/5), PwC (4.8/5), Grant Thornton (4.5/5)",
        desc: "Focus on financial accuracy and risk mitigation.",
        levels: 10
    },
    investmentBanking: {
        title: "Investment Banking",
        firmRatings: "Goldman Sachs (4.9/5), JP Morgan (4.9/5), Morgan Stanley (4.8/5)",
        desc: "High-stakes valuation, M&A, and capital markets.",
        levels: 15
    },
    salesTrading: {
        title: "Sales & Trading",
        firmRatings: "Citadel (4.9/5), Jane Street (5.0/5), Barclays (4.6/5)",
        desc: "Fast-paced market execution and client relationship management.",
        levels: 12
    }
};

let currentPath = '';
let currentLevel = 0;
let score = 0;
let questions = [];

function selectPath(path) {
    currentPath = path;
    currentLevel = 0;
    score = 0;
    document.getElementById('selection-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    
    // Fetch path-specific questions
    fetch('questions.json')
        .then(res => res.json())
        .then(data => {
            questions = data.filter(q => q.category === path);
            loadQuestion();
        });
}

function loadQuestion() {
    const q = questions[currentLevel];
    document.getElementById('level-indicator').innerText = `Level ${currentLevel + 1} of ${questions.length}`;
    document.getElementById('question-text').innerText = q.question;
    
    const list = document.getElementById('options-list');
    list.innerHTML = '';
    
    const progress = ((currentLevel) / questions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;

    q.options.forEach(opt => {
        const btn = document.createElement('div');
        btn.className = 'option-card';
        btn.innerText = opt.text;
        btn.onclick = () => {
            if(opt.correct) score++;
            currentLevel++;
            if(currentLevel < questions.length) loadQuestion();
            else showResults();
        };
        list.appendChild(btn);
    });
}

function showResults() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.remove('hidden');
    
    const rating = (score / questions.length) * 100;
    document.getElementById('final-score').innerText = `${rating}% Readiness`;
    document.getElementById('career-path').innerText = careerData[currentPath].title;
    document.getElementById('firm-info').innerText = careerData[currentPath].firmRatings;
}
