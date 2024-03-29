import os 
import time
import json
import getDHT22
import getDS18


#function to sava parameter "data" to json file named "yyyy-mm-dd"
def writeJson(data):
    with open('pages/humidity/{0}.json'.format(time.strftime("%Y-%m-%d")),"w") as f:
        json.dump(data, f, indent=4)
        f.close()



#Log current data to files
while True:
    
    #file location with current "yyyy-mm-dd" as name
    fileName = "pages/humidity/{0}.json".format(time.strftime("%Y-%m-%d"))
    #create new file if doesn't exist
    open(fileName,"a+")
    #read file as f
    with open(fileName,"r") as f:
    #if file is empty write json setup
        if len(f.readlines()) == 0:
            writeJson({"data":[]})
        f.close()

    #get data from sensors
    humidity, temperature = getDHT22.tempHumid()
    outerTemp = getDS18.readTemp()

    #if data is valid create json object containing data 
    if humidity is not None and temperature is not None and outerTemp is not None:
        sensorData = { 
            "time" : time.strftime("%H:%M:%S"), 
            "Temperature" : "{0:0.1f}".format(temperature), 
            "Humidity" : "{0:0.1f}".format(humidity),
            "Outside Temperature" : "{0:0.1f}".format(outerTemp)
        }

        #if time is on the hour or half past append to day
        if time.strftime("%M") == "00" or time.strftime("%M") == "30":
            with open('pages/humidity/{0}.json'.format(time.strftime("%Y-%m-%d"))) as f:
                data = json.load(f)
                data["data"].append(sensorData)
                writeJson(data)
                f.close()
        
        #overwright current data with new current data
        with open("pages/data/mainCurrent.json","w+") as logging:
            logging.write(json.dumps(sensorData))
            logging.close()
    else:
        print("failed to get data from sensor")
    time.sleep(60)


