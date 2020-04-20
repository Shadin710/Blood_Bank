const router = require('express').Router();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const user = require('./../models/user');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
let get_loguser= '';

router.use(express.static(path.join(__dirname + './../views')));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//generates login page
router.get('/', (req, res) => {
    res.render('login');
});



//renders homepage if the user gives the right credentials of his or her account
router.post('/homepage',
    [
        check('username').not().isEmpty().trim().escape(),
        check('password').not().isEmpty().trim().escape()
    ],
    (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.send("validation error");
        }
        //everything is ok
        user.findOne({ username: req.body.username }, (error, result) => {
            if (error) {
                res.send('failed to read');
            }

            // if we read the result
            if (result) {
                var isMatch = bcrypt.compareSync(req.body.password, result.password);
                if (isMatch) {
                    res.render('homepage');
                    get_loguser = req.body.username;
                }
                else {
                    res.redirect('/login');
                    console.log("Password don't match");
                }
            }
            else {
                res.redirect('/login');
                console.log("You didn't provided any username");
            }

        });
    }
);

//renders the search page
router.get('/search', (req, res) => {
    res.render('search');
});

//if anyone tries to enter the homepage with proper verification 
router.get('/homepage',(req,res)=>{
    if(get_loguser){
        res.render('homepage');
        get_loguser = data.name;
    }
    else
    {
        res.redirect('/login');
    }
});

//gives the output of the search result
router.post('/get_result',
    [
        check('username').not().isEmpty().trim().escape()
    ],
    (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.send("validation error");
        }

        user.findOne({ username: req.body.username }, (error, result) => {
            if (error) {
                res.send("error found");
            }
            //result
            if (result) {
                res.send("found the user");
                console.log(req.body.username);
            }
            else {
                res.send("user not found");
            }
        });
    });
    router.get('/profile',(req,res)=>{
        res.render('user_profile',{
            data: {
                name:get_loguser
            }
        });
        //debugger
       // console.log(get_loguser);
    });

    //helps user to get in touch with the admin
router.post('/send', (req, res) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '', //the admins email
            pass: ''// the admins password
        }
    });
    var mailOptions = {
        from: req.body.email,
        to: '', // the admins email
        subject: req.body.subject,
        text: req.body.message

    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.json({
                status: false,
                message: 'Sending failed....',
                error: error
            })
        }
        else {
            res.send('sent');
        }
    })

});
//adding logout 
router.get('/logout',(req,res)=>{
    res.redirect('/login');
    get_loguser = '';
 });

module.exports = router;