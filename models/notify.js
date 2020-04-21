const mongoose  = require('mongoose');

const userNot =  mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    bloodGroup:{
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    }
});

mongoose.model('notify_User',userNot);

module.exports =  mongoose.model('notify_User');
