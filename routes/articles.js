const express = require('express');
const router = express.Router();

const Article = require('./../models/article');
const multer = require('multer');

// Define storage for images

const storage = multer.diskStorage({

    // Destination for files
    destination: function (req, file, callback){
        callback(null, './public/images')
    },
    
    // add back extension
    filename: function (req, file, callback){
        callback(null, file.originalname)
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

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { article: article });
});


// Create post
router.post('/', upload.single('image'), async (req, res, next) => {

    console.log(req.file);

    req.article = new Article();
    next();
}, saveArticleAndRedirect('new'));



// method="PUT" to edit
router.put('/:id', upload.single('image'), async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleAndRedirect('edit'));


// method="DELETE";
router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
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

        try {
            //console.log(req.article._id, article._id);
            article = await article.save();
            res.redirect(`articles/${article.slug}`)
        } catch (e) {
            res.render(`articles/${path}`, { article: article }
            );
        }
    }
}

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    const articles = await Article.find().sort( { createdAt: 'desc' } );
    if(article == null) res.redirect('/')
    res.render('articles/show', { article: article, articles: articles });
});



module.exports = router;
