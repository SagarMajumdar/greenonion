const express = require ('express');
//const { v4: uuidv4} = require ('uuid');
const cors = require('cors');
const mongodb = require('mongodb');
const mongoclient = mongodb.MongoClient;
const app = express();
app.use(express.json());
const port = 5000;
const corsOptions = {
    origin : 'http://localhost:3000',
    credentials:true
}
app.use(cors(corsOptions));
require('dotenv').config();

let mdb;
mongoclient.connect(process.env.MONGO_URL, (err, cl) => {
    mdb=cl.db();
    app.listen(port);
    console.log('connected to mongodb')
})


const delExpiredUrl = async (_id)=>{
    const result  = await mdb.collection('shorturls').deleteOne({_id:_id});
    return result.acknowledged;
}

app.get('/greenonion/api/redir2longurl/:shorturl',async (req, res) => {
    const {shorturl} = req.params;
    if( shorturl != null && shorturl.trim() != '')
    {   
        const result = await mdb.collection('shorturls').findOne({token: shorturl} , { projection: {longUrl:1, token:1, expiryDate: 1} } );
        
        if(result) {
            if( result.expiryDate >= new Date().getTime()) 
            {
                return res.status(200).json(result);
            }
            else {
                if ( delExpiredUrl(result._id) ) {
                    console.log('expired token document deleted');
                }
                return res.status(404).json();   
            }
        }
        else {
            return res.status(404).json();
        }
    }
});


app.post('/greenonion/api/makeurlshort',async (req,res) => {
    const {inputurl} =req.body;
    const buf = Buffer.from(`${new Date().getTime()}`).toString('base64');
    //const buff1 = Buffer.from(buf, 'base64').toString();
    //console.log(buff1);
    
    let result = await mdb.collection('shorturls').findOne({longUrl: inputurl}, { projection: {longUrl:1, token:1} });
    if( result ) {
        return res.status(200).json(result);
    }
    else {
        let curdatetime = new Date().getTime();
        result = await mdb.collection('shorturls').insertOne({
            longUrl: inputurl, token: buf, insertDate: curdatetime, expiryDate: (curdatetime + (6*60*60*1000) )
        });
        if(result.acknowledged) { 
            return res.status(201).json({ longUrl: inputurl, token: buf});
        }
        else
        {
            return response.status(500).json();   
        }
    }    
});
