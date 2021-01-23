const express = require('express');
const path = require('path');
const Article = require('../models/article');
const router = express.Router();
const multer = require('multer');
const { isAuthenticated } = require('../helpers/auth');

// Define storage for images

const storage = multer.diskStorage({

    // Destination for files
    destination: function (req, file, callback){
        return callback(null, path.join(__dirname, '..', 'public', 'images'));
    },
    
    // add back extension
    filename: function (req, file, callback){
        return callback(null, file.originalname);
    }
});

// upload parameters for multer
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3
    }
});

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article });
});

router.get('/edit/:id', isAuthenticated, async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { article: article });
});


// Create post
router.post('/', upload.single('image'), isAuthenticated, async (req, res, next) => {

    req.article = new Article();
    next();
}, saveArticleAndRedirect('new'));



// method="PUT" to edit
router.put('/:id', upload.single('image'), isAuthenticated, async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleAndRedirect('edit'));


// method="DELETE";
router.delete('/:id', isAuthenticated, async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/admin/posts');
});


function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article;
        // console.log(req.params);
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        
        if(!article.image){
            article.image = req.file.filename;
        }

        if(!article.author){
            article.author = req.user._id;
        }


        try {
            article = await article.save();
            console.log(article);
            res.redirect(`/admin/${article.slug}`)
        } catch (e) {
            res.render(`articles/${path}`, { article: article }
            );
        }
    }
}

router.get('/:slug', async (req, res) => {
    const articleQuery = Article.findOne({ slug: req.params.slug }).populate({ path: 'author', select: { password: 0, name: 0, _id: 0 } });
    const articlesQuery = Article.find().sort( { createdAt: 'desc' });
    const [article, articles] = await Promise.all([articleQuery, articlesQuery]);
    if(article == null) res.redirect('/')
    res.render('articles/show', { article: article, articles: articles });
});

module.exports = { router, upload};
