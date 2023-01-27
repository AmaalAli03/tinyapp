//generates a random string of length 6 characters
function generateRandomString() {
  const result = Math.random().toString(36).substring(2, 8);
  return result;
}
//returns user id given email and users database
//returns undefined if  email doesnt exist 
function getUserByEmail(email, users) {
  for (let id in users) {
    if (users[id].email === email) {
      return users[id];
    }
  }
  return undefined;
}
//returns a url object given a userid and the url database
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
// exported the above function and imported them on the express_server.js file
module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser
};