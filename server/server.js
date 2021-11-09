const { json } = require('express');
const express = require('express');
const app = express();
const fs = require('fs');
const {PythonShell} = require('python-shell');
let light = false;
//const cam = require("./cam.js");

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

app.get('/plantStat',function(req,res){
    fs.readFile("pages/data/plantCurrent.json","utf8",(err,dataRaw)=>{
        if(err){
            return console.log(err);
        }

        res.send(dataRaw);
    });
});

/**
 * run switch/on.py on request
 */
app.get('/lightOn',function(req,res){
    PythonShell.run('switch/on.py',null,function(err){
        if (err) throw err;
        light = true;
        res.send("on?")
    })
});

/**
 * run switch/off.py on request
 */
app.get('/lightOff',function(req,res){
    PythonShell.run('switch/off.py',null,function(err){
        if (err) throw err;
        light = false;
        res.send("off?")
    })
});

app.get('/lightStat',function(req,res){
    res.send(light);
})
/**
 * update when to water plants
 */
app.get('/updateWater',function(req,res){
    console.log(req.query);
    fs.readFile("pages/data/plantCurrent.json","utf8",(err,dataRaw)=>{
        if(err){
            return console.log(err);
        }
        const data = JSON.parse(dataRaw); 
        data.water = true;
        console.log("\n\nWATER CHANGE?\n\n");

        fs.writeFile("pages/data/plantCurrent.json",JSON.stringify(data),{flag:"w+"},(err)=>{
            if(err){
                return console.log(err);
            }
        });
        res.send(`${JSON.stringify(data)}<br><br>watering in 1 min...`)
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
    const hour = date.getHours()<10 ? "0"+date.getHours() : date.getHours();
    const min = date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
    const sec = date.getSeconds();
    const filePath = `pages/data/plants/${year+"-"+mon+"-"+day}.json`

    try{
        newObj = 
        {
            time: hour+":"+min,
            "Pepper1":req.query.aWet,
            "Pepper2":req.query.bWet,
            "Pepper3":req.query.cWet
        };
        newCurObj = 
        {
            time: hour+":"+min,
            water:false,
            curWater:false,
            min_max:false,
            timer:false,
            min:null,
            max:null,
            start:null,
            finish:null,
            "Pepper1":req.query.aWet,
            "Pepper2":req.query.bWet,
            "Pepper3":req.query.cWet
        };

        /**
         * create/update plant data file
         */
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
                    }
                }
            });
            
        });
        /**
         * create/update current plant data
         */
        fs.readFile("pages/data/plantCurrent.json","utf8",(err,dataRaw)=>{
            if(err){
                return console.log(err);
            }
            let jsonOldObj 
            if (dataRaw != ""){
                jsonOldObj = JSON.parse(dataRaw);
            }
            else{
                jsonOldObj = "{}"
            }
            // console.log(jsonOldObj);
            newCurObj.curWater = jsonOldObj.water ? true : false;
            
            fs.writeFile("pages/data/plantCurrent.json",JSON.stringify(newCurObj),{flag:"w+"},(err)=>{
                if(err){
                    return console.log(err);
                }
            });
            console.log("\n****************\n"+JSON.stringify(newCurObj)+"\n****************\n");
            console.log(`${jsonOldObj.water}`);
            res.send(`${JSON.stringify(jsonOldObj)}`);
            
        });
        
        
        
        
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
