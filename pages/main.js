window.onload = function(){
    const file = document.querySelector("#file");
    file.addEventListener("change",createChartString);
    document.querySelector("#lightTog").addEventListener("click",lightSwitch);
    // document.querySelector("#off").addEventListener("click",lightOff);
    document.querySelector("#mainView").addEventListener("click",toggleView);
    document.querySelector("#plantView").addEventListener("click",toggleView);
    document.querySelector("#max").addEventListener("mouseup",updateWater);
    document.querySelector("#min").addEventListener("mouseup",updateWater);
    document.querySelector("#waterButton").addEventListener("click",manualWater);
    
    function toggleView(e){
        const slide = document.querySelector("#slide");
        document.querySelector("#mainView").classList.toggle("select");
        document.querySelector("#plantView").classList.toggle("select");
        if (document.querySelector(".select").textContent == "main"){
            slide.style.transform = "translate(0,0)";
        }else{
            slide.style.transform = "translate(100%,0)";
        }
        update();
    }

    /**
     * update when to start and stop auto water
     * @param {event} e 
     */
    function updateWater(e){
        const max = document.querySelector("#max");
        const min = document.querySelector("#min");

        if(e.target.id == "max"){
            console.log(`max is now ${e.target.value}`);
        }else{
            console.log("a",e.target.value);
            e.target.value = e.target.value<max.value ? max.value+10:e.target.value;
            console.log("b",e.target.value);
            console.log(`min is now ${e.target.value}`);
        }
    }


    async function update(){
        const lightStatRaw = await fetch("/lightStat");
        const lightStat = await lightStatRaw.json();
        if (lightStat){
            document.querySelector("#lightTog").src = "img/on.png";
        }else{
            document.querySelector("#lightTog").src = "img/off.png";
        }

        const plantStatRaw = await fetch("/plantStat");
        const plantStat = await plantStatRaw.json();
        if (plantStat.curWater){
            document.querySelector("#waterButton").src = "img/waterOn.png";
        }else{
            document.querySelector("#waterButton").src = "img/water.png";
        }
        /**
         * get user's date and format it
         */
        const d = new Date();
        const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
        const month = d.getMonth()+1 < 10 ? `0${d.getMonth()+1}` : d.getMonth()+1;
        const today = `${d.getFullYear()}-${month}-${day}`;

        /**
         * get all days of data stored
         */
        let fileNamesData = "";
        let url = "";
        if(document.querySelector(".select").textContent == "main"){
            fileNamesData = await fetch("/getSensorFiles");
            url = "humidity/";
        }else if(document.querySelector(".select").textContent == "plants"){
            fileNamesData = await fetch("/getPlantFiles");
            url = "data/plants/";
        }
        
        const fileNames = await fileNamesData.json();
        const fileChoice = document.querySelector("#file");
        let chosen = fileChoice.value;
        fileNames.reverse();
        fileChoice.innerHTML = "";

 
        /**
         * insert all file names into option element on page
         * remove ".json" from file name
         */
        let found = false;
        for (item of fileNames){
            let fileOption = document.createElement("option");
            fileOption.classList = "fileOption"
            fileOption.textContent = item.slice(0,-5);
            if (item.slice(0,-5) == chosen){
                found=true;
            }
            fileChoice.appendChild(fileOption);
        }
        if (chosen && found){
            fileChoice.value = chosen;
        }else if(!found && chosen){
            alert(`No content for ${document.querySelector(".select").textContent} on ${chosen}`)
            fileChoice.value=today;
        }

        /**
         * get data from selected element from option element
         * get current data from current.json
         */
        const data = await fetch(`${url + fileChoice.value}.json`);
        const sensor = await data.json();
        const curDataRaw = await fetch("data/mainCurrent.json");
        const curData = await curDataRaw.json();
        const plantCurDataRaw = await fetch("data/plantCurrent.json");
        const plantCurData = await plantCurDataRaw.json();
        
        /**
         * insert data retrieved to appropriate elements
         */

        let infoObjs = document.querySelectorAll(".curInfo");
        for (i of infoObjs){
            i.remove();
        }
        if(document.querySelector(".select").textContent == "main"){
            createChart(sensor.data);

            for(let d in curData){
                if(d!="time"){
                    const div = document.createElement("div");
                    div.classList = "current curInfo";
                    const label = document.createElement("p");
                    label.classList="label";
                    const data = document.createElement("h3");

                    data.innerHTML = curData[d];
                    label.textContent = d;

                    div.appendChild(label);
                    div.appendChild(data);
                    document.querySelector("#quickInfo").appendChild(div);
                }
            }
        }
        else if(document.querySelector(".select").textContent == "plants"){
            createPlantChart(sensor.plants);

            for(let d in plantCurData){
                if(d!="time" && d!="water" && d!="min_max" && d!="timer" && d!="min"&& d!="max" && d!="start"&& d!="finish" && d!="curWater"){
                    const div = document.createElement("div");
                    div.classList = "current curInfo";
                    const label = document.createElement("p");
                    label.classList="label";
                    const data = document.createElement("h3");

                    const percent = document.createElement("div");
                    percent.classList = "percent";
                    percent.style.width = `${plantCurData[d]}%`

                    data.innerHTML = `${plantCurData[d]}`;
                    label.textContent = d;

                    div.appendChild(label);
                    div.appendChild(data);
                    div.appendChild(percent);
                    document.querySelector("#quickInfo").appendChild(div);
                }
            }
        }
        

    
    }
    update()
    var newInfo =  setInterval(update,1000);
   
    
    /**
     * light on and light off call server function
     */
    async function lightSwitch(){
        const lightStatRaw = await fetch("/lightStat");
        const lightStat = await lightStatRaw.json();
        
        if (lightStat){
            fetch("/lightOff");
        }else{
            fetch("/lightOn"); 
        }
    }
    // async function lightOff(){
    //     console.log("off");
    //     fetch("/lightOff");
    // }
    /**
    * set water variable to true
    * @param {event} e 
    */
    async function manualWater(e){
        fetch("/updateWater");        
    }
    
}
