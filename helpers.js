const emailLookup = function (checkEmail, database) {
  let allUsers = Object.keys(database); //need to know to loop through
  //console.log('here are all the users',allUsers)
  // now loop through users object for every element in the allUsers array
  for (let user of allUsers) {
    //console.log('here is a user object',users[user]);

    // convert the user object into an array for looping, specifically get the values of the array.

    let userValues = Object.values(database[user]);
    //console.log('here are the values of this user object',userValues);


    // now check if a specific email is included in the values of that user
    if (userValues.includes(checkEmail)) {
      console.log('this email is in the db')
      return true;
    }
  }
  return false;
};





const assID = function(confirmedEmail, database) {
  //find the index of the id/pw in relation to the index of the email
  let allUsers = Object.keys(database);

  for (let user of allUsers) {
    let userValues = Object.values(database[user]);
   
    if (userValues.includes(confirmedEmail)) {
      //console.log('this is the user data for the correct email:', userValues)
      //userValues.indexOf(confirmedEmail);
      return userValues;
    }
    
  }
}



const urlsForUser = function(id, urlDB, userURLdb) {
  //id = req.cookies['user_id'];

  // the object that will store this particular users information
  // it will not contain nested objects
  // shortURL:LongURL
  //let usersURLS = {};

  for (let x in urlDB) {
    
    //console.log(urlDatabase[x]['user_id']);
    if (urlDB[x]['user_id'] === id) {
      userURLdb[x] = urlDB[x]['longURL'];
    }
  }
  console.log('here is the usersURLS object',userURLdb);
  return userURLdb;
}

function generateRandomString() {
  return Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2,5);
}

const helperFunctions = { 
  emailLookup: emailLookup,
  assID: assID,
  urlsForUser: urlsForUser,
  generateRandomString: generateRandomString 
};

module.exports = helperFunctions;


// module.exports = { 
//   emailLookup: emailLookup,
//   assID: assID,
//   urlsForUser: urlsForUser,
//   generateRandomString: generateRandomString 
// };