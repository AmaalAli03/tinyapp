//paired programmed with github user @mary-a1

//import statements
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");

// helper functions
const { getUserByEmail, generateRandomString, urlsForUser } = require("./helpers");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
  name: "session",
  keys: ["key1", "key2"]
})
);

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);
  if (email === "" || password === "") {
    return res.status(400).send("ERROR: Please enter a valid input");
  }
  if (user) {
    return res.status(400).send("ERROR: Please enter an email that isnt already registered.");
  }
  users[id] = { id, email, password: bcrypt.hashSync(password, 10) };
  req.session.user_id = id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(403).send("ERROR: Please enter a valid email and password.");
  }
  const user = getUserByEmail(email, users);
  if (!user) {
    return res.status(403).send("ERROR: Please enter a valid email. ");
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(403).send("ERROR: Please enter a correct password! ");
  }
  req.session.user_id = user.id;
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const userId = req.session.user_id;
  const shortUrl = req.params.id;
  const longURL = req.body.longURL;
  if (!userId) {
    return res.send("<html><body>ERROR: You are not logged in! </body></html>\n");
  }
  if (!urlDatabase[shortUrl]) {
    return res.send("<html><body>ERROR: Shorturl does not exist! </body></html>\n");
  }
  const userUrls = urlsForUser(userId, urlDatabase);
  if (!userUrls[shortUrl]) {
    return res.send("<html><body>ERROR: You do not have access to this Url! </body></html>\n");
  }
  urlDatabase[shortUrl].longURL = longURL;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    return res.send("<html><body>You cannot shorten Urls because you are not logged in.</body></html>\n");
  }
  const shortUrl = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortUrl] = { longURL, userID };
  res.redirect(`/urls/${shortUrl}`);
});

app.post("/urls/:id/delete", (req, res) => {
  const userId = req.session.user_id;
  const shortUrl = req.params.id;
  if (!userId) {
    return res.send("<html><body>ERROR: You are not logged in! </body></html>\n");
  }
  if (!urlDatabase[shortUrl]) {
    return res.send("<html><body>ERROR: Shorturl does not exist! </body></html>\n");
  }
  const userUrls = urlsForUser(userId, urlDatabase);
  if (!userUrls[shortUrl]) {
    return res.send("<html><body>ERROR: You do not have access to this Url! </body></html>\n");
  }
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const userId = req.session.user_id;
  if (userId) {
    res.redirect("/urls");
  } else {
    const user = users[userId];
    const templateVars = { user };
    res.render("register", templateVars);
  }
});

app.get("/login", (req, res) => {
  const userId = req.session.user_id;
  if (userId) {
    res.redirect("/urls");
  } else {
    const user = users[userId];
    const templateVars = { user };
    res.render("login", templateVars);
  }
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    res.redirect("/login");
  } else {
    const user = users[userId];
    const templateVars = { user, };
    res.render("urls_new", templateVars);
  }
});

app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    res.send("<html><body>You are not logged in!</body></html>\n");
  } else {
    const userUrls = urlsForUser(userId, urlDatabase);
    const user = users[userId];
    const templateVars = { urls: userUrls, user };
    res.render("urls_index", templateVars);
  }
});

app.get("/urls/:id", (req, res) => {
  const userId = req.session.user_id;
  const shortUrl = req.params.id;
  if (!userId) {
    return res.send("<html><body>ERROR: You are not logged in! </body></html>\n");
  }
  if (!urlDatabase[shortUrl]) {
    return res.send("<html><body>ERROR: Shorturl does not exist! </body></html>\n");
  }
  const userUrls = urlsForUser(userId, urlDatabase);
  if (!userUrls[shortUrl]) {
    return res.send("<html><body>ERROR: You do not have access to this Url! </body></html>\n");
  }
  const user = users[userId];
  const templateVars = {
    id: shortUrl,
    longURL: urlDatabase[req.params.id].longURL,
    user,
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const shortUrl = req.params.id;
  if (!urlDatabase[shortUrl]) {
    res.send("<html><body>ERROR: This id does not exist </body></html>\n");
  } else {
    const longURL = urlDatabase[req.params.id].longURL;
    res.redirect(longURL);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



