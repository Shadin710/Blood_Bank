const mongoose  = require('mongoose');

const userNews =  mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    bloodGroup:{
        type: String,
        require: true
    },
    Stat: {
        type: String,
        require: true
    }
});

mongoose.model('Newsfeed',userNews);

module.exports =  mongoose.model('Newsfeed');
