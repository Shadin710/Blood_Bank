const mongoose =  require('mongoose');

const adminSchema =  mongoose.Schema({
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

mongoose.model('adminDB',adminSchema);

module.exports = mongoose.model('adminDB');