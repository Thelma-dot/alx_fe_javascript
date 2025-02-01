// Initial array of quotes
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
    { text: "Happiness depends upon ourselves.", category: "Happiness" },
];

// Function to display a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        updateQuoteDisplay("No quotes available.", "Unknown");
        return;
    }
    let randomIndex = Math.floor(Math.random() * quotes.length);
    let quote = quotes[randomIndex];
    updateQuoteDisplay(quote.text, quote.category);
}

// Function to update the quote display
function updateQuoteDisplay(text, category) {
    let quoteDisplay = document.getElementById("quoteDisplay");

    // Remove previous quote text if it exists
    while (quoteDisplay.firstChild) {
        quoteDisplay.removeChild(quoteDisplay.firstChild);
    }

    let quoteText = document.createElement("p");
    quoteText.textContent = `"${text}"`;

    let quoteCategory = document.createElement("span");
    quoteCategory.textContent = ` - ${category}`;

    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
}

// Function to add a new quote
function addQuote() {
    let quoteTextInput = document.getElementById("newQuoteText");
    let quoteCategoryInput = document.getElementById("newQuoteCategory");

    let quoteText = quoteTextInput.value.trim();
    let quoteCategory = quoteCategoryInput.value.trim();

    if (quoteText === "" || quoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    quotes.push({ text: quoteText, category: quoteCategory });

    // Clear input fields after adding
    quoteTextInput.value = "";
    quoteCategoryInput.value = "";

    alert("Quote added successfully!");
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuote").addEventListener("click", addQuote);
