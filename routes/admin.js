const router = require('express').Router();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const user = require('./../models/user');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

let get_loguser= '';
const user_req = require('./../models/notify');
router.use(express.static(path.join(__dirname + './../views')));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/',(req,res)=>{
    res.render('admin_login');
});



//admin panel
router.post('/admin_panel',
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
                    get_blood =result.bloodgroup;
                    get_email = result.email;
                    //console.log(get_blood);
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



module.exports = router;