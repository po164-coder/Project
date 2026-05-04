// Path Selection Logic
function selectPath(path) {
    console.log("Path selected:", path); // Debugging
    currentPath = path;
    currentLevel = 0;
    score = 0;
    
    document.getElementById('selection-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    
    loadQuestionsForPath(path);
}

// AI Factor Simulation
function askAI() {
    const input = document.getElementById('ai-user-input').value;
    const output = document.getElementById('ai-chat-output');
    
    if (!input) return;

    output.innerHTML = "<em>AI is thinking...</em>";

    // Simulate AI response logic
    setTimeout(() => {
        if (input.toLowerCase().includes("tip")) {
            output.innerText = "PRO TIP: When interviewing for Audit, emphasize your attention to detail and knowledge of SOX compliance.";
        } else if (input.toLowerCase().includes("test")) {
            output.innerText = "I can generate a mock test for you. Which technical area would you like to focus on first?";
        } else {
            output.innerText = `Interesting question about "${input}". In professional interviews, always structure your answer using the STAR method (Situation, Task, Action, Result).`;
        }
        document.getElementById('ai-user-input').value = "";
    }, 1000);
}

// Standard Quiz functions from previous steps remain here...
