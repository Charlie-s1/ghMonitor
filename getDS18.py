import glob
import time

B_DIR = '/sys/bus/w1/devices/'
D_FOLDER = glob.glob(B_DIR + '28*')[0]
D_FILE = D_FOLDER + '/w1_slave'

def readRaw():
    f = open(D_FILE, 'r')
    lines = f.readlines()
    f.close()
    return lines

def readTemp():
    lines = readRaw()
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = readRaw()
    equalsPos = lines[1].find('t=')
    if equalsPos != -1:
        tempString = lines[1][equalsPos+2:]
        temp = float(tempString) / 1000.0
        return temp

