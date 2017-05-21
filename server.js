const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const GoogleImages = require('google-images');
const client = new GoogleImages('010314164505178810779:kakhwalzbqy', 'AIzaSyBjWmEZbUKsH7uRPSz-9QNjuu6BUmwfgJE');
const searchTerm = require('./models/searchTerm');

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://tungdt:123456@ds147681.mlab.com:47681/tungdt');

app.get('/api/imagesearch/:searchVal*',(req, res)=>{
    var searchVal = req.params.searchVal;
    var offset = req.query.offset;
    var data = new searchTerm({
        searchVal,
        searchDate: new Date()
    });

    data.save(err => {
        if(err){
            res.send('Error saving to database');
        }
    });

    client.search(searchVal, {page : offset}).then((images,err) => {
        if(err) throw err;
        res.json(images);
    });
});

app.get('/api/latest/imagesearch/',(req, res, next)=>{
    searchTerm.find({},function(err,searchTerm){
        var searchTermMap = {};
        searchTerm.forEach((result)=>{
            searchTermMap[result._id] = result;
        });
        res.send(searchTermMap);
    });
});

app.listen(3000,(err) =>{
    console.log("Sever start up");
});
