import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BCM)

PIR_PIN = 20
GPIO.setup(PIR_PIN,GPIO.IN)

def getMotion():
    while True:
        if GPIO.input(PIR_PIN):
            return True
        else:
            return False
