const router = require('express').Router();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const user = require('./../models/user');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

router.use(express.static(path.join(__dirname + './../views')));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    res.render('login');
});

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
router.get('/search', (req, res) => {
    res.render('search');
});

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
        res.render('user_profile');
    });
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
module.exports = router;