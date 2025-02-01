const quotes = [
  { text: "Be the change you wish to see in the world.", category: "inspirational" },
  { text: "The only way to do great work is to love what you do.", category: "work" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "leadership" }
];

let selectedCategory = null;

function showRandomQuote() {
  const filteredQuotes = selectedCategory
    ? quotes.filter(quote => quote.category === selectedCategory)
    : [...quotes];

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = filteredQuotes.length === 0 
    ? "No quotes available in the selected category."
    : `<blockquote>"${filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].text}"</blockquote>`;
}

function createAddQuoteForm() {
  const formDiv = document.createElement('div');

  const quoteInput = document.createElement('input');
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';
  quoteInput.id = 'newQuoteText';

  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';
  categoryInput.id = 'newQuoteCategory';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.onclick = addQuote;

  formDiv.append(quoteInput, categoryInput, addButton);
  document.getElementById('newQuote').insertAdjacentElement('afterend', formDiv);
}

function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert('Please fill in both fields.');
    return;
  }

  quotes.push({ text, category });
  textInput.value = '';
  categoryInput.value = '';
  updateCategoryButtons();
}

function updateCategoryButtons() {
  const categoriesDiv = document.getElementById('categories');
  categoriesDiv.innerHTML = '';

  [...new Set(quotes.map(quote => quote.category))].forEach(category => {
    const button = document.createElement('button');
    button.className = `category-btn${category === selectedCategory ? ' active' : ''}`;
    button.textContent = category;
    button.onclick = () => toggleCategory(category);
    categoriesDiv.appendChild(button);
  });
}

function toggleCategory(category) {
  selectedCategory = selectedCategory === category ? null : category;
  updateCategoryButtons();
  showRandomQuote();
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  createAddQuoteForm();
  updateCategoryButtons();
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  showRandomQuote(); // Show initial quote
});
