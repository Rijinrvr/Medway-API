const express = require('express');
const router = express.Router();

let User = require('../models/users'); 

router.get('/login', function(req, res){
    res.json('login')
});

router.get('/logout', function (req, res) {
    console.log("call logout function");
    req.session.username=""
        res.redirect('/user/login');
    });



router.post('/login', async function(req, res){
    let query = {username: req.body.username, password: req.body.password};
    
    User.findOne(query, function(err,user){
        if(user) {
            req.session.username = user.username;
            res.redirect('/');
        }
        else {
            req.flash('danger', 'Invalid Login')
            res.render('login');
        }
        
    })
});


module.exports = router;