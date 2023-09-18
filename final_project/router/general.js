const express = require('express');
const axios = require('axios'); // requiring axios package

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new user with username and password
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
/* Task 1: get entire book list
public_users.get('/',function (req, res) {
    res.send(JSON.stringify({books},null,4)); 
});*/

/* Task 10: get entire book list using promises */
public_users.get('/', function(req,res){
    Promise.resolve(books)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err));
})

// Get book details based on ISBN
/* Task 2: Get book by ISBN 
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});/*

/* Task 11: get book by ISBN using promises */
public_users.get('/isbn/:isbn', function(req,res){
    const isbn = req.params.isbn;
    Promise.resolve(books[isbn])
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err));
})
  
// Get book details based on author
/* Task 3: Get book by author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    
    var elements = Object.keys(books).map(function(k) {
        return books[k];
    })

    let filteredBooks = [];
    for (let i= 0; i<elements.length; i++) {
        if (elements[i].author === author ) {
            filteredBooks= [...filteredBooks, elements[i]];
        }
    }
    res.send(filteredBooks);
});*/

/* Task 12: Get book by author using promises */
public_users.get('/author/:author',function (req, res) {
    var getByAuthor = new Promise(function(resolve,reject){
        // get author from request parameters
        const author = req.params.author;
        
        // create list of books object keys (ISBN). This is an array that can be manipulated and filtered as normal, as books is an associative array and cannot be filtered using a for loop
        var elements = Object.keys(books).map(function(k) {
            return books[k];
        })
        
        //create empty array for filtered books
        let filteredBooks = [];
        // loop through list of books (elements) and filter by author matching that which was requested
        for (let i= 0; i<elements.length; i++) {
            if (elements[i].author === author ) {
                filteredBooks= [...filteredBooks, elements[i]];
            }
        }
        resolve(filteredBooks);
    })
    
    getByAuthor
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).send(err));
})


// Get all books based on title
/* Task 4: Get book by title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    
    var elements = Object.keys(books).map(function(k) {
        return books[k];
    })
    
    let filteredBooks = [];
    for (let i= 0; i<elements.length; i++) {
        if (elements[i].title === title ) {
            filteredBooks= [...filteredBooks, elements[i]];
        }
    }
    res.send(filteredBooks);
});*/

/* Task 13: Get book by title using promises */
public_users.get('/title/:title',function (req, res) {
    var getByTitle = new Promise(function(resolve,reject){
    
       // get title from request parameters
       const title = req.params.title;
        
       // create list of books object keys (ISBN). This is an array that can be manipulated and filtered as normal, as books is an associative array and cannot be filtered using a for loop
       var elements = Object.keys(books).map(function(k) {
           return books[k];
       })
       
       //create empty array for filtered books
       let filteredBooks = [];
       // loop through list of books (elements) and filter by author matching that which was requested
        for (let i= 0; i<elements.length; i++) {
            if (elements[i].title === title ) {
                filteredBooks= [...filteredBooks, elements[i]];
            }
        }
        resolve(filteredBooks);
    })
    
    getByTitle
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).send(err));
})


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
