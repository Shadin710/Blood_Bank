const mongoose =  require('mongoose');

const userSchema =  mongoose.Schema({
    username:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    bloodgroup:{
        type:String,
        require: true
    },
    details:{
        type:String
    },
    createOn:{
        type: Date,
        default: Date.now()
    }
});

mongoose.model('regUsers',userSchema);

module.exports = mongoose.model('regUsers');