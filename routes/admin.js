const router = require('express').Router();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const user = require('./../models/user');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const admin =  require('./../models/admin');

let get_loguser= '';
let get_logAdmin='';
const user_req = require('./../models/notify');
router.use(express.static(path.join(__dirname + './../views')));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/',(req,res)=>{
    res.render('admin_log');
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
        admin.findOne({ username: req.body.username }, (error, result) => {
            if (error) {
                res.send('failed to read');
            }

            // if we read the result
            if (result) {
                var isMatch = bcrypt.compareSync(req.body.password, result.password);
                if (isMatch) {
                    res.send('done');
                    get_logAdmin = req.body.username;
                    get_blood =result.bloodgroup;
                    get_email = result.email;
                    //console.log(get_blood);
                }
                else {
                    res.redirect('/admin');
                    console.log("Password don't match");
                }
            }
            else {
                res.redirect('/admin');
                console.log("You didn't provided any username");
            }

        });
    }
);



module.exports = router;