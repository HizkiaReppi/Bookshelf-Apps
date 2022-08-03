let books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist() {
    if (typeof Storage === undefined) {
        alert('BROWSER KAMU TIDAK MENDUKUNG LOCAL STORAGE!');
        return false;
    }

    return true;
}

document.querySelector('#addBookBtn').addEventListener('click', () => {
    document.querySelector('.edit_section').classList.remove('show');
    document.querySelector('.input_section').classList.add('show');
});

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return { id, title, author, year, isCompleted };
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function addBook() {
    const textTitle = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const textYear = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;

    const generateID = generateId();
    const bookObject = generateBookObject(
        generateID,
        textTitle,
        textAuthor,
        textYear,
        isCompleted
    );

    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    Swal.fire({
        icon: 'success',
        title: 'BERHASIL MENAMBAH BUKU!',
        text: `BUKU ${textTitle} BERHASIL DITAMBAH!`,
    });

    document.querySelector('.input_section').classList.remove('show');

    getBooksInformation();
}

function updateBook(bookId) {
    const bookTarget = findBook(Number(bookId));
    if (bookTarget == null) return;

    const updateTitle = document.getElementById('updateBookTitle').value;
    const updateAuthor = document.getElementById('updateBookAuthor').value;
    const updateYear = document.getElementById('updateBookYear').value;
    const isComplete = document.getElementById('updateBookIsComplete').checked;

    bookTarget.title = updateTitle;
    bookTarget.author = updateAuthor;
    bookTarget.year = updateYear;
    bookTarget.isCompleted = isComplete;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    Swal.fire({
        icon: 'success',
        title: 'BERHASIL MENGUPDATE BUKU!',
        text: `BUKU ${bookTarget.title} BERHASIL DIUPDATE!`,
    });

    document.querySelector('.edit_section').classList.remove('show');

    getBooksInformation();
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
    });

    Toast.fire({
        icon: 'success',
        title: `BERHASIL MEMINDAHKAN BUKU "${bookTarget.title}"`,
    });
    getBooksInformation();
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    const bookTitle = findBook(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
    });

    Toast.fire({
        icon: 'success',
        title: `BERHASIL MENGHAPUS BUKU "${bookTitle.title}"`,
    });
    getBooksInformation();
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
    });

    Toast.fire({
        icon: 'success',
        title: `BERHASIL MEMINDAHKAN BUKU "${bookTarget.title}"`,
    });
    getBooksInformation();
}

function searchBooks() {
    const title = document.getElementById('searchBookTitle').value;

    const searchedBook = books.filter(function (book) {
        const bookName = book.title.toLowerCase();

        return bookName.includes(title.toLowerCase());
    });

    return searchedBook;
}

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

function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis: ${bookObject.author}`;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun: ${bookObject.year}`;

    const article = document.createElement('article');
    article.classList.add('book_item');
    article.append(textTitle, textAuthor, textYear);
    article.setAttribute('id', `${bookObject.id}`);

    const undoButton = document.createElement('button');
    undoButton.classList.add('green', 'shadow');

    if (bookObject.isCompleted) {
        undoButton.innerText = 'Belum Selesai Dibaca';
        undoButton.addEventListener('click', function () {
            Swal.fire({
                icon: 'question',
                title: `APAKAH ANDA YAKIN?`,
                text: `Buku "${bookObject.title}" Akan Dipindahkan ke Rak Belum Selesai Dibaca`,
                showDenyButton: true,
                denyButtonText: `Belum Deh`,
                confirmButtonText: 'Yakin Lah',
            }).then((result) => {
                if (result.isConfirmed) {
                    undoBookFromCompleted(bookObject.id);
                } else {
                    return;
                }
            });
        });
    } else {
        undoButton.innerText = 'Selesai dibaca';
        undoButton.addEventListener('click', function () {
            Swal.fire({
                icon: 'question',
                title: `APAKAH ANDA YAKIN?`,
                text: `Buku "${bookObject.title}" Akan Dipindahkan ke Rak Selesai Dibaca`,
                showDenyButton: true,
                denyButtonText: `Belum Deh`,
                confirmButtonText: 'Yakin Lah',
            }).then((result) => {
                if (result.isConfirmed) {
                    addBookToCompleted(bookObject.id);
                } else {
                    return;
                }
            });
        });
    }

    getBooksInformation();

    const updateButton = document.createElement('button');
    updateButton.classList.add('gold', 'shadow');
    updateButton.setAttribute('title', 'Edit Buku');
    updateButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    updateButton.addEventListener('click', function () {
        document.querySelector('.input_section').classList.remove('show');
        document.querySelector('.edit_section').classList.add('show');

        const bookId = bookObject.id;

        const updateForm = document.getElementById('updateBook');
        const bookItem = findBook(Number(bookId));

        const textTitle = document.getElementById('updateBookTitle');
        const textAuthor = document.getElementById('updateBookAuthor');
        const textYear = document.getElementById('updateBookYear');
        const isComplete = document.getElementById('updateBookIsComplete');

        textTitle.value = bookItem.title;
        textAuthor.value = bookItem.author;
        textYear.value = bookItem.year;
        isComplete.checked = bookItem.isCompleted;

        updateForm.addEventListener('submit', function (e) {
            e.preventDefault();
            updateBook(bookId);
        });
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('red', 'shadow');
    trashButton.setAttribute('title', 'Hapus Buku');
    trashButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    trashButton.addEventListener('click', function () {
        Swal.fire({
            icon: 'question',
            title: `APAKAH ANDA YAKIN?`,
            text: `Buku "${bookObject.title}" Akan Terhapus Dari List Buku Anda`,
            showDenyButton: true,
            denyButtonText: `Hapus Aja`,
            confirmButtonText: 'Belum Deh',
        }).then((result) => {
            if (result.isConfirmed) {
                return;
            } else {
                removeBookFromCompleted(bookObject.id);
            }
        });
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');
    buttonContainer.append(undoButton, updateButton, trashButton);

    article.append(buttonContainer);

    return article;
}

const cancelAddBook = document.querySelector('#cancelAddBook');
cancelAddBook.addEventListener('click', () => {
    document.querySelector('.input_section').classList.remove('show');
});

const cancelEdit = document.querySelector('#cancelEdit');
cancelEdit.addEventListener('click', (e) => {
    document.querySelector('.edit_section').classList.remove('show');
    e.preventDefault();
});

function getBooksInformation() {
    let completed = (notCompleted = 0);
    const bookshelf = books;

    const allBooks = books.length;

    for (let i = 0; i < allBooks; i++) {
        if (bookshelf[i]['isCompleted']) {
            completed += 1;
        } else {
            notCompleted += 1;
        }
    }

    document.querySelector('#totalBookCount').innerHTML = allBooks;
    document.querySelector('#totalCompleteCount').innerHTML = completed;
    document.querySelector('#totalNotCompleteCount').innerHTML = notCompleted;
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    const searchSubmit = document.getElementById('searchBook');
    const spanSubmitForm = document.querySelector('#inputBook span');
    const completeCheckbox = document.getElementById('inputBookIsComplete');

    submitForm.addEventListener('submit', function (e) {
        e.preventDefault();

        addBook();

        document.getElementById('inputBookTitle').value = '';
        document.getElementById('inputBookAuthor').value = '';
        document.getElementById('inputBookYear').value = '';
        document.getElementById('inputBookIsComplete').checked = false;
    });

    searchSubmit.addEventListener('submit', function (e) {
        e.preventDefault();
        searchBooks();
        document.dispatchEvent(new Event(RENDER_EVENT));
    });

    completeCheckbox.addEventListener('change', function () {
        spanSubmitForm.innerText = '';
        if (this.checked) {
            spanSubmitForm.innerText = 'Selesai Dibaca';
        } else {
            spanSubmitForm.innerText = 'Belum Selesai Dibaca';
        }
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById(
        'incompleteBookshelfList'
    );
    uncompletedBookList.innerText = '';

    const completedBookList = document.getElementById('completeBookshelfList');
    completedBookList.innerText = '';

    for (const bookItem of searchBooks()) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) uncompletedBookList.append(bookElement);
        else completedBookList.append(bookElement);
    }
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});
