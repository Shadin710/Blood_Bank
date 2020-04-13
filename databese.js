const mongoose =  require('mongoose');
const assert =  require('assert');
const db_url = process.env.DB_URL;

mongoose.connect(
    db_url,
    {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    (error,link)=>{
        assert.equal(error,null,'DB connection failed....');
        console.log('DB connection done... :)');
        console.log(link);
    }
)
