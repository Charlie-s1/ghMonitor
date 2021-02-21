import os 
import time
import json
import getDHT22
import getDS18


def writeJson(data):
    with open('pages/humidity/{0}.json'.format(time.strftime("%Y-%m-%d")),"w") as f:
        json.dump(data, f, indent=4)
        f.close()

while True:
    fileName = "pages/humidity/{0}.json".format(time.strftime("%Y-%m-%d"))
    open(fileName,"a+")
    with open(fileName,"r") as f:
        if len(f.readlines()) == 0:
            open(fileName,"w").write('{"data":[]}')
        f.close()

    #if time.strftime("%M")=="14" or time.strftime("%M")=="30":
        humidity, temperature = getDHT22.tempHumid()
        outerTemp = getDS18.readTemp() 
        if humidity is not None and temperature is not None:
            if time.strftime("%M") == "00" or time.strftime("%M") == "30":
                with open('pages/humidity/{0}.json'.format(time.strftime("%Y-%m-%d"))) as f:
                    data = json.load(f)
                    sensorData = { 
                            "time" : time.strftime("%H:%M:%S"), 
                            "temp" : "{0:0.1f}".format(temperature), 
                            "humid" : "{0:0.1f}".format(humidity),
                            "outTemp" : "{0:0.1f}".format(outerTemp),
                            "testTemp" : temperature
                            }
                    data["data"].append(sensorData)
                    writeJson(data)
                    #json.dump(data, f, indent=4)
                    f.close()
        else:
            print("failed to get data from sensor")
    # else:
        # print(time.strftime("min = %M, sec = %S"))
    time.sleep(60)


