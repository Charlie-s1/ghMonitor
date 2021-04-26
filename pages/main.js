window.onload = function(){
    const file = document.querySelector("#file")
    file.addEventListener("change",createChartString)
    document.querySelector("#on").addEventListener("click",lightOn);
    document.querySelector("#off").addEventListener("clck",lightOff);
    document.querySelector("#mainView").addEventListener("click",toggleView);
    document.querySelector("#plantView").addEventListener("click",toggleView);
    
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

    async function update(){
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
        fileNames.reverse();
        fileChoice.innerHTML = "";

        /**
         * insert all file names into option element on page
         * remove ".json" from file name
         */
        for (item of fileNames){
            let fileOption = document.createElement("option");
            fileOption.classList = "fileOption"
            fileOption.textContent = item.slice(0,-5);
            
            fileChoice.appendChild(fileOption);
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

        document.querySelector("#curData").innerHTML="";

        if(document.querySelector(".select").textContent == "main"){
            createChart(sensor.data);

            for(let d in curData){
                if(d!="time"){
                    const div = document.createElement("div");
                    div.classList = "current";
                    const label = document.createElement("p");
                    label.classList="label";
                    const data = document.createElement("h3");

                    data.innerHTML = `${curData[d]}`;
                    label.textContent = d;

                    div.appendChild(label);
                    div.appendChild(data);
                    document.querySelector("#curData").appendChild(div);
                }
            }
        }
        else if(document.querySelector(".select").textContent == "plants"){
            createPlantChart(sensor.plants);

            for(let d in plantCurData){
                if(d!="time"){
                    const div = document.createElement("div");
                    div.classList = "current";
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
                    document.querySelector("#curData").appendChild(div);
                }
            }
        }
        

    
    }
    update();
    
    /**
     * light on and light off call server function
     */
    async function lightOn(){
        fetch("/lightOn");
    }
    async function lightOff(){
        fetch("/lightOff")
    }
}
