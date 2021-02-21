from luma.core.interface.serial import i2c
from luma.core.render import canvas
from luma.oled.device import sh1106
from PIL import ImageFont as fontType
import time
from datetime import date
import getDHT22
import getDS18
import json

import motion

serial = i2c(port=1, address=0x3c)

device = sh1106(serial)
#device.contrast(20)

font2 = fontType.truetype("fonts/code2000.ttf",32)
mainFont = fontType.truetype("fonts/bard.ttf",35)
while True:
    
    today = date.today()
    nowDate = today.strftime("%Y-%m-%d")
    nowTime = today.strftime("%H:%M:%S")
    # with open("pages/humidity/"+nowDate+".json") as jsonFile:
    #     data = json.load(jsonFile)
    #     tempHumid = data['data']
    if motion.getMotion():
        humidData, tempData = getDHT22.tempHumid()
        outTempData = getDS18.readTemp()
        temp = "{0:0.0f}°C".format(tempData)
        humid = "{0:0.0f}%".format(humidData)
        outTemp = "{0:0.0f}°C".format(outTempData)
        with canvas(device) as draw:
            draw.text((0,0),temp, fill="white",font = font2)
            draw.text((0,30),humid,fill="white",font = font2)
            draw.rectangle((65,0,65,64),outline="white",fill="black")
            draw.text((70,0),outTemp, fill="white",font=font2)
    else:
        with canvas(device) as draw:
            draw.text((0,0),nowTime, fill="white",font = font2)
    time.sleep(2)
