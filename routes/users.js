const express = require('express');
const router = express.Router();

const User = require('./../models/user');

const passport = require('passport');

router.get('/sign-in', (req, res) => {
    res.render('users/sign-in');
});

router.post('/sign-in', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/admin/sign-in',
    failureFlash: true
}));

router.get('/sign-up', (req, res) => {
    res.render('users/sign-up');
});


router.post('/register', async (req, res) => {
    const { name, email, password, confirm_password} = req.body;
    const errors = [];
    if (name.lenght <= 0){
        errors.push({text: 'Nombre inválido'});
    }
    if (password != confirm_password){
        errors.push({text: 'Las contraseñas no coinciden'});
    }
    if (password.lenght <= 4) {
        errors.push({text: 'Contraseña debe tener más de 4 caracteres'})
    }
    if (errors.length > 0) {
        res.render('users/sign-up', { errors, name, email });
    } else {
        const emailUSer = await User.findOne({ email: email });
        if(emailUSer){
            // req.flash('error_msg', `El ususario con correo electrónico ${email} ya está registrado. Intente con un correo diferente.`);
            res.redirect('/admin/sign-up');
        };
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        // req.flash('success_msg', `Bienvenido, ${name}!`);
        res.redirect('/admin/sign-in');
    }
    
});

module.exports = router;