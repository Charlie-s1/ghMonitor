import Adafruit_DHT

DHT_SENSOR = Adafruit_DHT.DHT22
DHT_PIN = 21

def tempHumid():
    humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR,DHT_PIN)
    if temperature and temperature < -1000:
        temperature += 3276
    return humidity, temperature


