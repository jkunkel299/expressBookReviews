const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// determine if username is valid. Used in general.js when determining if a username is already taken
const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

//returns boolean value for whether a user is within the list of valid users
const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    // if either username or password is null, cannot log in
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    // if username/password pair are within registered users list, grants the user JWT access token
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access');
  
        req.session.authorization = {
            accessToken,username
        }
        
        return res.status(200).send("User successfully logged in");
    // if the username/password pair are not within the registered users list, user cannot log in
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let review = req.query.review; 
    // access "customer" from index.js to get session username
    let customer = req.session.authorization.username;
    
    books[isbn].reviews[customer] = review;
    res.send("Updated book with ISBN "+isbn+" with review: "+review+" for user "+customer+" successfully");
});

// Delete a book review
regd_users.delete("/auth/review/:isbn",(req,res)=>{
    let isbn = req.params.isbn;
    let customer = req.session.authorization.username;
    // if the customer has a review for this book (by ISBN), deletes the customer's review for that book
    if(books[isbn].reviews[customer]){
        delete books[isbn].reviews[customer]
    }
    res.send("Deleted review of book with ISBN "+isbn+" for user "+customer+" successfully");
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
