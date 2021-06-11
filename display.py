from luma.core.interface.serial import i2c
from luma.core.render import canvas
from luma.oled.device import sh1106
from PIL import ImageFont as fontType
import time
import logging
from datetime import date
import json
"""
Initialise display divice
"""
serial = i2c(port=1, address=0x3c)
device = sh1106(serial)

"""
Create and draw graphics
"""
font = fontType.truetype("fonts/FreePixel.ttf",25)

while True:
    with open("pages/data/mainCurrent.json") as f:
        data = json.load(f)
        
    with canvas(device) as draw:
        draw.text((0,0),"In",fill="white",font=font)
        draw.text((70,0),"Out",fill="white",font=font)
        draw.rectangle((0,22,128,22),outline="white",fill="black")
        draw.text((0,22),"{:.0f}*C".format(float(data['Temperature'])), fill="white",font = font)
        draw.text((0,43),"{:.0f}%".format(float(data['Humidity'])),fill="white",font = font)
        draw.rectangle((65,0,65,64),outline="white",fill="black")
        draw.text((70,32),"{:.0f}*C".format(float(data['Outside Temperature'])), fill="white",font=font)

    time.sleep(10)
