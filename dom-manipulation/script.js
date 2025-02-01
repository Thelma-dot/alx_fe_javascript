const quotes = [
    { text: "Be the change you wish to see in the world.", category: "inspirational" },
    { text: "The only way to do great work is to love what you do.", category: "work" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "leadership" }
  ];
  let selectedCategory = null;
  
  // Load quotes from local storage on initialization
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
    }
  }
  
  // Save quotes to local storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  function showRandomQuote() {
    const filteredQuotes = selectedCategory
      ? quotes.filter(quote => quote.category === selectedCategory)
      : [...quotes];
  
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = filteredQuotes.length === 0 
      ? "No quotes available in the selected category."
      : `<blockquote>"${filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].text}"</blockquote>`;
  // Store the last viewed quote in session storage
  if (filteredQuotes.length > 0) {
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)]));
  }
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
    saveQuotes();
    updateCategoryButtons();
    showRandomQuote();
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

  // Export quotes to JSON file
function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  // Import quotes from JSON file
  function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;
  
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        updateCategoryButtons();
        showRandomQuote();
        alert('Quotes imported successfully!');
      } catch (error) {
        alert('Invalid JSON file. Please upload a valid quotes JSON file.');
      }
    };
    fileReader.readAsText(file);
  }
  
  
  
  // Initialize application
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    updateCategoryButtons();
    showRandomQuote();
  
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
  
    // Display the last viewed quote from session storage
    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
      const quote = JSON.parse(lastViewedQuote);
      document.getElementById('quoteDisplay').innerHTML = `<blockquote>"${quote.text}"</blockquote>`;
    }
  });
    
  
 


