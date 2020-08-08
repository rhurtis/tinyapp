const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser())
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


// object for storing urls
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
}

//const usersPrecheck = {};


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


// new route for /urls; this will pass URL data to our template
app.get("/urls", (req,res) => {
  let templateVars = { urls: urlDatabase,
  //username: req.cookies['username'],
  username: users[req.cookies['user_id']]
 };
  res.render("urls_index", templateVars);
});

// post request for generating a new url
app.post("/urls", (req, res) => {
  console.log('got to the /urls page')
  console.log('req.body',req.body);  // Log the POST request body to the console
  urlDatabase[generateRandomString()] = req.body['longURL'];
  console.log('this is the url database',urlDatabase);
  //res.send(`/urls/${Object.keys(urlDatabase)[Object.values(urlDatabase).indexOf(req.body['longURL'])]}`);         // Respond with 'Ok' (we will replace this)
  res.redirect('/urls');
});

app.get("/urls/new", (req, res) => {
  let templateVars = { 
    //username: req.cookies['username']
      username: users[req.cookies['user_id']]
   };
  res.render("urls_new",templateVars);
});



// post request for deleting urls
app.post("/urls/:shortURL/delete", (req, res) => {
  console.log('the url is being deleted.',req.params.shortURL);
  
  delete urlDatabase[req.params.shortURL];
  console.log(urlDatabase);
  res.redirect('/urls');

})

// post request for editing the url
app.post("/urls/:shortURL", (req, res) => {
  console.log('the following tiny url is being updated.',req.params.shortURL);
  urlDatabase[req.params.shortURL] = req.body['longURL']
  
  console.log(urlDatabase);
  //res.send(`/urls/${Object.keys(urlDatabase)[Object.values(urlDatabase).indexOf(req.body['longURL'])]}`);
  res.redirect('/urls');
})

// post request for logging in
app.post("/login", (req, res) => {
  console.log('a login attempt was made');
  console.log(req.body);  // Log the POST request body to the console
  
  res.cookie('username',req.body.username);
  res.redirect('/urls');
  
});

app.post('/logout', (req, res) => {

  res.clearCookie('username');
  res.redirect('/urls');


})


// get request for a /register page
app.get("/register",(req, res) => {
  console.log('welcome to the registration page.');
  let templateVars = { 
    //username: req.cookies['username']
    username: users[req.cookies['user_id']]
   };
  res.render("register_page",templateVars);
})


// post request for a register page
app.post('/register', (req,res) => {
  console.log('data has been submitted');
  console.log(req.body);
  let tempID = generateRandomString();
  
  
  // the following if statement is for checking if the email address has already been used.
  usersPrecheck = req.body.email; //this variable stores the email input before submission
  if (emailLookup(usersPrecheck)) {
    //delete users[tempID] //deletes the user that was generated
    //res.clearCookie('user_id');
    
    res.status(400);
    res.send('Thou shalt not pass: Sorry but this email address has already been registered.');
    console.log('email already exists');
  }
 
 
 
  users[tempID] = {id: tempID, email: req.body.email,password:req.body.password};
  res.cookie('user_id',users[tempID].id);
  console.log(users);

  if (users[tempID].email.length === 0 || users[tempID].password.length === 0) {
    delete users[tempID] //deletes the user that was generated
    res.clearCookie('user_id');
    
    res.status(400);
    res.send('Thou shalt not pass: Username and/or password field is blank.');
    console.log('user/pw is blank');
    
  } else {

  res.redirect('/urls');
  console.log(users);
  }




  
})






// get request for the edit button on the index page
app.get("/urls/", (req, res) => {
  console.log('going to the url page')
  res.redirect('/urls/:shortURL')
})




app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  // let currentURL = window.location.href;
  // console.log(currentURL);
  // let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  // res.render("urls_show", templateVars);
  //res.render(":shortURL");
 // let urlID = req.ry.id;
 // console.log(urlDatabase[req.params.shortURL]);



  res.redirect(urlDatabase[req.params.shortURL]);
});




app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],  

   // username: req.cookies['username'] 
    username: users[req.cookies['user_id']]
   };
  res.render("urls_show", templateVars);
});



function generateRandomString() {
  return Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2,5);
}

const emailLookup = function (checkEmail) {
  let allUsers = Object.keys(users); //need to know to loop through
  //console.log('here are all the users',allUsers)
  // now loop through users object for every element in the allUsers array
  for (let user of allUsers) {
    //console.log('here is a user object',users[user]);

    // convert the user object into an array for looping, specifically get the values of the array.

    let userValues = Object.values(users[user]);
    //console.log('here are the values of this user object',userValues);


    // now check if a specific email is included in the values of that user
    if (userValues.includes(checkEmail)) {
      console.log('this email has already been registered.')
      return true;
    }
  }
  return false;
}