const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  urlDatabase[generateRandomString()] = req.body['longURL'];
  console.log(urlDatabase);
  res.send(`/urls/${Object.keys(urlDatabase)[Object.values(urlDatabase).indexOf(req.body['longURL'])]}`);         // Respond with 'Ok' (we will replace this)
});


app.post("/urls/:shortURL/delete", (req, res) => {
  console.log('the url is being deleted.',req.params.shortURL);
  
  delete urlDatabase[req.params.shortURL];
  console.log(urlDatabase);
  res.redirect('/urls');

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
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});



function generateRandomString() {
  return Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2,5);
}