const router = require('express').Router();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const user = require('./../models/user');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const user_get_req = require('./../models/request');
const user_news = require('./../models/news');
const user_acpt = require('./../models/accept');
const user_Task = require('./../models/task');


let get_req_email = '';
let get_loguser = '';
const user_req = require('./../models/notify');
let get_blood = '';
let get_address = '';
let get_email = '';
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
                    get_blood = result.bloodgroup;
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
    if (get_loguser) {
        res.render('search_part');
    }
    else {
        res.redirect('/login');
    }
});

//if anyone tries to enter the homepage with proper verification 
router.get('/homepage', (req, res) => {
    if (get_loguser) {
        res.render('homepage');
        get_loguser = data.name;
    }
    else {
        res.redirect('/login');
        get_loguser = '';
    }
});

//gives the output of the search result
router.post('/get_result',
    [
        check('users').not().isEmpty().trim().escape()
    ],
    (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.send("validation error");
        }

        user.find({ $or: [{ bloodgroup: req.body.users }, { username: req.body.users }] },
            (error, result) => {
                if (error) {
                    res.send("error found");
                }


                //if there is no error the "result will store the search values"
                //result
                //there will be always something in the result array even this []
                //so the array won't be null at all 
                res.render('search_results', {
                    result: result
                });
            });
    });

//requested blood via the search  engine
//need to fix it 
//developing
router.get('/hello/:name/', (req, res) => {
    if (get_loguser) {
        user_get_req.create(
            {
                username: req.params.name,
                message: get_email
            },
            (error, result) => {
                if (error) {
                    return res.json({
                        status: false,
                        message: 'Request failed..',
                        error: error
                    });
                }

                //no error
                res.redirect('/login/homepage');
            });
    }
    else {
        res.redirect('/login');
    }
    //debugger
    // console.log(`username: ${req.params.name}`);
})
//see request made to the user by other client
router.get('/see_req', (req, res) => {
    if (get_loguser) {
        user_get_req.find({ username: get_loguser }, (error, result) => {
            if (error) {
                return res.json({
                    status: false,
                    message: 'Searching failed',
                    error: error
                });
            }
            //no error 
            res.render('see_req', {
                result: result
            });
        });
    }
    else {
        res.redirect('/login');
    }
});

//end

//this shows the user profiles
router.get('/profile', (req, res) => {
    //checking the session
    if (get_loguser) {
        res.render('user_profile', {
            data: {
                name: get_loguser,
                blood: get_blood
            }
        });
        //debugger
        // console.log(get_loguser);
    }
    else {
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
router.get('/notify', (req, res) => {

    if (get_loguser) {
        user_req.find((error, result) => {
            if (error) {
                return res.json({
                    status: false,
                    message: 'there is a problem in searching',
                    error: error
                });
            }

            //everything is okay
            if (result) {
                res.render('notify', {
                    result: result
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
            else {
                return res.json({
                    status: false,
                    message: 'No one requested for blood',
                });
            }
        });
    }
    else {
        res.redirect('/login');
        get_loguser = '';
    }
});
//end



//notification added
router.get('/get_req', (req, res) => {
    user_req.create(
        {
            username: get_loguser,
            bloodGroup: get_blood,
            email: get_email,
        },
        (error, result) => {
            if (error) {
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

//profile overview
router.get('/overview', (req, res) => {
    res.render('overview', {
        data: {
            name: get_loguser,
            blood: get_blood
        }
    });
});
//end

//route to account setting
router.get('/settings', (req, res) => {
    res.render('user_update', {
        data: {
            name: get_loguser,
            blood: get_blood
        }
    });
});
//end

//updates users data
//has some bugs 
router.post('/update_profile', (req, res) => {

    console.log(`username: ${req.body.username}`);
    console.log(`Email: ${req.body.email}`);

    console.log(`Blood: ${req.body.blood}`);
    console.log(`quotes: ${req.body.qoutes}`);

    if (req.body.username) {
        user.findOneAndUpdate({ username: get_loguser }, { username: req.body.username }, (error, result) => {
            if (error) {
                return res.json({
                    status: false,
                    message: 'Failed updating...',
                    error: error
                })
            }
            //everything is good
            console.log(`updated username ${result}`);
        });
    }
    if (req.body.blood) {
        user.findOneAndUpdate({ username: get_loguser }, { bloodgroup: req.body.blood }, (error, result) => {
            if (error) {
                return res.json({
                    status: false,
                    message: 'Failed updating...',
                    error: error
                })
            }
            //everything is good
            console.log(`updated blood ${result}`);
        });
    }
    if (req.body.email) {
        user.findOneAndUpdate({ username: get_loguser }, { email: req.body.email }, (error, result) => {
            if (error) {
                return res.json({
                    status: false,
                    message: 'Failed updating...',
                    error: error
                })
            }
            //everything is good
            console.log(`updated email..`);
        });
    }
    if (req.body.qoutes) {
        user.findOneAndUpdate({ username: get_loguser }, { details: req.body.qoutes }, (error, result) => {
            if (error) {
                return res.json({
                    status: false,
                    message: 'Failed updating...',
                    error: error
                })
            }
            //everything is good
            console.log(`updated quotes`);
        });
    }
    res.redirect('/login/profile');
});
//end


//news feed
router.get('/news', (req, res) => {
    if (get_loguser) {
        //res.render('news');
        user_news.find((error, result) => {
            if (error) {
                return res.json({
                    status: false,
                    message: 'ERROR 404',
                    error: error
                });
            }

            //everything is okay
            if (result) {
                res.render('news', {
                    result: result
                });
            }
        })
    }
    else {
        res.redirect('/login');
    }
});
//end

// posting a status in news feed
router.post('/feed',
    [
        check('feed').not().isEmpty().trim().escape()
    ],
    (req, res) => {
        if (get_loguser) {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.json({
                    status: false,
                    message: 'Validation error',
                    error: error
                });
            }

            //no validation error
            user_news.create(
                {
                    username: get_loguser,
                    bloodgroup: get_blood,
                    stat: req.body.feed
                },
                (error, result) => {
                    if (error) {
                        return res.json({
                            status: false,
                            message: 'Failed to post..',
                            error: error
                        });
                    }

                    //no error at posting
                    res.redirect('/login/news');
                }
            )
        }
        else {
            res.redirect('/login');
        }
    });
//ended 

//checking a overview of profile
//needs spme development 
//has some bugs with css
router.get('/check/:name_new/', (req, res) => {
    //res.send('working');
    user.find({ username: req.params.name_new }, (error, result) => {
        if (error) {
            return res.json({
                status: false,
                message: 'Error getting the profile',
                error: error
            });
        }
        res.render('overview_profile', {
            result: result
        })
    });
});
//end


//accepting users
//needs some development
router.get('/accept/:name/', (req, res) => {
    if (get_loguser) {

        //this is for to find the email of the requested user 
        //and to show the email who has accepted it 
        console.log(req.params.name);
        user_req.findOne({ username: req.params.name },
            (error, result) => {
                if (error) {
                    return res.json({
                        status: false,
                        message: 'Error in finding the data',
                        error: error
                    })
                }
                //no error in finding the data
                get_req_email = result.email;
                console.log(result);
                console.log(get_req_email);
            });
            console.log(get_req_email);
            res.send('okay');
        //this will be for the user who globally requested the blood
        // user_acpt.create({
        //     username_req: req.params.name,
        //     username_accept: get_loguser,
        //     email_accpt: get_email,
        //     email_req: get_req_email
        // },
        //     (error, result) => {
        //         if (error) {
        //             return res.json({
        //                 status: false,
        //                 message: 'Error inserting the data',
        //                 error: error
        //             });
        //         }

        //         //everything is good
        //         //data has been inserted
        //     });


        // //deleting the global request because someone has accepted the req
        // user_req.findOneAndDelete({ username: req.params.name }, (error, result) => {
        //     if (error) {
        //         return res.json({
        //             status: false,
        //             message: 'ERROR DELETING',
        //             error: error
        //         });
        //     }
        //     //no error
        //     if (result) {
        //         console.log('Sucessfully deleted the data');
        //     }
        //     else {
        //         console.log('There is no such data as this');
        //     }
        //     res.redirect('/login/notify');
        // });
    }
    else {
        res.redirect('/login');
    }
});

//ending of accepted method

//Tasks routes

router.get('/task',(req,res)=>{
    if(get_loguser)
    {
        user_acpt.find({username_accept:get_loguser},(error,result)=>{
            if(error)
            {
                return res.json({
                    status:false,
                    message:'Error finding the data',
                    error: error  
                })
            }

            //no error
            res.render('task',{
                result:result
            });
        })
    }
    else
    {
        res.redirect('/login');
    }
});
//end of task route

//Accepted routes
router.get('/requested',(req,res)=>{
    if(get_loguser)
    {
        user_acpt.find({username_req:get_loguser},(error,result)=>{
            if(error)
            {
                return res.json({
                    status: false,
                    message: 'error at finding the data',
                    error: error
                });
            }

            //everything is okay
            res.render('accept',{
                result:result
            })
        })
    }
    else
    {
        res.redirect('/login');
    }
})
//end


//adding logout 
router.get('/logout', (req, res) => {
    res.redirect('/login');
    get_loguser = '';
});
module.exports = router;