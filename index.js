// initialize the code

require('dotenv').config();
const path = require('path');
const express =  require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const port =  process.env.PORT || 3000;
const bodyParser = require('body-parser');
const database = require('./databese');
const userControl = require('./controller/user');
const login =  require('./routes/login');
//const msg = require('./routes/message'); 

//end

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'views')));


//setting up the view engine
app.set('view engine','pug');
app.set('views','./views');


// to see what http method is sent by the client to the server 
// and outputs it in the console 
app.use(morgan('dev'));


// this is for cross origin resource
app.use(cors());


// Registering new user
app.use('/reg',userControl);
app.use('/login',login);
//app.use('/:name',msg);

app.get('/',(req,res)=>{
    res.render('index');
});

//server running code
app.listen(port,()=>{
    console.log(`listening to the ${port}....`);
})

