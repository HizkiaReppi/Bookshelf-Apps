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
    document.querySelector('#btnCancelAddBook').classList.remove('hidden');
    document.querySelector('#btnCancelAddBook').classList.add('block');
    document.querySelector('#btnAddBook').classList.add('hidden');
    document.querySelector('#editSection').classList.remove('flex');
    document.querySelector('#editSection').classList.add('hidden');
    document.querySelector('#inputSection').classList.remove('hidden');
    document.querySelector('#inputSection').classList.add('flex');
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

function generateBookObject(id, title, author, year, isCompleted, imageUrl) {
    return { id, title, author, year, isCompleted, imageUrl };
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
    const selectedImage = document.getElementById('inputBookImage').files[0];
    let imageUrl = null

    if (selectedImage) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imageUrl = e.target.result;

            const generateID = generateId();
            const bookObject = generateBookObject(
                generateID,
                textTitle,
                textAuthor,
                textYear,
                isCompleted,
                imageUrl,
            );

            books.push(bookObject);

            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();

            Swal.fire({
                icon: 'success',
                title: 'BERHASIL MENAMBAH BUKU!',
                text: `BUKU ${textTitle} BERHASIL DITAMBAH!`,
            });

            document.querySelector('#inputSection').classList.remove('flex');
            document.querySelector('#inputSection').classList.add('hidden');

            getBooksInformation();
        }

        reader.readAsDataURL(selectedImage);
    } else {
        const generateID = generateId();
        const bookObject = generateBookObject(
            generateID,
            textTitle,
            textAuthor,
            textYear,
            isCompleted,
            imageUrl,
        );

        books.push(bookObject);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();

        Swal.fire({
            icon: 'success',
            title: 'BERHASIL MENAMBAH BUKU!',
            text: `BUKU ${textTitle} BERHASIL DITAMBAH!`,
        });

        document.querySelector('#inputSection').classList.remove('flex');
        document.querySelector('#inputSection').classList.add('hidden');

        getBooksInformation();
    }
}

function updateBook(bookId) {
    const bookTarget = findBook(Number(bookId));
    if (bookTarget == null) return;

    const updateTitle = document.getElementById('updateBookTitle').value;
    const updateAuthor = document.getElementById('updateBookAuthor').value;
    const updateYear = document.getElementById('updateBookYear').value;
    const isComplete = document.getElementById('updateBookIsComplete').checked;
    const selectedImage = document.getElementById('updateBookImage').files[0];

    let imageUrl = null

    if (selectedImage) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imageUrl = e.target.result;

            bookTarget.title = updateTitle;
            bookTarget.author = updateAuthor;
            bookTarget.year = updateYear;
            bookTarget.isCompleted = isComplete;
            bookTarget.imageUrl = imageUrl;

            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();

            Swal.fire({
                icon: 'success',
                title: 'BERHASIL MENGUPDATE BUKU!',
                text: `BUKU ${bookTarget.title} BERHASIL DIUPDATE!`,
            });

            document.querySelector('#editSection').classList.remove('flex');
            document.querySelector('#editSection').classList.add('hidden');

            getBooksInformation();
        }

        reader.readAsDataURL(selectedImage);
    } else {
        bookTarget.title = updateTitle;
        bookTarget.author = updateAuthor;
        bookTarget.year = updateYear;
        bookTarget.isCompleted = isComplete;
        bookTarget.imageUrl = imageUrl;

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();

        Swal.fire({
            icon: 'success',
            title: 'BERHASIL MENGUPDATE BUKU!',
            text: `BUKU ${bookTarget.title} BERHASIL DIUPDATE!`,
        });

        document.querySelector('#editSection').classList.remove('flex');
        document.querySelector('#editSection').classList.add('hidden');

        getBooksInformation();
    }
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
    textTitle.classList.add(
        'my-3',
        'mx-0',
        'text-lg',
        'sm:text-2xl',
        'font-bold'
    );
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.classList.add('my-2', 'mx-0', 'sm:text-lg', 'text-base');
    textAuthor.innerText = `Penulis: ${bookObject.author}`;

    const textYear = document.createElement('p');
    textYear.classList.add('my-2', 'mx-0', 'sm:text-lg', 'text-base');
    textYear.innerText = `Tahun: ${bookObject.year}`;

    const bookInfoContainer = document.createElement('div');
    bookInfoContainer.append(textTitle, textAuthor, textYear);

    const article = document.createElement('article');
    article.classList.add(
        'p-4',
        'pt-2',
        'my-3',
        'mx-0',
        'border',
        'border-solid',
        'border-black',
        'rounded-md',
        'dark:border-slate-700'
    );

    article.setAttribute('id', `${bookObject.id}`);

    const bookImage = document.createElement('img');
    bookImage.src = bookObject.imageUrl;
    bookImage.alt = `Cover Buku ${bookObject.title}`
    bookImage.classList.add('my-4', 'max-h-28', 'object-contain');

    const bookDataContainer = document.createElement('div');
    bookDataContainer.classList.add('flex', 'items-center', 'gap-5');
    bookDataContainer.append(bookImage, bookInfoContainer);

    const undoButton = document.createElement('button');
    undoButton.classList.add(
        'p-3',
        'bg-green-500',
        'text-white',
        'shadow-md',
        'rounded-md',
        'hover:shadow-xl',
        'hover:scale-105',
        'hover:ease-in-out',
        'hover:duration-300',
        'dark:bg-green-900'
    );

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
    updateButton.classList.add(
        'py-3',
        'px-4',
        'bg-amber-500',
        'text-white',
        'shadow-md',
        'rounded-md',
        'hover:shadow-xl',
        'hover:scale-105',
        'hover:ease-in-out',
        'hover:duration-300',
        'dark:bg-amber-900'
    );
    updateButton.setAttribute('title', 'Edit Buku');
    updateButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    updateButton.addEventListener('click', function () {
        document.querySelector('#inputSection').classList.remove('flex');
        document.querySelector('#inputSection').classList.add('hidden');
        document.querySelector('#editSection').classList.remove('hidden');
        document.querySelector('#editSection').classList.add('flex');

        const bookId = bookObject.id;

        const updateForm = document.getElementById('updateBook');
        const bookItem = findBook(Number(bookId));

        const textTitle = document.getElementById('updateBookTitle');
        const textAuthor = document.getElementById('updateBookAuthor');
        const textYear = document.getElementById('updateBookYear');
        const isComplete = document.getElementById('updateBookIsComplete');
        const updateImagePreview = document.getElementById('updateImagePreview');

        textTitle.value = bookItem.title;
        textAuthor.value = bookItem.author;
        textYear.value = bookItem.year;
        isComplete.checked = bookItem.isCompleted;
        updateImagePreview.src = bookItem.imageUrl;

        updateForm.addEventListener('submit', function (e) {
            e.preventDefault();
            updateBook(bookId);
        });
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add(
        'py-3',
        'px-4',
        'bg-red-600',
        'text-white',
        'shadow-md',
        'rounded-md',
        'hover:shadow-xl',
        'hover:scale-105',
        'hover:ease-in-out',
        'hover:duration-300',
        'dark:bg-red-900'
    );
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
    buttonContainer.classList.add('flex', 'gap-2');
    buttonContainer.append(undoButton, updateButton, trashButton);

    article.append(bookDataContainer, buttonContainer);

    return article;
}

const cancelAddBook = document.querySelector('#cancelAddBook');
cancelAddBook.addEventListener('click', (e) => {
    document.querySelector('#inputSection').classList.remove('flex');
    document.querySelector('#inputSection').classList.add('hidden');
    document.querySelector('#btnAddBook').classList.remove('hidden');
    document.querySelector('#btnAddBook').classList.add('block');
    document.querySelector('#btnCancelAddBook').classList.add('hidden');
    e.preventDefault();
});

const cancelEdit = document.querySelector('#cancelEdit');
cancelEdit.addEventListener('click', (e) => {
    document.querySelector('#editSection').classList.remove('flex');
    document.querySelector('#editSection').classList.add('hidden');
    e.preventDefault();
});

const darkModeToggle = document.querySelector('#darkModeToggle');
darkModeToggle.addEventListener('click', (e) => {
    document.querySelector('html').classList.add('dark');
    darkModeToggle.classList.remove('block');
    darkModeToggle.classList.add('hidden');
    whiteModeToggle.classList.remove('hidden');
    whiteModeToggle.classList.add('block');
    e.preventDefault();

    const head = document.querySelector('head');
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'assets/css/sweetalert2.dark.min.css');
    head.appendChild(link);
});

const whiteModeToggle = document.querySelector('#whiteModeToggle');
whiteModeToggle.addEventListener('click', (e) => {
    document.querySelector('html').classList.remove('dark');
    whiteModeToggle.classList.remove('block');
    whiteModeToggle.classList.add('hidden');
    darkModeToggle.classList.remove('hidden');
    darkModeToggle.classList.add('block');
    e.preventDefault();

    const link = document.getElementsByTagName('link')[2];
    link.remove();
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
    const inputImage = document.getElementById('inputBookImage');
    const imagePreview = document.getElementById('imagePreview');
    const updateImage = document.getElementById('updateBookImage');
    const updateImagePreview = document.getElementById('updateImagePreview');

    submitForm.addEventListener('submit', function (e) {
        e.preventDefault();

        addBook();

        document.getElementById('inputBookTitle').value = '';
        document.getElementById('inputBookAuthor').value = '';
        document.getElementById('inputBookYear').value = '';
        document.getElementById('inputBookIsComplete').checked = false;
        imagePreview.src = '';
        inputImage.value = '';
    });

    searchSubmit.addEventListener('keyup', function (e) {
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

    inputImage.addEventListener('change', () => {
        const selectedImage = inputImage.files[0];

        if (selectedImage) {
            const reader = new FileReader();

            reader.onload = (e) => {
                imagePreview.src = e.target.result;
            }

            reader.readAsDataURL(selectedImage);
        }
    });

    updateImage.addEventListener('change', () => {
        const selectedImage = updateImage.files[0];

        if (selectedImage) {
            const reader = new FileReader();

            reader.onload = (e) => {
                updateImagePreview.src = e.target.result;
            }

            reader.readAsDataURL(selectedImage);
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
