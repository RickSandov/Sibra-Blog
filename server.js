const express = require("express");
const mongoose = require("mongoose");
const Article = require('./models/article')
const articleRouter = require("./routes/articles");
const app = express();
const methodOverride = require('method-override');
const path = require('path');

const DB_URI = process.env.DB_URI || "mongodb://localhost/blog";

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));


app.get("/", async (req, res) => {
  const articles = await Article.find().sort( { createdAt: 'desc' } );
  res.render("articles/index", { articles: articles });
});

app.listen(5000);

app.use("/articles", articleRouter);
