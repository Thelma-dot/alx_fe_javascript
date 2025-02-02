const quotes = [
    { text: "Be the change you wish to see in the world.", category: "inspirational" },
    { text: "The only way to do great work is to love what you do.", category: "work" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "leadership" }
  ];
  let selectedCategory = localStorage.getItem('selectedCategory') || 'all';
const mockApiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Simulated API endpoint

  
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

// Populate the category dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))];

  // Clear existing options except "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Add new category options
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore the last selected category
  categoryFilter.value = selectedCategory;
}

// Filter quotes based on the selected category
function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  selectedCategory = categoryFilter.value;
  localStorage.setItem('selectedCategory', selectedCategory);
  showRandomQuote();
}



  // Show a random quote from the filtered list
function showRandomQuote() {
  const filteredQuotes = selectedCategory === 'all'
    ? [...quotes]
    : quotes.filter(quote => quote.category === selectedCategory);

  
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

  // Add a new quote
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
  populateCategories();
  showRandomQuote();
  syncWithServer(); // Sync with server after adding a new quote
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
        syncWithServer(); // Sync with server after importing quotes
      } catch (error) {
        alert('Invalid JSON file. Please upload a valid quotes JSON file.');
      }
    };
    fileReader.readAsText(file);
  }

// Simulate fetching quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(mockApiUrl);
    const data = await response.json();
    // Simulate server response by mapping data to quotes
    const serverQuotes = data.map(post => ({
      text: post.title,
      category: `Server Category ${post.id}`,
    }));
    return serverQuotes;
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
    return [];
  }
}

// Send a new quote to the server using a POST request
async function sendQuoteToServer(quote) {
  try {
    const response = await fetch(mockApiUrl, {
      method: 'POST', // Use POST to send data to the server
      headers: {
        'Content-Type': 'application/json', // Specify the content type
      },
      body: JSON.stringify(quote), // Convert the quote object to JSON
    });

    if (!response.ok) {
      throw new Error('Failed to send quote to server');
    }

    const data = await response.json();
    console.log('Quote sent to server:', data);
    document.getElementById('syncStatus').textContent = 'Quote sent to server successfully.';
    setTimeout(() => {
      document.getElementById('syncStatus').textContent = '';
    }, 3000);
  } catch (error) {
    console.error('Error sending quote to server:', error);
    document.getElementById('syncStatus').textContent = 'Failed to send quote to server.';
    setTimeout(() => {
      document.getElementById('syncStatus').textContent = '';
    }, 3000);
  }
}

// Sync quotes between local storage and server
async function syncQuotes() {
  try {
    // Fetch quotes from the server
    const serverQuotes = await fetchQuotesFromServer();
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

    // Merge server and local quotes (server data takes precedence)
    const mergedQuotes = [...localQuotes];
    serverQuotes.forEach(serverQuote => {
      const existingQuoteIndex = mergedQuotes.findIndex(
        quote => quote.text === serverQuote.text && quote.category === serverQuote.category
      );
      if (existingQuoteIndex === -1) {
        mergedQuotes.push(serverQuote); // Add new server quotes
      } else {
        mergedQuotes[existingQuoteIndex] = serverQuote; // Overwrite with server data
      }
    });

    // Update local storage and UI
    quotes = mergedQuotes;
    saveQuotes();
    populateCategories();
    showRandomQuote();

    // Notify user of sync status
    document.getElementById('syncStatus').textContent = 'Data synced with server.';
    setTimeout(() => {
      document.getElementById('syncStatus').textContent = '';
    }, 3000);

    // Notify user if conflicts were resolved
    if (serverQuotes.length > 0) {
      document.getElementById('conflictNotification').textContent = 'Conflicts resolved: Server data took precedence.';
      setTimeout(() => {
        document.getElementById('conflictNotification').textContent = '';
      }, 5000);
    }
  } catch (error) {
    console.error('Error syncing quotes:', error);
    document.getElementById('syncStatus').textContent = 'Failed to sync quotes with server.';
    setTimeout(() => {
      document.getElementById('syncStatus').textContent = '';
    }, 3000);
  }
}

// Sync with server every 30 seconds
setInterval(syncQuotes, 30000);

// Sync after adding a new quote
function addQuote() {
  // ... (add quote logic)
  syncQuotes(); // Sync with server after adding a new quote
}


// Sync local quotes with server data
async function syncWithServer() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

  // Merge server and local quotes (server data takes precedence)
  const mergedQuotes = [...localQuotes];
  serverQuotes.forEach(serverQuote => {
    const existingQuoteIndex = mergedQuotes.findIndex(
      quote => quote.text === serverQuote.text && quote.category === serverQuote.category
    );
    if (existingQuoteIndex === -1) {
      mergedQuotes.push(serverQuote); // Add new server quotes
    } else {
      mergedQuotes[existingQuoteIndex] = serverQuote; // Overwrite with server data
    }
  });

  // Update local storage and UI
  quotes = mergedQuotes;
  saveQuotes();
  populateCategories();
  showRandomQuote();

  // Notify user of sync status
  document.getElementById('syncStatus').textContent = 'Data synced with server.';
  setTimeout(() => {
    document.getElementById('syncStatus').textContent = '';
  }, 3000);

  // Notify user if conflicts were resolved
  if (serverQuotes.length > 0) {
    document.getElementById('conflictNotification').textContent = 'Conflicts resolved: Server data took precedence.';
    setTimeout(() => {
      document.getElementById('conflictNotification').textContent = '';
    }, 5000);
  }
}

  
  
  // Initialize application
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    updateCategoryButtons();
    showRandomQuote();
  
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
  
    
  // Sync with server every 30 seconds
  setInterval(syncWithServer, 30000);

    // Display the last viewed quote from session storage
    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
      const quote = JSON.parse(lastViewedQuote);
      document.getElementById('quoteDisplay').innerHTML = `<blockquote>"${quote.text}"</blockquote>`;
    }
  });
