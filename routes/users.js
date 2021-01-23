const express = require('express');
const router = express.Router();

const User = require('./../models/user');
const Article = require('./../models/article');

const passport = require('passport');

const { upload } = require('./articles');

const { isAuthenticated } = require('./../helpers/auth');



router.post('/sign-in', passport.authenticate('local', {
    successRedirect: '/admin/posts',
    failureRedirect: '/admin/sign-in',
    failureFlash: true
}));


// NEEDS AUTHENTICATION
router.get('/sign-up', isAuthenticated, (req, res) => {
    res.render('users/sign-up');
});

router.get('/posts', isAuthenticated, async (req, res) => {
    console.log(req.isAuthenticated());
    const articles = await Article.find().sort({ createdAt: 'desc' });
    res.render('users/admin-posts', { articles: articles });
});



// NEEDS AUTHENTICATION
router.post('/register', isAuthenticated, upload.single('image'), async (req, res) => {
    const { name, dispName, password, confirm_password } = req.body;
    const errors = [];
    let image;
    if (req.file) {
        image = req.file.filename;
    }

    console.log('Nuevo usuario');
    if (name.lenght <= 0) {
        errors.push({ text: 'Nombre inválido' });
    }
    if (password != confirm_password) {
        errors.push({ text: 'Las contraseñas no coinciden' });
    }
    if (password.lenght <= 4) {
        errors.push({ text: 'Contraseña debe tener más de 4 caracteres' })
    }
    if (errors.length > 0) {
        res.render('users/sign-up', { errors, name, dispName });
    } else {
        const nameUser = await User.findOne({ name: name });
        if (nameUser) {
            // req.flash('error_msg', `El ususario con correo electrónico ${email} ya está registrado. Intente con un correo diferente.`);
            res.redirect('/admin/sign-up');
        };
        const newUser = new User({ name, dispName, password, image });
        newUser.password = await newUser.encryptPassword(password);
        console.log(newUser);
        await newUser.save();
        // req.flash('success_msg', `Bienvenido, ${name}!`);
        res.redirect('/admin/sign-in');
    }
});


router.get('/log-out', (req, res) => {
    req.logOut();
    res.redirect('sign-in');
});


router.get('/:slug', isAuthenticated, async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug }).populate({ path: 'author', select: { password: 0, name: 0, _id: 0 } });
    const articles = await Article.find().sort({ createdAt: 'desc' });
    if (article == null) res.redirect('/')
    res.render('users/show', { article: article, articles: articles });
});



module.exports = router;