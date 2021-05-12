import RPi.GPIO as GPIO

def off():
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(22,GPIO.OUT)
    GPIO.output(22,False)

def on():
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(22,GPIO.OUT)
    GPIO.output(22,True)
