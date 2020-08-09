const helperFunctions = require('../helpers');

const { assert } = require('chai');


const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", user_id: "userRandomID"},
  "9sm5xK": {longURL: "http://www.google.com", user_id: "user2RandomID"}
};





describe('Testing the urlsForUser function', function() {
  
  it('Given an id, a url database (object) it should return another database of associated urls', function() {
    let userURLdata = {};
    const actualOutput = helperFunctions.urlsForUser("userRandomID", urlDatabase, userURLdata);
    const expectedOutput = {"b2xVn2": "http://www.lighthouselabs.ca"};
    assert.deepEqual(actualOutput, expectedOutput);
    
  });

  it('Given an id and a database (object) it should return an empty object if there are no URLS linked to that user', function() {
    let userURLdata = {};
    const actualOutput = helperFunctions.urlsForUser("user1234", urlDatabase, userURLdata);
    const expectedOutput = {};
    assert.deepEqual(actualOutput, expectedOutput);
    
  });



});