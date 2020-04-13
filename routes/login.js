const router =  require('express').Router();
const express = require('express');
const path =require('path');
const bodyParser = require('body-parser');
const  user = require('./../models/user');


router.use(express.static(path.join(__dirname + './../views')));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

router.get('/',(req,res)=>{
    res.render('login');
});

router.get('/homepage',(req,res)=>{
    user.find({username: req.query.username},
        (error,result)=>{
            if(error)
            {
                return res.json({
                    status: false,
                    message: 'error in finding',
                    error: error
                });
            }
            //no error in finding
            res.render('homepage');
        });
});

module.exports = router;