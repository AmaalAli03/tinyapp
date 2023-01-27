const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

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

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const actual = getUserByEmail("user@example.com", testUsers);
    const expected = testUsers.userRandomID;
    // Write your assert statement here
    assert.equal(actual, expected);
  });
  it('should return undefined for a invalid email', function() {
    const actual = getUserByEmail(" ", testUsers);
    const expected = undefined;
    // Write your assert statement here
    assert.equal(actual, expected);
  });
});