const express = require("express");
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');
const app = express();
app.use(cookieParser())
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

const usersURLS = {};



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
  let templateVars = { 
  //urls: urlDatabase,
  urls: urlsForUser(req.cookies['user_id']),
  //username: req.cookies['username'],
  //username: users[req.cookies['user_id']]
  user_id: users[req.cookies['user_id']]
 };
  res.render("urls_index", templateVars);
});

// post request for generating a new url
app.post("/urls", (req, res) => {
  console.log('got to the /urls page')

  
  console.log('req.body',req.body);  // Log the POST request body to the console
  urlDatabase[generateRandomString()] = {
    longURL: req.body['longURL'],
    user_id: req.cookies['user_id']
    }
  console.log('this is the url database',urlDatabase);
  //res.send(`/urls/${Object.keys(urlDatabase)[Object.values(urlDatabase).indexOf(req.body['longURL'])]}`);         // Respond with 'Ok' (we will replace this)
  res.redirect('/urls');




});

app.get("/urls/new", (req, res) => {
  let templateVars = { 
    //username: req.cookies['username']
      //username: users[req.cookies['user_id']]
      user_id: users[req.cookies['user_id']]
   };

  
  
  res.render("urls_new",templateVars);

});


// get request for a new login page
app.get('/login', (req,res) => {
  let templateVars = { 
    //username: req.cookies['username']
    //username: users[req.cookies['user_id']]
    user_id: users[req.cookies['user_id']]
   };
  res.render('login_page.ejs',templateVars);
})


// post request for deleting urls
app.post("/urls/:shortURL/delete", (req, res) => {
  
  // if statement for making sure only a logged in user can delete
  if (req.cookies['user_id'] === urlDatabase[req.params.shortURL].user_id){
  console.log('the url is being deleted.',req.params.shortURL);
  delete urlDatabase[req.params.shortURL];
  delete usersURLS[req.params.shortURL];
  console.log('here is the entire db after deletion',urlDatabase);
  console.log('here is the usersURL db after deletion',usersURLS);
  res.redirect('/urls');} else{
    res.redirect('/login');
  }

})

// post request for editing the url
app.post("/urls/:shortURL", (req, res) => {
  
  // if statement for making sure only a logged in user can edit
  if (req.cookies['user_id'] === urlDatabase[req.params.shortURL].user_id) {
    console.log('the following tiny url is being updated.',req.params.shortURL);
    urlDatabase[req.params.shortURL] = {'longURL':req.body['longURL'], 'user_id':req.cookies['user_id']}
  
  console.log(urlDatabase);
  //res.send(`/urls/${Object.keys(urlDatabase)[Object.values(urlDatabase).indexOf(req.body['longURL'])]}`);
  res.redirect('/urls');} else{
    res.redirect('/login');
  }
})

// post request for logging in (this is the old one.)
// app.post("/login", (req, res) => {
//   console.log('a login attempt was made');
//   console.log(req.body);  // Log the POST request body to the console
  
//   res.cookie('username',req.body.username);
//   res.redirect('/urls');
  
// });

app.post('/logout', (req, res) => {

  console.log('user logged out')
  res.clearCookie('user_id');
  res.redirect('/urls');


})

// post request for the new login page
app.post('/login', (req, res) => {
  console.log('a login attempt was made');
  // needs to lookup the username/pw that is entered and confirm a match
  // also needs to set the user_id cookie upon a successful login

  // first use the emaillookup fcn to determine if the email exists in the db

  if (emailLookup(req.body.email)) {
    console.log('the email exists.');

    // retrieve the associated user info
    let correctUserInfo = assID(req.body.email);
    console.log('here is the correct info for this email',correctUserInfo);
    let correctID = correctUserInfo[0];
    let correctPW = correctUserInfo[2];
    if (bcrypt.compareSync(req.body.password, correctPW)) {
      console.log('the login was successful');
      res.cookie('user_id',correctID);
      res.redirect('/urls');
    } else{
      console.log('wrong password');
      res.status(403);
      res.send('wrong password');
    }
  } else {
    console.log('email does not exist');
    res.status(403);
    res.send('email does not exist');
  }


})





// get request for a /register page
app.get("/register",(req, res) => {
  console.log('welcome to the registration page.');
  let templateVars = { 
    //username: req.cookies['username']
    //username: users[req.cookies['user_id']]
    user_id: users[req.cookies['user_id']]
   };
  res.render("register_page",templateVars);
})


// post request for a register page
app.post('/register', (req,res) => {
  console.log('data has been submitted');
  //console.log(req.body);
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
 
 
 
  users[tempID] = {id: tempID, email: req.body.email,password:bcrypt.hashSync(req.body.password,10)};
  res.cookie('user_id',users[tempID].id);
  //console.log(users);

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



  res.redirect(urlDatabase[req.params.shortURL]['longURL']);
});




app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]['longURL'],  

   // username: req.cookies['username'] 
    user_id: users[req.cookies['user_id']]
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
      console.log('this email is in the db')
      return true;
    }
  }
  return false;
}


// function that finds the associated id/pw of an email address.
const assID = function(confirmedEmail) {
  //find the index of the id/pw in relation to the index of the email
  let allUsers = Object.keys(users);

  for (let user of allUsers) {
    let userValues = Object.values(users[user]);
   
    if (userValues.includes(confirmedEmail)) {
      //onsole.log('this is the user data for the correct email:', userValues)
      //userValues.indexOf(confirmedEmail);
      return userValues;
    }
    
  }
}





// function which returns the URLs where the userID is equal to the id of the currently logged-in user.
const urlsForUser = function(id) {
  //id = req.cookies['user_id'];

  // the object that will store this particular users information
  // it will not contain nested objects
  // shortURL:LongURL
  //let usersURLS = {};

  for (let x in urlDatabase) {
    
    //console.log(urlDatabase[x]['user_id']);
    if (urlDatabase[x]['user_id'] === id) {
      usersURLS[x] = urlDatabase[x]['longURL'];
    }
  }
  console.log('here is the usersURLS object',usersURLS);
  return usersURLS;
}

