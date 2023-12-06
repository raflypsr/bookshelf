const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function cari(searchInput) {
  for (const bookSearch in books) {
    if (bookSearch.title == searchInput) {
      books = bookSearch;
    }
  }
  return;
}

document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("inputBook");
  const searchInput = document.getElementById("searchBookTitle");
  const searchForm = document.getElementById("searchBook");
  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    cari(searchInput.value);
  });
});

function addBook() {
  const id = generateId();
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;
  const bookObject = generateBookObject(id, title, author, year, isComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
  const incompleteShelf = document.getElementById("incompleteBookshelfList");
  const completeShelf = document.getElementById("completeBookshelfList");

  incompleteShelf.innerHTML = "";
  completeShelf.innerHTML = "";

  for (const book of books) {
    const bookElement = makeBook(book);
    if (book.isComplete == false) {
      incompleteShelf.append(bookElement);
    } else if (book.isComplete == true) {
      completeShelf.append(bookElement);
    }
  }
});

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function generateId() {
  return +new Date();
}

function makeBook(bookObject) {
  const booktitle = document.createElement("h3");
  booktitle.innerText = bookObject.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = bookObject.author;

  const bookYear = document.createElement("p");
  bookYear.innerText = bookObject.year;

  const actionWrapper = document.createElement("div");
  actionWrapper.classList.add("action");

  const greenButton = document.createElement("button");
  greenButton.classList.add("green");
  if (bookObject.isComplete) {
    greenButton.innerText = "Belum selesai di Baca";
  } else {
    greenButton.innerText = "Selesai dibaca";
  }

  if (bookObject.isComplete) {
    greenButton.addEventListener("click", function () {
      RemoveBookFromDone(bookObject.id);
    });
    actionWrapper.append(greenButton);
  } else {
    greenButton.addEventListener("click", function () {
      RemoveBookFromWasDone(bookObject.id);
    });
    actionWrapper.append(greenButton);
  }

  const redButton = document.createElement("button");
  redButton.classList.add("red");
  redButton.innerText = "Hapus buku";
  redButton.addEventListener("click", function () {
    deleteBook(bookObject.id);
  });
  actionWrapper.append(redButton);

  const article = document.createElement("article");
  article.classList.add("book_item");
  article.setAttribute("id", bookObject.id);
  article.append(booktitle, bookAuthor, bookYear);
  article.append(actionWrapper);

  return article;
}

function RemoveBookFromDone(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function RemoveBookFromWasDone(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const book of books) {
    if (book.id == bookId) {
      return book;
    }
  }
  return null;
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
