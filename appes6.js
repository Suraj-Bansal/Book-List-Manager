class Book {
   constructor(title, author, isbn) {
      this.title = title;
      this.author = author;
      this.isbn = isbn;
   }
}

class UI {
   addBookToList(book) {
      const list = document.getElementById('book-list');
      // Create tr ELement
      const row = document.createElement('tr');
      // Insert Cols
      row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href = "#" class = "delete">X</a></td>
      `;
      list.appendChild(row);
   }

   showAlert(message, className) {
      // Create Div
      const div = document.createElement('div');
      // Add Classes
      div.className  = `alert ${className}`;
      // Add Text
      div.appendChild(document.createTextNode(message));
      // Get Parent
      const container = document.querySelector('.container');
      //Get Form
      const form = document.querySelector('#book-form');
      //Insert Alert
      container.insertBefore(div, form);
      // Timeout After 3 Seconds
      setTimeout(function(){
         document.querySelector('.alert').remove();
      }, 3000);
   }

   deleteBook(target) {
      if(target.className === 'delete') {
         target.parentElement.parentElement.remove();
      }
   }

   clearFields() {
      document.getElementById('title').value = '';
      document.getElementById('author').value = '';
      document.getElementById('isbn').value = '';
   }
}

// Local Storage Class 
class Store { 
   static getBooks() {
      let books;
      if(localStorage.getItem('books') === null) {
         books = [];
      }
      else {
         books = JSON.parse(localStorage.getItem('books'));
      }

      return books;
   }

   static displayBooks() {
      const books = Store.getBooks();

      books.forEach(function(book){
         const ui = new UI;

         // Add Book to UI
         ui.addBookToList(book);
      });
   }

   static addBook(book) {
      const books = Store.getBooks();

      books.push(book);

      localStorage.setItem('book', JSON.stringify(books));
   }

   static removeBook(isbn) {
      const books = Store.getBooks();

      books.forEach(function(book, index){
         if(book.isbn === isbn) {
            books.splice(index, 1);
         }
      });
      localStorage.setItem('books', JSON.stringify(books));
   }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listener for Add Book
document.getElementById('book-form').addEventListener('submit', function(e) {
   // Get Form Values
   const title = document.getElementById('title').value;
   const author = document.getElementById('author').value;
   const isbn = document.getElementById('isbn').value;

   // Instantiate Book
   const book = new Book(title, author, isbn);

   // Instantiate UI
   const ui = new UI();

   console.log(ui);

   // Validate
   if(title === '' || author === '' || isbn === '') {
      // Error Alert
      ui.showAlert('Please fill in all fields', 'error');
   }
   else {
      // Add Book to List
      ui.addBookToList(book);

      // Add to Local Storage
      Store.addBook(book);

      // Show Success
      ui.showAlert('Book Added!', 'success');

      //Clear Fields
      ui.clearFields();
   }

   e.preventDefault();
});

// Event Listener for Delete
document.getElementById('book-list').addEventListener('click', function(e){

   // Instantiate UI
   const ui = new UI();

   // Delete Book
   ui.deleteBook(e.target);

   // remove From Local Storage
   Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

   // Show Message
   ui.showAlert('Book Removed!', 'success');

   e.preventDefault();
});