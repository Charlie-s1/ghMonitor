const express = require('express');
const app = express();
const {PythonShell} = require('python-shell');

const fs = require('fs');

app.use(express.static(__dirname + "/../pages"));

/**
 * return historical data file names
 */
app.get('/getFile', function(req,res){
    let location = __dirname + "/../pages/humidity";
    fs.readdir(location, (err,files) => {
        if (err) return console.log(err);
        res.send(files);
    });
});

/**
 * run switch/on.py on request
 */
app.get('/lightOn',function(req,res){
    PythonShell.run('switch/on.py',null,function(err){
        if (err) throw err;
        console.log("on?");
        res.send("on?")
    })
});

/**
 * run switch/off.py on request
 */
app.get('/lightOff',function(req,res){
    PythonShell.run('switch/off.py',null,function(err){
        if (err) throw err;
        console.log("off?");
        res.send("off?")
    })
});

app.listen(8080);