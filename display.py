from luma.core.interface.serial import i2c
from luma.core.render import canvas
from luma.oled.device import sh1106
from PIL import ImageFont as fontType
import time
import logging
from datetime import date
import json
import requests
"""
Initialise display divice
"""
serial = i2c(port=1, address=0x3c)
device = sh1106(serial)

"""
Create and draw graphics
"""
font = fontType.truetype("fonts/FreePixel.ttf",30)

def percent(x):
    return 63-((x/100)*63)


while True:
    #with open("pages/data/mainCurrent.json") as f:
    #    data = json.load(f)
        
    #with canvas(device) as draw:
    #    draw.text((0,0),"In",fill="white",font=font)
    #    draw.text((70,0),"Out",fill="white",font=font)
    #    draw.rectangle((0,22,128,22),outline="white",fill="black")
    #    draw.text((0,22),"{:.0f}*C".format(float(data['Temperature'])), fill="white",font = font)
    #    draw.text((0,43),"{:.0f}%".format(float(data['Humidity'])),fill="white",font = font)
    #    draw.rectangle((65,0,65,64),outline="white",fill="black")
    #    draw.text((70,32),"{:.0f}*C".format(float(data['Outside Temperature'])), fill="white",font=font)


    rMain = "null"
    rPlant = "null"
    try:
        rMain = requests.get("http://192.168.0.36:8080/data/mainCurrent.json")
        rPlant = requests.get("http://192.168.0.36:8080/data/plantCurrent.json")
	
        if (rMain!="null" and rPlant!="null"):
            mainData = json.loads(rMain.text)
            plantData = json.loads(rPlant.text)
            p1 = float(plantData["Pepper1"])
            p2 = float(plantData["Pepper2"])
            p3 = float(plantData["Pepper3"])

            inT = float(mainData["Temperature"])

            p1Pos = (p1/100)*63
            p2Pos = (p2/100)*63
            p3Pos = (p3/100)*63

            plantWarning = 75
            tempWarning = 40

            with canvas(device) as draw:
                draw.rectangle((0,0,3,63),outline="white",fill="black")
                draw.rectangle((3,63,0,63-p1Pos),outline="white",fill="white")

                draw.rectangle((8,0,11,63),outline="white",fill="black")
                draw.rectangle((11,63,8,63-p2Pos),outline="white",fill="white")

                draw.rectangle((16,0,19,63),outline="white",fill="black")
                draw.rectangle((19,63,16,63-p3Pos),outline="white",fill="white")

                draw.rectangle((0,percent(90),19,percent(90)),outline="black",fill="black")
                draw.rectangle((0,percent(80),19,percent(80)),outline="black",fill="black")
                draw.rectangle((0,percent(70),19,percent(70)),outline="black",fill="black")
                draw.rectangle((0,percent(60),19,percent(60)),outline="black",fill="black")
                draw.rectangle((0,percent(50),19,percent(50)),outline="black",fill="black")

                draw.text((25,0),"{:.0f}".format(float(mainData["Temperature"]))+"c",fill="white",font=font)
                draw.text((80,0),"{:.0f}".format(float(mainData["Humidity"]))+"%",fill="white",font=font)
                draw.text((25,41),"{:.0f}".format(float(mainData["Outside Temperature"]))+"c",fill="white",font=font)
            
            with canvas(device) as draw:
                time.sleep(1)
                if(p1<plantWarning):
                    draw.rectangle((0,0,3,63),outline="white",fill="black")
                else:
                    draw.rectangle((0,0,3,63),outline="white",fill="black")
                    draw.rectangle((3,63,0,63-p1Pos),outline="white",fill="white")

                if(p2<plantWarning):
                    draw.rectangle((8,0,11,63),outline="white",fill="black")
                else:
                    draw.rectangle((8,0,11,63),outline="white",fill="black")
                    draw.rectangle((11,63,8,63-p2Pos),outline="white",fill="white")

                if(p3<plantWarning):
                    draw.rectangle((16,0,19,63),outline="white",fill="black")
                else:
                    draw.rectangle((16,0,19,63),outline="white",fill="black")
                    draw.rectangle((19,63,16,63-p3Pos),outline="white",fill="white")

                draw.rectangle((0,percent(90),19,percent(90)),outline="black",fill="black")
                draw.rectangle((0,percent(80),19,percent(80)),outline="black",fill="black")
                draw.rectangle((0,percent(70),19,percent(70)),outline="black",fill="black")
                draw.rectangle((0,percent(60),19,percent(60)),outline="black",fill="black")
                draw.rectangle((0,percent(50),19,percent(50)),outline="black",fill="black")

                if(inT>tempWarning):
                    draw.text((25,0),"{:.0f}".format(inT)+"c",fill="black",font=font)
                else:
                    draw.text((25,0),"{:.0f}".format(inT)+"c",fill="white",font=font)

                draw.text((80,0),"{:.0f}".format(float(mainData["Humidity"]))+"%",fill="white",font=font)
                draw.text((25,41),"{:.0f}".format(float(mainData["Outside Temperature"]))+"c",fill="white",font=font)

        time.sleep(1)
    except Exception as e:
        print(e)
