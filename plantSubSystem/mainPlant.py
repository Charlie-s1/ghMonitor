import requests
import getData
import time
import datetime
import json
import switch

#send data to main device and return result
def send(data):
    url="http://192.168.0.36:8080/updatePlant"
    try:
        r = requests.get(url,params=data)
        return r
    except Exception as e:
        print(e)

#work out % of dry and wet
def percent(n):
    water = 10000
    air = 23000
    dif = air-water
    
    dry=((n-water)/dif)*100
    wet=100-dry
    dry1dp = "{:.1f}".format(dry)
    wet1dp = "{:.1f}".format(wet)
    return dry1dp,wet1dp

while True:
    try:
        #get plant data
        a,b,c,d = getData.getAllPlants()
    except Exception as e:
        print(e)
    
    #get % of all plants
    aDry,aWet = percent(a)
    bDry,bWet = percent(b)
    cDry,cWet = percent(c)
    #print data
    print("\n******************")
    print("A: ",a," ",aDry," ",aWet)
    print("B: ",b," ",bDry," ",bWet)
    print("C: ",c," ",cDry," ",cWet)
    #put data into json and write to file on device
    plantData = {"aWet":aWet,"bWet":bWet,"cWet":cWet}
    with open("plantInfo.json","w+") as f:
        json.dump(plantData,f);
    #send json data to main device    
    r = send(plantData)
    #check if main device set water to true, if yes water for one min
    if r.text=="true":
        print("WATER")
        switch.on()
        time.sleep(60)
        switch.off()
    else:
        time.sleep(60)

