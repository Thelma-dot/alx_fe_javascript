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

formDiv.appendChild(quoteInput);

formDiv.appendChild(categoryInput);

formDiv.appendChild(addButton);

document.body.appendChild(formDiv);

}
