const mongoose  = require('mongoose');

const userAcpt =  mongoose.Schema({
    username_req: {
        type: String,
        require: true
    },
    username_accept: {
        type: String,
        require: true
    },
    bloodGroup:{
        type: String,
        require: true
    },
    email_req: {
        type: String,
        require: true
    },
    email_accpt:{
        type: String,
        require:true
    }
});

mongoose.model('accept_User',userAcpt);

module.exports =  mongoose.model('accept_User');
