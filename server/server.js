const express = require('express');
const app = express();
const fs = require('fs');
const {PythonShell} = require('python-shell');
const cam = require("./cam.js");

app.use(express.static(__dirname + "/../pages"));

/**
 * return historical data file names of sensors
 */
app.get('/getSensorFiles', function(req,res){
    let location = __dirname + `/../pages/humidity`;
    fs.readdir(location, (err,files) => {
        if (err) return console.log(err);
        res.send(files);
    });
});
/**
 * return file names of moisture sensors
 */
app.get('/getPlantFiles', function(req,res){
    let location = __dirname + `/../pages/data/plants`;
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

/**
 * write plant data recieved to json file
 */
app.get('/updatePlant',function(req,res){
    const date = new Date()
    const year = date.getFullYear();
    const mon = date.getMonth()<9 ? "0"+(date.getMonth()+1) : (date.getMonth()+1);
    const day = date.getDate()<10 ? "0"+date.getDate() : date.getDate();
    //const dateDay = date.toISOString().slice(0,10);
    const hour = date.getHours()<10 ? "0"+date.getHours() : date.getHours();
    const min = date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
    const sec = date.getSeconds();
    const filePath = `pages/data/plants/${year+"-"+mon+"-"+day}.json`

    console.log(req.query);
    try{
        newObj = 
            {
                time: hour+":"+min,
                p1:req.query.aWet,
                p2:req.query.bWet,
                p3:req.query.cWet
            }

        fs.open(filePath, "a", (err,f) => {
            if (err){
                return console.log(err);
            }
            
            fs.readFile(filePath,"utf8",(err,data) => {
                if (err){
                    return console.log(err);
                }
                if(data=="" && min!=00 && min!=30){
                    fs.writeFile(filePath,`{"plants":[]}`,(err)=>{
                        if(err){
                            return console.log(err);
                        }
                    })
                }
                else if(data==""){
                    fs.writeFile(filePath,`{"plants":[${JSON.stringify(newObj)}]}`,(err)=>{
                        if(err){
                            return console.log(err);
                        }
                    })
                }
                else{
                    if (min == 00 || min == 30){
                        updateJSON(filePath,data,newObj);
                        res.send("updated");
                    }else{
                        res.send("recieved");
                    }
                }
            })
            
        })
        
        
    }
    catch(err){
        console.log(err);
    }
    
});

function updateJSON(filePath,oldContentStr,newCont){
    const mainCont = JSON.parse(oldContentStr);
    mainCont.plants.push(newCont);

    fs.writeFile(filePath, JSON.stringify(mainCont,null,2), function(err){
        if (err){
            console.log(err);
        }
    });
}

app.listen(8080);
