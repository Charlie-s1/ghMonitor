/**
 * create line graph using data input through parameter
 * @param {json} data json object containing historical data from server
 */
function createChart(data){
    let container = document.querySelector("#chartCont");
    container.innerHTML = "";
    const graph = document.createElement("canvas")
    graph.id = "graph";
    container.appendChild(graph)
    const ctx = graph.getContext("2d")

    let temp = [];
    let humid = [];
    let outerTemp = [];
    let time = [];

    for (item of data){
        temp.push(+item.temp);
        humid.push(item.humid);
        outerTemp.push(item.outTemp);
        time.push((item.time).slice(0,-3));
    }
    let height = window.innerHeight/1.2;
    let gradient1 = ctx.createLinearGradient(0,height,0,0);
    let gradient2 = ctx.createLinearGradient(0,height,0,0);
    gradient1.addColorStop(0.2, "#86d8f7");
    gradient1.addColorStop(0.7,"orange");
    gradient1.addColorStop(1, "red"); 
    gradient2.addColorStop(0.2, "black");
    gradient2.addColorStop(0.7,"#86f79b");
    gradient2.addColorStop(1, "white"); 
    let chart = new Chart(ctx, {
        type:"line",
        data: {
            labels: time,
            datasets: [
                {
                    label:"Outside Temp",
                    borderColor: "#86f79b",
                    fillColor:"#86f79b",
                    pointBorderColor: "#86f79b",
                    pointBackgroundColor:"#86f79b",
                    pointHoverBackgroundColor:"#86f79b",
                    // pointHoverBorderColor: "red",
                    steppedLine:false,
                    pointBorderWidth: 5,
                    pointHoverRadius: 10,
                    pointRadius: 3,
                    borderWidth: 4,
                    data:outerTemp
                },
                {
                    label:"Inside Temp",
                    
                    borderColor:"orange",
                    fillColor:"orange",
                    pointBorderColor: "orange",
                    pointBackgroundColor: "orange",
                    pointHoverBackgroundColor:"orange",
                    steppedLine:false,
                    pointBorderWidth: 5,
                    pointHoverRadius: 10,
                    pointRadius: 3,
                    borderWidth: 4,
                    data:temp
                },
                {
                    label:"Humidity",
                    hidden:true,
                    borderColor: "aqua",
                    fillColor:"aqua",
                    pointBorderColor: "aqua",
                    pointBackgroundColor: "aqua",
                    pointHoverBackgroundColor:"aqua",
                    steppedLine:false,
                    pointBorderWidth: 5,
                    pointHoverRadius: 10,
                    pointRadius: 3,
                    borderWidth: 4,
                    data:humid
                },
            ] 
        },
        options: {
            scales: {
                yAxes: [{
                    ticks:{
                        fontColor: "rgba(100,100,100,0.9)",
                        fontStyle: "bold",
                        padding: 20,
                        stepSize:5,
                        },
                    gridLines: {
                        drawTicks: false,
                        display: false,
                        color:"rgba(0,0,0,0.3)"
                    }}],
                xAxes: [{
                    ticks: {
                        padding: 20,
                        fontColor: "rgba(100,100,100,0.9)",
                        fontStyle: "bold",
                        autoSkip:true,
                        maxTicksLimit:20
                    },
                    gridLines: {
                        drawTicks:true,
                        color:"rgba(0,0,0,0.3)"
                    }
                }]
            }
        }
    });
}

/**
 * get data from change event on options
 * call createChart with data fetched from server
 * @param {event} e 
 */
async function createChartString(e){
    console.log(e.target.value);
    const data = await fetch(`humidity/${e.target.value}.json`)
    const sensor = await data.json();
    const list = sensor.data;
    
    createChart(list)
}
