function generateRandomString() {
  const result = Math.random().toString(36).substring(2, 8);
  return result;
}

function getUserByEmail(email, users) {
  for (let id in users) {
    if (users[id].email === email) {
      return users[id];
    }
  }
  return null;
}

function urlsForUser(id, urlDatabase) {
  const userUrls = {};
  for (let shortUrl in urlDatabase) {
    if (urlDatabase[shortUrl].userID === id) {
      //... only the key value pairs inside the object {}
      userUrls[shortUrl] = urlDatabase[shortUrl].longURL;
    }
  }
  return userUrls;
}

module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser
};