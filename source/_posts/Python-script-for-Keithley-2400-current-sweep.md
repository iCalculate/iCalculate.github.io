---
title: Keithley2400源表电流扫描Python程序
date: 2023-03-17 16:51:53
tags:
- Python
categories:
- Scientific
---


基于pymeasure库开发，控制2400源表进行电流循环扫描，可以实时绘图或扫描完成后进行结果分析。

<!--more-->

# Keithley 2400源表电流扫描Python程序

基于pymeasure库开发，控制源表进行电流循环扫描，可以实时绘图或扫描完成后进行结果分析。

```Python
# -*- coding: utf-8 -*-
"""
Keithley I-V Sweep
Demis D. John, October 2014, Univ. of California Santa Barbara
Program to sweep voltage & measure current on Keithley SMU
Known bugs: With PythonXY, the plot window opens *behind* the current window.
Also, file is saved *usually* in same directory as this script - but at one point it kept saving into the PythonXY directory, which was confusing.  Probably need to set the Python working directory to be sure.
Edit/Run this file via Python(x,y) (click the 1st button to open the Spyder IDE)
Installed PyVISA for GPIB communication.
Spyder Editor. 
Based off Steve Nichols' Script from ~2010, Univ. of California Santa Barbara
"""

SaveFiles = False   # Save the plot & data?  Only display if False.

DevName = 'I-V Curve 01' # will be inserted into filename of saved plot
Keithley_GPIB_Addr = 18  # Keithley 2400 SourceMeter GPIB address is 16
SR400_GPIB_Addr = 32  # Keithley 2400 SourceMeter GPIB address is 16

SweepMode = 'Current' # 'Voltage' for I-V curve, 'Current' for V-I curve
VoltageComp = 10       # compliance (max) current
CurrentComp = 100.0e-3    # compliance (max) current
start = 0     # starting value of Voltage sweep
stop = +0.05    # ending value 
numpoints = 40  # number of points in sweep


import pyvisa as visa          # PyVISA module, for GPIB comms
import numpy as N    # enable NumPy numerical analysis
import time          # to allow pause between measurements
import os            # Filesystem manipulation - mkdir, paths etc.
import matplotlib.pyplot as plt # for python-style plottting


# Open Visa connections to instruments
# keithley = visa.GpibInstrument(22)     # GPIB addr 22
rm = visa.ResourceManager()
keithley = rm.open_resource('GPIB0::' + str(Keithley_GPIB_Addr) + '::INSTR')


if SweepMode=='Current':
    # Setup Keithley for current loop
    keithley.write("*RST")
    print("reset the instrument")
    keithley.write(":SOUR:FUNC:MODE CURR")  # current source
    keithley.write(":SOURce:CURRent:MODE FIXed")  #Select fixed sourcing mode for I-source.
    keithley.write(":SOURce:CURRent:RANGe:AUTO 1")  #Select I-source range (n = range).
    keithley.write(":SENS:FUNC \"VOLT\"")  #Select measure function (function = “VOLTage” or “CURRent”).
    keithley.write(":SENS:VOLT:PROT:LEV " + str(VoltageComp))  # set voltage compliance
    keithley.write(":SENS:VOLT:RANGE:AUTO 1")   # set current reading range to auto (boolean)
    keithley.write(":OUTP ON")                             # turn on output
    print("keithley Current source initialized ...")
elif SweepMode=='Voltage':
    # Setup electrodes as voltage source
    keithley.write("*RST")
    print("reset the instrument")
    time.sleep(0.5)    # add second between
    keithley.write(":SOUR:FUNC:MODE VOLT")
    keithley.write(":SENS:CURR:PROT:LEV " + str(CurrentComp))
    keithley.write(":SENS:CURR:RANGE:AUTO 1")   # set current reading range to auto (boolean)
    keithley.write(":OUTP ON")                    # Output on    
    print("keithley Voltage source initialized ...")
else:
    raise ValueError('SweepMode initialization error!')

# Loop to sweep voltage
Voltage = []
Current = []
Resistent = []
Timestamp = []
Status = []
plt.ion()
if SweepMode=='Voltage':
    for V in N.linspace(start, stop, num=numpoints, endpoint=True):
        print("Voltage set to: " + str(V) + " V" )
        keithley.write(":SOUR:VOLT " + str(V))
        #time.sleep(0.1)    # add second between
        data = keithley.query(":READ?")   #returns string with many values (V, I, ...)
        answer = data.split(',')    # remove delimiters, return values into list elements
        I = eval( answer.pop(1) ) * 1e3     # convert to number
        Current.append( I )
        vread = eval( answer.pop(0) )
        Voltage.append(vread)
        resis = eval( answer.pop(0) )
        Resistent.append(resis)
        t = eval( answer.pop(0) )
        Timestamp.append(t)
        stat = eval( answer.pop(0) )
        Status.append(stat)
        plt.clf()
        plt.plot(Current, Voltage, '*-')
        plt.xlabel("Current (mA)")
        plt.ylabel("Voltage (V)")
        plt.pause(0.01)
        plt.ioff()
        #Current.append(  I  )          # read the current
        print("--> Current = " + str(Current[-1]) + ' mA')   # print last read value
    #end for(V)
elif SweepMode=='Current':
    for I in N.linspace(start, stop, num=numpoints, endpoint=True):
        print("Current set to: " + str(I) + " A" )
        keithley.write(":SOUR:CURR " + str(I))
        #time.sleep(0.1)    # add second between
        data = keithley.query(":READ?")   #returns string with many values (V, I, ...)
        answer = data.split(',')    # remove delimiters, return values into list elements
        I = eval( answer.pop(1) ) * 1e3     # convert to number
        Current.append( I )
        vread = eval( answer.pop(0) )
        Voltage.append(vread)
        resis = eval( answer.pop(0) )
        Resistent.append(resis)
        t = eval( answer.pop(0) )
        Timestamp.append(t)
        stat = eval( answer.pop(0) )
        Status.append(stat)
        #Current.append(  I  )          # read the current
        print("--> Voltage = " + str(Voltage[-1]) + ' V')   # print last read value
    #end for(V)

keithley.write(":OUTP OFF")     # turn off
keithley.write(":SYSTem:BEEPer 1046, 0.1")
time.sleep(0.1)
keithley.write(":SYSTem:BEEPer 784, 0.1")
time.sleep(0.1)
keithley.write(":SYSTem:BEEPer 523, 0.1")
time.sleep(0.1)
keithley.write(":SYSTem:BEEPer 587, 0.2")
keithley.write("SYSTEM:KEY 23") # change to local control
keithley.close()

#plt.plot(Current, Voltage, '*-')
#plt.xlabel("Current (mA)")
#plt.ylabel("Voltage (V)")

if SaveFiles:
    # create subfolder if needed:
    if not os.path.isdir(DevName): os.mkdir(DevName)
    curtime = time.strftime('%Y-%M-%d_%H%M.%S')
    SavePath = os.path.join(DevName, 'I-V Curve - ' + DevName + ' - [' + curtime +']' )
    
    data = np.array(  zip(Current, Voltage)  )
    np.savetxt( SavePath + '.txt', data, fmt="%e", delimiter="\t", header="Current (A)\tVoltage (V)" )
    #np.array(Voltage).tofile(  os.path.join(DevName, 'I-V Voltage - ' + DevName + ' - [' + curtime +'].txt' )  )
    #np.array(Current).tofile(  os.path.join(DevName, 'I-V Current - ' + DevName + ' - [' + curtime +'].txt' )  )
#end if(SaveFiles)
```