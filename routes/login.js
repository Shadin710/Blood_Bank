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
let get_blood = '';
let get_address = '';
let get_email ='';
let i = 0;
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

//renders the search page
router.get('/search', (req, res) => {
    //user ended his or her session 
    if(get_loguser)
    {
        res.render('search');
    }
    else
    {
        res.redirect('/login');
    }
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
        get_loguser='';
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

        user.find({ bloodgroup: req.body.blood}, (error, result) => {
            if (error) {
                res.send("error found");
            }


            //if there is no error the "result will store the search values"
            //result
            //there will be always something in the result array even this []
            //so the array won't be null at all 
            res.render('search_results',{
                result:result
            });
        });
    });

    //requested blood via the search  engine
    //need to fix it 
    //bug fixed now to develop it
    router.get('/hello/:name/',(req,res)=>{
        if(get_loguser)
        {
            res.send('working');
        }
        else
        {
            res.redirect('/login');
        }
        //debugger
       // console.log(`username: ${req.params.name}`);
    })
    //end

    //this shows the user profiles
    router.get('/profile',(req,res)=>{
        //checking the session
        if(get_loguser)
        {
            res.render('user_profile',{
                data: {
                    name:get_loguser,
                    blood:get_blood
                }
            });
            //debugger
           // console.log(get_loguser);
       }
       else
       {
           res.redirect('/login');
       }
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

//adding request blood option 
router.get('/notify',(req,res)=>{

    if(get_loguser)
    {   
        user_req.find((error,result)=>{
            if(error)
            {
                return res.json({
                    status: false,
                    message:'there is a problem in searching',
                    error: error
                });
            }

            //everything is okay
            if(result)
            {
                res.render('notify',{
                    result:result
                });
                // return res.json({
                //     status:true,
                //     message:'found the users',
                //     result:result
                // });
                //console.log(result[i].username);
                //console.log(result[i].email);
                //i++;
            }
            else
            {
                return res.json({
                    status: false,
                    message: 'No one requested for blood',
                });
            }
        });
    }
    else
    {
        res.redirect('/login');
        get_loguser = '';
    }
});
//end



//notification added
router.get('/get_req',(req,res)=>{
    user_req.create(
        {
            username: get_loguser,
            bloodGroup:get_blood,
            email: get_email,
        },
        (error,result)=>{
            if(error){
                return res.json({
                    status: false,
                    message: 'Error in inserting',
                    error: error
                })
            }

            //everything is okay
            res.redirect('/login/homepage');
        });
});



//adding logout 
router.get('/logout',(req,res)=>{
    res.redirect('/login');
    get_loguser = '';
 });
module.exports = router;