window.onload = function(){
    const file = document.querySelector("#file")
    file.addEventListener("change",createChartString)
    document.querySelector("#on").addEventListener("click",lightOn);
    document.querySelector("#off").addEventListener("click",lightOff);

    
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
        const fileNamesData = await fetch("/getFile");
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
        const data = await fetch(`humidity/${fileChoice.value}.json`);
        const sensor = await data.json();
        const list = sensor.data;
        createChart(list);
        const curDataRaw = await fetch("data/current.json");
        const curData = await curDataRaw.json();

        /**
         * insert data retrieved to appropriate elements
         */
        const outerTemp = document.querySelector("#outerTemp");
        const tempCont = document.querySelector("#tempCont");
        const humidCont = document.querySelector("#humidCont");
        const outTemp = document.createElement("h3");
        const temp = document.createElement("h3");
        const humid = document.createElement("h3");

        outTemp.innerHTML = `${curData.outTemp}&#176C`
        temp.innerHTML = `${curData.temp}&#176C`;
        humid.textContent = `${curData.humid}%`;

        outerTemp.innerHTML = "<p class='label'>Outside Temperature:</p>";
        tempCont.innerHTML = "<p class='label'>Inside Temperature:</p>";
        humidCont.innerHTML = "<p class='label'>Inside Humidity:</p>";
        outerTemp.appendChild(outTemp);
        tempCont.appendChild(temp);
        humidCont.appendChild(humid);
    
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
