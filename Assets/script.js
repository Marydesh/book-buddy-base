// var seachButton = document.getElementById('')
var searchInput = document.getElementById('search-bar');
var searchButton = document.getElementById('search-button');
const booksElement = document.querySelector('#books');
var searchInputVal = searchInput.value;
var wordInput = document.getElementById('word-input');
var wordInputVal = wordInput.value
var wordSearchButton = document.getElementById('word-search-button');
var dropDownOptions = document.getElementById('resultType');

// This wont work because you're just getting the value once, and this variable will not automatically be reassigned when the input changes 
// var q = dropDownOptions.value

var wordResultDisplay = $('#word-result');
var wordResults = document.getElementById('word-box')
// var dropDownSelect = document.querySelector('.dropDownSelect');
var wordList = document.querySelector('.wordList')
//var searchedWord = document.querySelector('.searched-word')
//hides seach results on page load//
$(document).ready(function () {
  $('#word-result').hide()
})




async function search(query) {
  requestURL = "https://openlibrary.org/search.json?q="
  let res = await fetch(requestURL + query)
  let data = await res.json()
  return data.docs
}
/*
  <div class="book card">
      <h2 class="title">Tom Sawyer Abroad</h2>
      <p class="subtitle">Mark Twain</p>
      <p></p>
  </div>


*/
async function searchOpenLibrary(searchInputVal) {
  let books = await search(searchInputVal)
  books = books.slice(0, 6)
  console.log(books)
  // for each book
  books.forEach(book => {
    // create card
    let cardDiv = document.createElement('div')
    cardDiv.classList = "book card p-5 m-5"
    // create the title element
    let titleH2 = document.createElement('h2')
    titleH2.classList = 'title is-size-1 is-size-3-mobile'
    titleH2.innerText = book.title

    cardDiv.append(titleH2)

    appendProperty('Author', book.author_name[0])
    appendProperty('First year published', book.first_publish_year)
    appendProperty('Number of pages', book.number_of_pages_median)
    appendProperty('First sentence', book.first_sentence?.[0])
    appendProperty('Currently reading', book.currently_reading_count)
    appendProperty('E-Book access', book.ebook_access)

    //var checkoutLink = document.createAttribute('a');
    //checkoutLink.text = "Checkout this book now"
    //checkoutLink.href = 'https://openlibrary.org' + book.seed[0]; 


    var appendLink = document.createElement('a');
    appendLink.text = "Buy on Amazon";
    appendLink.href = 'https://www.amazon.com/s?k=' + book.id_amazon?.[0];


    var bookCover = document.createElement("img");
    bookCover.setAttribute("src", 'https://covers.openlibrary.org/b/id/' + book.cover_i + '.jpg');
    bookCover.setAttribute("height", "140");
    bookCover.setAttribute("width", "140");


    booksElement.append(cardDiv)
    cardDiv.append(bookCover)
    cardDiv.append(appendLink)
    //cardDiv.append(checkoutLink)

    function appendProperty(title, value) {
      let p = document.createElement('p')
      p.innerHTML = `${title}: ${value}`
      cardDiv.append(p)
    }
  })
}

searchButton.addEventListener('click', formSearchButton)


function formSearchButton(event) {
  event.preventDefault();

  var searchInputVal = searchInput.value

  if (!searchInputVal) {
    console.error('Enter the title of the book or the author name');
    return;
  }
  localStorage.setItem('Your search', searchInputVal)

  console.log(searchInputVal);

  searchOpenLibrary(searchInputVal)
  search(searchInputVal)
}

wordSearchButton.addEventListener('click', wordSearch)

async function searchWord(wordInputVal) {

  const wordURL = 'https://wordsapiv1.p.rapidapi.com/words/';
  var searchType = dropDownOptions.value
  if (searchType == "default") return
  wordList.innerHTML = ""

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'c2cec6dc1amsha61515a761a8c29p11765cjsn69c9ea2d72f4',
      'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
    }
  };

  let endpoint = wordURL + wordInputVal + '/' + searchType

  let res = await fetch(endpoint, options)
  let data = await res.json()

  let results = data[searchType]
  if (searchType == "rhymes") results = results.all
  if (results.length === 0) {
    let card = createCard()
    card.innerText = "No results found"
    wordList.append(card)
    return
  }
  for (var i = 0; i < results.length; i++) {
    let result = results[i]
    let cardResult = createCard()
    
    if (searchType === 'definitions') {
      // let titleH2 = document.createElement('h2')
      // titleH2.classList = 'title is-size-1 is-size-3-mobile'
      // titleH2.innerText = data.word
      // cardResult.append(titleH2)
      cardResult.innerText = result.definition
    } else {
      cardResult.innerText = result
    }
    
    wordList.append(cardResult)

    function appendProperty(title, value) {
      let p = document.createElement('p')
      p.innerHTML = `${title}: ${value}`
      cardResult.append(p)
    }
  }

}

function createCard() {
  let card = document.createElement('div')
  card.classList = "card card-result p-5 m-5"
  return card
}
    
function wordSearch(event) {
  event.preventDefault();

  var wordInputVal = wordInput.value

  if (!wordInputVal) {
    console.error('Enter the word!');
    return;
  }
  localStorage.setItem('The word you search:', wordInputVal)

  // console.log('The word you search:  ' + wordInputVal);

  searchWord(wordInputVal)
  //on change of options in dropdown
  dropDownOptions.onchange = dropDownOptionsPick()
}


function dropDownOptionsPick() {
  var q = dropDownOptions.value
  console.log('You selected:' + q)
  //display the value of dropdown
  // dropDownSelect.textContent = q;
  $('#word-result').show()




}


