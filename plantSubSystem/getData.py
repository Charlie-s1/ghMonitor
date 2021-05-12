# Import the ADS1x15 module.
import Adafruit_ADS1x15

def getAllPlants():
    # Create an ADS1115 ADC (16-bit) instance.
    adc = Adafruit_ADS1x15.ADS1115()

    # Read all the ADC channel values in a list.
    values = [0]*4
    for i in range(4):
        values[i] = adc.read_adc(i, gain=1)
    
    return values[0], values[1], values[2], values[3]
