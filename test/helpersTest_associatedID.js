const helperFunctions = require('../helpers');

const { assert } = require('chai');



const testUsers = {
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

// note: this function only works after an email has been confirmed to exist in the database.
describe('Testing the associatedID function', function() {
  
  it('Given an email and a database (object) it should return the associated user data in an array', function() {
    const actualOutput = helperFunctions.associatedID("user@example.com", testUsers);
    const expectedOutput = [ 'userRandomID', 'user@example.com', 'purple-monkey-dinosaur' ];
    assert.deepEqual(actualOutput, expectedOutput);
    
  });

  it('Given an email and a database (object) it should return undefined if the email/user is not in the database', function() {
    const actualOutput = helperFunctions.associatedID("user1234@example.com", testUsers);
    const expectedOutput = undefined;
    assert.deepEqual(actualOutput, expectedOutput);
    
  });



});