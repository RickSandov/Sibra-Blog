const mongoose = require("mongoose");
const marked = require("marked");
const slugify = require("slugify");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  markdown: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  sanitizedHtml: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true
  }
});

// marked.setOptions({
//   renderer: new marked.Renderer(),
//   highlight: function (code, language) {
//     const hljs = require("highlight.js");
//     const validLanguage = hljs.getLanguage(language) ? language : "plaintext";
//     return hljs.highlight(validLanguage, code).value;
//   },
//   pedantic: false,
//   gfm: true,
//   breaks: true,
//   sanitize: false,
//   smartLists: true,
//   smartypants: true,
//   xhtml: false,
// });

articleSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown)); // Cleans the entry (malicious code)
  }

  next();
});

module.exports = mongoose.model("Article", articleSchema);
