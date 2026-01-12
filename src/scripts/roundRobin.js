
const form = document.getElementById("addContent");
const items = [];

form.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const formData = new FormData(form);
    
    const item = formData.get("itemInput");
    items.push(item);
    addItem(item);
    
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
    phase: "setup" // can be "setup", "playing", "finished"
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
        state.matches = setMatches(items);
        state.phase = "playing";
    });

    fields.disabled = true; // Move this to render function later
}

function render(state) {
    const matchListElement = document.getElementById("matchList");
    matchListElement.innerHTML = "";

    if (state.phase === "playing") {
        const currentMatch = state.matches[state.matchIndex];
        const matchItem = document.createElement("li");
        matchItem.textContent = `${currentMatch[0]} vs ${currentMatch[1]}`;
        matchListElement.appendChild(matchItem);
    }

    document.body.dataset.phase = state.phase;
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

function setMatches(items) {
    const matchArray = []

    if (items.length % 2 != 0) {
        items.push("BYE");
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

