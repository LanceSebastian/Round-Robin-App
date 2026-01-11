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

const fields = document.getElementById("formFields");
let matchList = [];
let currentMatchIndex = 0;
let matches = 0
function startTournament() {
    if (items.length < 2) {
        alert("Please add items to rank before starting the tournament.");
        return;
    }

    fields.disabled = true;

    console.log("Starting tournament with items:", items);
    // Further implementation for round-robin ranking goes here

    matches = items.length * (items.length - 1) / 2;
    console.log("Total matches to be played:", matches);

    matchList = setMatches(items); // Make this
    console.log("Match List:", matchList);

    displayNextMatch(); // Make this
}

