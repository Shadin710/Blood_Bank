const mongoose  = require('mongoose');

const userTask =  mongoose.Schema({
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
    email: {
        type: String,
        require: true
    }
});

mongoose.model('task_User',userTask);

module.exports =  mongoose.model('task_User');
