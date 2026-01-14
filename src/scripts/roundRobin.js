
const form = document.getElementById("addContent");
const items = [];

form.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const formData = new FormData(form);
    
    const name = formData.get("itemInput");

    const item = {
        id: items.length,
        name: name,
        score: 0
    }

    items.push(item);
    addItem(item.name);
    
    form.reset();
    
    console.log(items);
})

const template = document.getElementById("itemTemplate");
const itemList = document.getElementById("itemList");
function addItem(text) {
    
    const clone = template.content.cloneNode(true);
    
    clone.querySelector(".itemName").textContent = text;
    
    itemList.appendChild(clone);
    
}

const gameState = {
    matchIndex: 0,
    matches: [],
    score: [],
    phase: "setup" // can be "setup", "playing", "finished"
}

const PHASES = {
    SETUP: "setup",
    PLAYING: "playing",
    FINISHED: "finished"
}

// All state changes should go through this function
function setGameState(newState) {
    newState(gameState);
    render(gameState);
}

const fields = document.getElementById("formFields");
function setUp() {
    if (items.length < 2) {
        alert("Please add items to rank before starting the tournament.");
        return;
    }

    setGameState(state => {
        state.matches = setMatches(items).filter(match => match[0].id !== -1 && match[1].id !== -1);
        state.score = Array(state.matches.length).fill(null);
        state.phase = PHASES.PLAYING;
    });

    fields.disabled = true; // Move this to render function later
}

function finish() {
    setGameState(state => {
        state.phase = PHASES.FINISHED;
    });

    itemList.innerHTML = "";

    const counts = gameState.score.reduce((acc, val) => {
        acc[val.id] = (acc[val.id] || 0) + 1;
        return acc;
    }, {});

    for (const [id, count] of Object.entries(counts)) {
        const item = items.find(i => i.id == id);
        item.score = count;
    }

    const leaderboard = items
        .filter(item => item.id >= 0) // Remove BYE items
        .sort((a, b) => b.score - a.score);

    for (const item of leaderboard) {
        addItem(`${item.name} - Wins: ${item.score}`);
    }

    console.log("all items", leaderboard);
    fields.disabled = false; // Move this to render function later
}

function render(state) {
    const template = document.querySelector("#match-template")
    const matchListElement = document.querySelector("#matchList");

    const clone = template.content.cloneNode(true);
    matchListElement.innerHTML = "";

    if (state.phase === PHASES.PLAYING) {
        const currentMatch = state.matches[state.matchIndex];
        const currentScore = state.score[state.matchIndex];

        if (currentScore === currentMatch[0]) 
            clone.querySelector(".leftPlayer").classList.add("active");
        else if (currentScore === currentMatch[1]) 
            clone.querySelector(".rightPlayer").classList.add("active");
         else {
            clone.querySelector(".leftPlayer").classList.remove("active");
            clone.querySelector(".rightPlayer").classList.remove("active");
        }
        
        clone.querySelector(".leftName").textContent = currentMatch[0].name;
        clone.querySelector(".rightName").textContent = currentMatch[1].name;
        matchListElement.appendChild(clone);
    }

    syncUI();
}

function syncUI() {
    // Placeholder for future UI synchronization logic
    document.body.dataset.phase = gameState.phase;
}

function incrementMatch() {
    setGameState(state => {
        if (state.matchIndex < state.matches.length - 1) state.matchIndex++;
    });
}

function decrementMatch() {
    setGameState(state => {
        if (state.matchIndex > 0) state.matchIndex--;
    });
}

function left() { // Placeholder function
    setGameState(state => {
        state.score[state.matchIndex] = state.matches[state.matchIndex][0];
        if (state.score[state.matchIndex+1] == null && state.matchIndex < state.matches.length - 1) state.matchIndex++;
    });
}

function right() {
    setGameState(state => {
        state.score[state.matchIndex] = state.matches[state.matchIndex][1];
        if (state.score[state.matchIndex+1] == null && state.matchIndex < state.matches.length - 1) state.matchIndex++;
    });
}

function setMatches(items) {
    const matchArray = []

    if (items.length % 2 != 0) {
        items.push( item = { id: -1, name: "BYE", score: 0} );
    }

    for (let round = 0; round < items.length - 1; round++) {
        for (let i = 0; i < items.length / 2; i++) {
            const home = items[i];
            const away = items[items.length - 1 - i];
            if (home !== "BYE" && away !== "BYE") {
                matchArray.push([home, away]);
            }
        }
        items.splice(1, 0, items.pop());
    }

    return matchArray;
}

const matchCounter = document.getElementById("matchCounter");
const totalMatches = document.getElementById("totalMatches");

function updateMatchCounter() {
    matchCounter.textContent = gameState.matchIndex + 1;
    totalMatches.textContent = gameState.matches.length;
}

setInterval(updateMatchCounter, 100); // Update match counter every 100ms
document.addEventListener("DOMContentLoaded", syncUI);