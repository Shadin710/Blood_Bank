const mongoose  = require('mongoose');

const userReq =  mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    message:{
        type: String,
        require: true
    }
});

mongoose.model('request',userNot);

module.exports =  mongoose.model('request');