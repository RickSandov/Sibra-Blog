const express = require("express");
const router = express.Router();

const Article = require("./../models/article");
const multer = require("multer");
const { isAuthenticated } = require("./../helpers/auth");
const fs = require("fs");
const path = require("path");

// Define storage for images

const storage = multer.diskStorage({
  // Destination for files
  destination: function (req, file, callback) {
    console.log("Destination");
    callback(null, "./public/images");
  },

  // add back extension
  filename: function (req, file, callback) {
    console.log("add extension");
    callback(null, Date.now().toString() + file.originalname );
  },
});

// upload parameters for multer
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});

router.get("/new", isAuthenticated, (req, res) => {
  res.render("articles/new", { article: new Article() });
});

router.get("/edit/:id", isAuthenticated, async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit", { article: article });
});

// Create post
router.post(
  "/",
  upload.single("image"),
  isAuthenticated,
  async (req, res, next) => {
    // return console.log(req.file, req.files);
    req.article = new Article();
    next();
  },
  saveArticleAndRedirect("new")
);

// method="PUT" to edit
router.put(
  "/:id",
  upload.single("image"),
  isAuthenticated,
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
  },
  saveArticleAndRedirect("edit")
);

// DLETE IMAGE TO UPDATE

router.delete("/edit/:id", isAuthenticated, async (req, res) => {
  let post = await Article.findById(req.params.id);
  const imgName = post.image;
  const imgPath = path.join(process.cwd(), "public", "images", imgName);
  fs.unlink(imgPath, (err) => {
    if (err) {
      console.log(err);
    }

  });

  post.image = null;
  post = await post.save();
  res.redirect(`/articles/edit/${post.id}`);
});

// method="DELETE";

router.delete("/:id", isAuthenticated, async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/admin/posts");
});

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    // console.log(req.params);
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;

    if (!article.image) {
      article.image = req.file.filename // aquí
    }

    if (!article.author) {
      article.author = req.user._id;
    }

    try {
      article = await article.save();
      console.log(article);
      res.redirect(`/admin/${article.slug}`);
    } catch (e) {
      res.render(`articles/${path}`, { article: article });
    }
  };
}

router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug }).populate({
    path: "author",
    select: { password: 0, name: 0, _id: 0 },
  });
  const articles = await Article.find().sort({ createdAt: "desc" });
  if (article == null) res.redirect("/");
  res.render("articles/show", { article: article, articles: articles });
});

module.exports = { router, upload };
