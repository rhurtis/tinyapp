const express = require("express");

const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const app = express();


const helperFunctions = require('./helpers');


app.use(cookieSession({
  name: 'session',
  keys: ['user_id'/* secret keys */],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


// object for storing ALL urls
const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", user_id: "userRandomID"},
  "9sm5xK": {longURL: "http://www.google.com", user_id: "user2RandomID"}
};

// object for storing URLS that were filtered for each user.

let usersURLS = {};



const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};




app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


// new route for /urls; this will pass URL data to our template
app.get("/urls", (req,res) => {
  let templateVars = {

    urls: helperFunctions.urlsForUser(req.session['user_id'], urlDatabase, usersURLS),

    user_id: users[req.session['user_id']]
  };
  res.render("urls_index", templateVars);
});

// post request for generating a new url
app.post("/urls", (req, res) => {
  

  
  
  urlDatabase[helperFunctions.generateRandomString()] = {
    longURL: req.body['longURL'],

    user_id: req.session['user_id']
  };

  res.redirect('/urls');




});

app.get("/urls/new", (req, res) => {
  let templateVars = {

    user_id: users[req.session['user_id']]
  };

  
  
  res.render("urls_new",templateVars);

});


// get request for a new login page
app.get('/login', (req,res) => {
  let templateVars = {

    user_id: users[req.session['user_id']]
  };

  res.render('login_page.ejs',templateVars);
});


// post request for deleting urls
app.post("/urls/:shortURL/delete", (req, res) => {
  
  // if statement for making sure only a logged in user can delete
  if (req.session['user_id'] === urlDatabase[req.params.shortURL].user_id) {
    
    delete urlDatabase[req.params.shortURL];
    delete usersURLS[req.params.shortURL];

    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }

});

// post request for editing the url
app.post("/urls/:shortURL", (req, res) => {
  
  // if statement for making sure only a logged in user can edit
  if (req.session['user_id'] === urlDatabase[req.params.shortURL].user_id) {
    
    urlDatabase[req.params.shortURL] = {'longURL':req.body['longURL'], 'user_id':req.session['user_id']};
  
    
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});


app.post('/logout', (req, res) => {

  req.session['user_id'] = null;
  usersURLS = {};
  res.redirect('/login');


});

// post request for the new login page
app.post('/login', (req, res) => {


  if (helperFunctions.emailLookup(req.body.email, users)) {
    

    // retrieve the associated user info
    let correctUserInfo = helperFunctions.associatedID(req.body.email, users);
    
    let correctID = correctUserInfo[0];
    let correctPW = correctUserInfo[2];
    if (bcrypt.compareSync(req.body.password, correctPW)) {
      
      req.session['user_id'] = correctID;
      res.redirect('/urls');
    } else {
      
      res.status(403);
      res.send('wrong password');
    }
  } else {
    
    res.status(403);
    res.send('email does not exist');
  }


});





// get request for a /register page
app.get("/register",(req, res) => {
  
  let templateVars = {

    user_id: users[req.session['user_id']]
  };
  res.render("register_page",templateVars);
});


// post request for a register page
app.post('/register', (req,res) => {
  
  
  let tempID = helperFunctions.generateRandomString();
  
  
  // the following if statement is for checking if the email address has already been used.
  let usersPrecheck = req.body.email; //this variable stores the email input before validation
  if (helperFunctions.emailLookup(usersPrecheck, users)) {
  
    res.status(400);
    res.send('Sorry but this email address has already been registered.');
    
  }
 
 
 
  users[tempID] = {id: tempID, email: req.body.email,password:bcrypt.hashSync(req.body.password,10)};
  
  req.session['user_id'] = users[tempID].id;
  

  if (users[tempID].email.length === 0 || users[tempID].password.length === 0) {
    delete users[tempID]; //deletes the user that was generated
    
    req.session['user_id'] = null;
    res.status(400);
    res.send('Thou shalt not pass: Username and/or password field is blank.');
    
    
  } else {

    res.redirect('/urls');
    
  }




  
});






// get request for the edit button on the index page
app.get("/urls/", (req, res) => {

  
  res.redirect('/urls/:shortURL');
});




app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]['longURL']);
});




app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]['longURL'],


    user_id: users[req.session['user_id']]
  };
  res.render("urls_show", templateVars);
});








