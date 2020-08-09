const emailLookup = function(checkEmail, database) {
  let allUsers = Object.keys(database);
  for (let user of allUsers) {
   

    let userValues = Object.values(database[user]);
   


    
    if (userValues.includes(checkEmail)) {
      
      return true;
    }
  }
  return false;
};





const associatedID = function(confirmedEmail, database) {
  
  let allUsers = Object.keys(database);

  for (let user of allUsers) {
    let userValues = Object.values(database[user]);
   
    if (userValues.includes(confirmedEmail)) {
      
      return userValues;
    }
    
  }
};



const urlsForUser = function(id, urlDB, userURLdb) {


  // userURLdb is the object that will store this particular users information
  // it will not contain nested objects
  // shortURL:LongURL
  //let usersURLS = {};

  for (let x in urlDB) {
    
    
    if (urlDB[x]['user_id'] === id) {
      userURLdb[x] = urlDB[x]['longURL'];
    }
  }
  
  return userURLdb;
};

const generateRandomString = function() {
  return Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2,5);
};

const helperFunctions = {
  emailLookup: emailLookup,
  associatedID: associatedID,
  urlsForUser: urlsForUser,
  generateRandomString: generateRandomString
};

module.exports = helperFunctions;


