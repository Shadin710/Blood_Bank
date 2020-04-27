const path = require('path');
const express = require ('express');
const router =  require('express').Router();
const bodyParser =  require('body-parser');
const {check, validationResult} = require('express-validator');
const bcrypt=  require('bcryptjs');
const  user = require('./../models/user');
const admindb = require('./../models/admin'); 
//end
router.use(express.static(path.join(__dirname + './../views')));


// body-parser is used for parsing the json files
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

//get admin register page
router.get('/',(req,res)=>{
    res.render('admin_reg');
});

//create admin
router.post('/create',
    //checks if every field is good *_*
    [
    check('username').not().isEmpty().trim().escape(),
    check('password').not().isEmpty().trim().escape(),
    check('email').isEmail().normalizeEmail()
    ],
    //end
    (req,res)=>{

        //if there is an error in the check function an error will be generated
        // which we will store in the error function


        const error = validationResult(req); //the error checking method
        if(!error.isEmpty())
        {
            //render needs to be used
            return res.json({
                status: false,
                message: 'Failed',
                error: error
            })
        }
        //end
        const hashed =  bcrypt.hashSync(req.body.password,10);

        // everything is okay

        //now to create new user
        admindb.create(
            {
                username: req.body.username,
                email: req.body.email,
                password: hashed,
                bloodgroup: req.body.blood,
                details:''
            },
            (error,result)=>{
                if(error)
                {
                    return res.json({
                        status: false,
                        message: 'Failed to create data',
                        error: error
                    });
                }
        
                //  return res.json({
                //      status: true,
                //      message:'Success',
                //      result: result
                //  });
                //res.redirect('/login');
            });
        });
        
//exporting the file index js
module.exports = router;