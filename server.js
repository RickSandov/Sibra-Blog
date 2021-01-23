const express = require("express");
const mongoose = require("mongoose");
const Article = require('./models/article')
const articleRouter = require("./routes/articles");
const usersRouter = require("./routes/users");
const app = express();
const methodOverride = require('method-override');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

require('./config/passport');

mongoose.connect("mongodb://localhost/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

app.set("view engine", "ejs");
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


app.use(express.static(path.join(__dirname, 'public')));


app.get("/", async (req, res) => {
  const articles = await Article.find().sort( { createdAt: 'desc' } );
  res.render("articles/index", { articles: articles });
});

app.get("/admin/posts", async (req, res) => {
  const articles = await Article.find().sort( { createdAt: 'desc' } );
  res.render("users/admin-posts", { articles: articles });
});

app.get("/admin", (req, res) => {
  res.render("users/admin");
});

app.listen(5000);



app.use("/articles", articleRouter);
app.use("/admin", usersRouter);