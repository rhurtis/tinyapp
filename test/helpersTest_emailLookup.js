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

describe('Testing the emailLookup function', function() {
  
  it('Given an email and a database (object) it should return true if the email is in the database', function() {
    const actualOutput = helperFunctions.emailLookup("user@example.com", testUsers);
    const expectedOutput = true;
    assert.strictEqual(actualOutput, expectedOutput);
    
  });

  it('Given an email and a database (object) it should return false if the email is not in the database', function() {
    const actualOutput = helperFunctions.emailLookup("user1234@example.com", testUsers);
    const expectedOutput = false;
    assert.strictEqual(actualOutput, expectedOutput);
    
  });



});