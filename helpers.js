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

module.exports={
  generateRandomString,
  getUserByEmail
}