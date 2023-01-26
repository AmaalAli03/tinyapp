const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const { getUserByEmail, generateRandomString } = require("./helpers");

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
  users[id] = { id, email, password };
  res.cookie('user_id', id);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/login");
});

app.post("/login", (req, res) => {
  // res.cookie('user_id', req.body.username);
  // res.redirect("/urls");
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);

  if (!email || !password) {
    return res.status(403).send("ERROR: Please enter a valid email and password.");
  }
  if (!user) {
    return res.status(403).send("ERROR: Please enter a valid email. ");
  }

  users[id] = { id, email, password };
  res.cookie('user_id', id);
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[id].longURL = longURL;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const userId = req.cookies.user_id;
  if (!userId) {
    res.send("<html><body>You cannot shorten Urls because you are not logged in.</body></html>\n");
  } else {
    const key = generateRandomString();
    const longURL = req.body.longURL;
    urlDatabase[key].longURL = longURL;
    console.log(req.body); // Log the POST request body to the console
    res.redirect(`/urls/${key}`); // Respond with 'Ok' (we will replace this)
  }
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});
app.get("/register", (req, res) => {
  const userId = req.cookies.user_id;
  if (userId) {
    res.redirect("/urls");
  } else {
    const user = users[userId];
    const templateVars = { user };
    res.render("register", templateVars);
  }
});
app.get("/login", (req, res) => {
  const userId = req.cookies.user_id;
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
  const userId = req.cookies.user_id;
  if (!userId) {
    res.redirect("/login");
  } else {
    const user = users[userId];
    const templateVars = { user, };
    res.render("urls_new", templateVars);
  }
});

app.get("/urls", (req, res) => {
  //username is the property within the cookies object
  const userId = req.cookies.user_id;
  const user = users[userId];
  const templateVars = { urls: urlDatabase, user, };
  res.render("urls_index", templateVars);
});
// route is /:id is parameters in its path 
app.get("/urls/:id", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  const templateVars = {
    id: req.params.id,
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



