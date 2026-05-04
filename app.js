const storeData = {
    sportsGirl: {
        title: "The Sports Girlie",
        desc: "You're high-energy and love the 'Active' lifestyle. You need high-performance gear that looks cute at the gym and the grocery store.",
        links: [
            { name: "Alo Yoga - New Arrivals", url: "https://www.aloyoga.com/?__a=0" },
            { name: "Lululemon - Bestsellers", url: "https://shop.lululemon.com/" },
            { name: "Nike - Women's Training", url: "https://www.nike.com/w/womens-training-gym-shoes-5e1x6zy7ok" }
        ]
    },
    baddie: {
        title: "The Baddie",
        desc: "Main character energy only. You love a bold fit, trendy denim, and looks that turn heads.",
        links: [
            { name: "Garage - Trending Now", url: "https://www.garageclothing.com/us/?srsltid=AfmBOopMkVT4smSMISMYK4vT4KNDMEgKBxdoXPkE_UfnoJ06I09A3j_y" },
            { name: "Princess Polly - Bestsellers", url: "https://www.princesspolly.com/collections/best-sellers" },
            { name: "Hollister - Gilly Hicks", url: "https://www.hollisterco.com/shop/us/gilly-hicks" }
        ]
    },
    cozy: {
        title: "The Cozy Queen",
        desc: "Comfort is your top priority. You live in soft fabrics, oversized hoodies, and neutral tones.",
        links: [
            { name: "Hollister - Cozy Collection", url: "https://www.hollisterco.com/shop/us/?cmp=PDS:EVG20:HCo:D:US:X:GGL:X:BST:X:X:X:X:x:HCO_Google_Search_DC_Brand-TM_US_Core_X_Brand_US_General_Hollister+Core_Exact_hollister&gclsrc=aw.ds&gad_source=1&gad_campaignid=20407526776&gbraid=0AAAAADw3OcLJHZsgZrrXq5mDqp4dR0srX&gclid=CjwKCAjw5NvPBhAoEiwA_2egfr2gG0X5kMl-n4CZg0_6Bc17W-E_OLXzS1tytl-kexiRMByfu7FSkBoCk94QAvD_BwE" },
            { name: "Skims - Lounge", url: "https://skims.com/collections/lounge" },
            { name: "Aritzia - CozyAF", url: "https://www.aritzia.com/us/en/brands/tna/cozyaf" }
        ]
    }
};

let questions = [];
let currentIdx = 0;
let points = { sportsGirl: 0, baddie: 0, cozy: 0 };

fetch('questions.json')
    .then(res => res.json())
    .then(data => {
        questions = data;
        loadQuestion();
    });

function loadQuestion() {
    const q = questions[currentIdx];
    document.getElementById('question-text').innerText = q.question;
    const list = document.getElementById('options-list');
    list.innerHTML = '';
    
    document.getElementById('progress-fill').style.width = `${((currentIdx) / questions.length) * 100}%`;

    q.options.forEach(opt => {
        const btn = document.createElement('div');
        btn.className = 'option-card';
        btn.innerText = opt.text;
        btn.onclick = () => {
            points[opt.profile]++;
            currentIdx++;
            if(currentIdx < questions.length) loadQuestion();
            else showResults();
        };
        list.appendChild(btn);
    });
}

function showResults() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.remove('hidden');
    document.getElementById('progress-fill').style.width = `100%`;

    const winner = Object.keys(points).reduce((a, b) => points[a] > points[b] ? a : b);
    const result = storeData[winner];

    document.getElementById('winning-profile').innerText = result.title;
    document.getElementById('profile-description').innerText = result.desc;

    const container = document.getElementById('links-container');
    container.innerHTML = ''; 
    
    result.links.forEach(l => {
        const link = document.createElement('a');
        link.href = l.url;
        link.target = "_blank"; 
        link.className = 'shop-link';
        link.innerText = l.name;
        container.appendChild(link);
    });
}