const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if(!doesExist(username)){
            users.push({"username": username, "password":password} );
            return res.status(200).json({message: "User successfully registered"});
        } else {
            return res.status(404).json({massage: "User already exist!"});
        }
    }
  return res.status(404).json({message: "Unable to register user"});
});

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const bookDetails = books[isbn];

  if(bookDetails) {
    return res.status(200).json(bookDetails);
  } else {
    return res.status(404).json({ message: "Book not found with the provided ISBN." });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const matchingBooks= [];
    for( const isbn in books){
        if(books[isbn].author === author){
            matchingBooks.push({
                isbn: isbn,
                title: books[isbn].title,
                reviews: books[isbn].reviews
            });
        }
    }
    if(matchingBooks.length >0){
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({massage: "Không tìm thấy tác giả"})
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const matchingTitles= [];
    for( const isbn in books){
        if(books[isbn].title === title){
            matchingTitles.push({
                isbn: isbn,
                title: books[isbn].title,
                reviews: books[isbn].reviews
            });
        }
    }
    if(matchingTitles.length >0){
        return res.status(200).json(matchingTitles);
    } else {
        return res.status(404).json({massage: "Không tìm thấy sách có tiêu đề"})
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const reviewBooks = books[isbn].reviews;
    if (reviewBooks) {
        return res.status(200).json(reviewBooks);
    } else {
        return res.status(404).json(reviewBooks);
    }
});

module.exports.general = public_users;