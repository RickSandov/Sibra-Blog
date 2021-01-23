const express = require("express");
const mongoose = require("mongoose");
const Article = require('./models/article')
const articleRouter = require("./routes/articles").router;
const usersRouter = require("./routes/users");
const app = express();
const methodOverride = require('method-override');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');

require('./config/passport');

const DB_URI = process.env.DB_URI || "mongodb://localhost/blog";

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}, err => {
  if (err) return console.log(`Error while connecting to DB\n`, err);

  return console.log(`Connected DB`);
});

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'mysecretapp',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.get("/admin", (req, res) => {
  res.render("users/sign-in");
});

app.get("/", async (req, res) => {
  const articles = await Article.find().sort( { createdAt: 'desc' });
  res.render("articles/index", { articles: articles });
});

app.listen(5000, () => console.log('App listening on port: ' + 5000));

app.use("/articles", articleRouter);
app.use("/admin", usersRouter);
