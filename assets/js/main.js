let books = []
const RENDER_EVENT = 'render-book'
const SAVED_EVENT = 'saved-book'
const STORAGE_KEY = 'BOOK_APPS'

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak mendukung local storage')
    return false
  }

  return true
}

const addBookBtn = document.querySelector('#addBookBtn')
addBookBtn.addEventListener('click', () => {
  const editSection = document.querySelector('.edit_section')
  editSection.classList.remove('show')
  const inputSection = document.querySelector('.input_section')
  inputSection.classList.add('show')
})

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books)
    localStorage.setItem(STORAGE_KEY, parsed)
    document.dispatchEvent(new Event(SAVED_EVENT))
  }
}

function generateId() {
  return +new Date()
}

function generateBookObject(id, title, author, year, isCompleted) {
  return { id, title, author, year, isCompleted }
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem
    }
  }
  return null
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index
    }
  }

  return -1
}

function addBook() {
  const textTitle = document.getElementById('inputBookTitle').value
  const textAuthor = document.getElementById('inputBookAuthor').value
  const textYear = document.getElementById('inputBookYear').value
  const isCompleted = document.getElementById('inputBookIsComplete').checked

  const generateID = generateId()
  const bookObject = generateBookObject(
    generateID,
    textTitle,
    textAuthor,
    textYear,
    isCompleted
  )

  books.push(bookObject)

  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
  alert(`BUKU "${textTitle}" BERHASIL DITAMBAHKAN!`)
  const inputSection = document.querySelector('.input_section')
  inputSection.classList.remove('show')
  getBooksInformation()
}

function updateBook(bookId) {
  const bookTarget = findBook(Number(bookId))
  if (bookTarget == null) return

  const updateTitle = document.getElementById('updateBookTitle').value
  const updateAuthor = document.getElementById('updateBookAuthor').value
  const updateYear = document.getElementById('updateBookYear').value
  const isComplete = document.getElementById('updateBookIsComplete').checked

  bookTarget.title = updateTitle
  bookTarget.author = updateAuthor
  bookTarget.year = updateYear
  bookTarget.isCompleted = isComplete

  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
  alert(`BUKU "${textTitle}" BERHASIL DIUPDATE!`)
  const editSection = document.querySelector('.edit_section')
  editSection.classList.remove('show')
  getBooksInformation()
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId)
  if (bookTarget == null) return

  bookTarget.isCompleted = true
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
  getBooksInformation()
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId)

  if (bookTarget === -1) return

  books.splice(bookTarget, 1)
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
  getBooksInformation()
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId)

  if (bookTarget == null) return

  bookTarget.isCompleted = false
  document.dispatchEvent(new Event(RENDER_EVENT))

  saveData()
  getBooksInformation()
}

function searchBooks() {
  const title = document.getElementById('searchBookTitle').value

  const serializedData = localStorage.getItem(STORAGE_KEY)
  const data = JSON.parse(serializedData)
  const searchedBooks = data.filter(function (book) {
    return (
      book.title.toLowerCase().includes(title) || book.title.includes(title)
    )
  })

  if (searchedBooks.length === 0) {
    alert('Buku tidak ditemukan!')
    return location.reload()
  }

  if (title !== '') {
    books = []
    for (const book of searchedBooks) {
      books.push(book)
    }

    document.dispatchEvent(new Event(RENDER_EVENT))
  } else {
    books = []
    loadDataFromStorage()
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY)

  let data = JSON.parse(serializedData)

  if (data !== null) {
    for (const book of data) {
      books.push(book)
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT))
}

function makeBook(bookObject) {
  const textTitle = document.createElement('h3')
  textTitle.innerText = bookObject.title

  const textAuthor = document.createElement('p')
  textAuthor.innerText = `Penulis: ${bookObject.author}`

  const textYear = document.createElement('p')
  textYear.innerText = `Tahun: ${bookObject.year}`

  const article = document.createElement('article')
  article.classList.add('book_item')
  article.append(textTitle, textAuthor, textYear)
  article.setAttribute('id', `${bookObject.id}`)

  const undoButton = document.createElement('button')
  undoButton.classList.add('green')

  if (bookObject.isCompleted) {
    undoButton.innerText = 'Belum selesai dibaca'
    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(bookObject.id)
    })
  } else {
    undoButton.innerText = 'Selesai dibaca'
    undoButton.addEventListener('click', function () {
      addBookToCompleted(bookObject.id)
    })
  }

  getBooksInformation()

  const updateButton = document.createElement('button')
  updateButton.classList.add('gold')
  updateButton.innerText = 'Update buku'
  updateButton.addEventListener('click', function () {
    const inputSection = document.querySelector('.input_section')
    inputSection.classList.remove('show')
    const editSection = document.querySelector('.edit_section')
    editSection.classList.add('show')

    const bookId = bookObject.id

    const updateForm = document.getElementById('updateBook')
    const bookItem = findBook(Number(bookId))

    const textTitle = document.getElementById('updateBookTitle')
    const textAuthor = document.getElementById('updateBookAuthor')
    const textYear = document.getElementById('updateBookYear')
    const isComplete = document.getElementById('updateBookIsComplete')

    textTitle.value = bookItem.title
    textAuthor.value = bookItem.author
    textYear.value = bookItem.year
    isComplete.checked = bookItem.isCompleted

    updateForm.addEventListener('submit', function (e) {
      updateBook(bookId)
      e.preventDefault()
    })
  })

  const trashButton = document.createElement('button')
  trashButton.classList.add('red')
  trashButton.innerText = 'Hapus buku'
  trashButton.addEventListener('click', function () {
    if (
      confirm(`APAKAH ANDA YAKIN INGIN MENGHAPUS BUKU "${bookObject.title}"?`)
    ) {
      removeBookFromCompleted(bookObject.id)
    } else {
      return
    }
  })

  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('action')
  buttonContainer.append(undoButton, updateButton, trashButton)

  article.append(buttonContainer)

  return article
}

const cancelAddBook = document.querySelector('#cancelAddBook')
cancelAddBook.addEventListener('click', () => {
  const inputSection = document.querySelector('.input_section')
  inputSection.classList.remove('show')
})

const cancelEdit = document.querySelector('#cancelEdit')
cancelEdit.addEventListener('click', (e) => {
  const editSection = document.querySelector('.edit_section')
  editSection.classList.remove('show')
  e.preventDefault()
})

console.log(books)

function getBooksInformation() {
  let completed = (notCompleted = 0)
  const bookshelf = books

  const allBooks = books.length

  for (let i = 0; i < allBooks; i++) {
    if (bookshelf[i]['isCompleted']) {
      completed += 1
    } else {
      notCompleted += 1
    }
  }

  document.querySelector('#totalBookCount').innerHTML = allBooks
  document.querySelector('#totalCompleteCount').innerHTML = completed
  document.querySelector('#totalNotCompleteCount').innerHTML = notCompleted
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook')
  const searchSubmit = document.getElementById('searchBook')
  const spanSubmitForm = document.querySelector('#inputBook span')
  const completeCheckbox = document.getElementById('inputBookIsComplete')

  submitForm.addEventListener('submit', function (e) {
    e.preventDefault()

    addBook()

    document.getElementById('inputBookTitle').value = ''
    document.getElementById('inputBookAuthor').value = ''
    document.getElementById('inputBookYear').value = ''
    document.getElementById('inputBookIsComplete').checked = false
  })

  searchSubmit.addEventListener('submit', function (e) {
    e.preventDefault()
    searchBooks()
  })

  completeCheckbox.addEventListener('change', function () {
    spanSubmitForm.innerText = ''
    if (this.checked) {
      spanSubmitForm.innerText = 'Selesai Dibaca'
    } else {
      spanSubmitForm.innerText = 'Belum Selesai Dibaca'
    }
  })

  if (isStorageExist()) {
    loadDataFromStorage()
  }
})

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById('incompleteBookshelfList')
  uncompletedBookList.innerText = ''

  const completedBookList = document.getElementById('completeBookshelfList')
  completedBookList.innerText = ''

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem)
    if (!bookItem.isCompleted) uncompletedBookList.append(bookElement)
    else completedBookList.append(bookElement)
  }
})

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY))
})
