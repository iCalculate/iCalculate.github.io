---
title: LakeShore Model 335 Python控制脚本
date: 2023-03-18 15:56:08
tags:
- Python
categories:
- Scientific
---

# Model 335 Cryogenic Temperature Controller

The Model 335 measures and controls cryogenic temperature environments.

More information about the instrument can be found [on our website](https://www.lakeshore.com/products/categories/overview/temperature-products/cryogenic-temperature-controllers/model-335-cryogenic-temperature-controller) including the manual which has a list of all commands and queries.

## Example Scripts

### Setting a temperature curve

```Python
import matplotlib.pyplot as plt
from lakeshore import Model224
from lakeshore.model_224 import Model224CurveHeader, Model224CurveFormat, Model224CurveTemperatureCoefficients, \
    Model224SoftCalSensorTypes

# Connect to a temperature instrument (the Model 224 in this case) over USB
myinstrument = Model224()

# Configure a curve by first setting its header parameters. First, set the name and serial number of the curve.
# Then, select the units used to set map the sensor units to temperature units. Set a temperature limit, and
# then specify whether the coefficients are positive or negative.
curve_header_25 = Model224CurveHeader("My_Curve", "ABC123", Model224CurveFormat.VOLTS_PER_KELVIN, 300.0,
                                      Model224CurveTemperatureCoefficients.POSITIVE)
myinstrument.set_curve_header(25, curve_header_25)

# Edit individual data points of the curve. In this case, a sensor value of 1.23 is set to equal a Kelvin value of
# 276.0
myinstrument.set_curve_data_point(25, 1, 1.23, 276.0)

# You can create a softcal curve by inputting 1-3 calibration sensor/temperature points. The instrument generates
# a new curve using your entered data points and the selected standard curve
myinstrument.generate_and_apply_soft_cal_curve(Model224SoftCalSensorTypes.DT_400, 30, "SN123", (276, 10),
                                               (300, 5), (310, 2))

# Use the get_curve method to get all the data points for a curve as a list. This can then be used to create a plot
# of the calibration curve.
data_points_list = myinstrument.get_curve(30)
x_list = [item[0] for item in data_points_list]
y_list = [item[1] for item in data_points_list]
plt.plot(x_list, y_list)

# Finally, a curve can be deleted if you would like to reset the data points for that curve. Only user curves
# can be deleted.
myinstrument.delete_curve(25)
```

### Recording data with the Model 335

```Python
from lakeshore.model_335 import *

# Connect to the first available Model 335 temperature controller over USB using a baud rate of 57600
my_model_335 = Model335(57600)

# Create a new instance of the input sensor settings class
sensor_settings = Model335InputSensorSettings(Model335InputSensorType.DIODE, True, False,
                                              Model335InputSensorUnits.KELVIN,
                                              Model335DiodeRange.TWO_POINT_FIVE_VOLTS)

# Apply these settings to input A of the instrument
my_model_335.set_input_sensor("A", sensor_settings)

# Set diode excitation current on channel A to 10uA
my_model_335.set_diode_excitation_current("A", Model335DiodeCurrent.TEN_MICROAMPS)

# Collect instrument data
heater_output_1 = my_model_335.get_heater_output(1)
heater_output_2 = my_model_335.get_heater_output(2)
temperature_reading = my_model_335.get_all_kelvin_reading()

# Open a csv file to write
file = open("335_record_data.csv", "w")

# Write the data to the file
file.write("Data retrieved from the Lake Shore Model 335\n")
file.write("Temperature Reading A: " + str(temperature_reading[0]) + "\n")
file.write("Temperature Reading B: " + str(temperature_reading[1]) + "\n")
file.write("Heater Output 1: " + str(heater_output_1) + "\n")
file.write("Heater Output 2: " + str(heater_output_2) + "\n")
file.close()
```

### Setting up autotune on the Model 335

```Python
from lakeshore import Model335
from lakeshore.model_335 import Model335DisplaySetup, Model335HeaterResistance, \
    Model335HeaterOutputDisplay, Model335HeaterRange, Model335AutoTuneMode, Model335HeaterError
from time import sleep

# Connect to the first available Model 335 temperature controller over USB using a baud rate of 57600
my_model_335 = Model335(57600)

# It is assumed that the instrument is configured properly with a control input sensor curve
# and heater output, capable of closed loop control

# Configure the display mode
my_model_335.set_display_setup(Model335DisplaySetup.TWO_INPUT_A)

# Configure heater output 1 using the HeaterSetup class and set_heater_setup method
my_model_335.set_heater_setup_one(Model335HeaterResistance.HEATER_50_OHM, 1.0, Model335HeaterOutputDisplay.POWER)

# Configure heater output 1 to a setpoint of 310 kelvin (units correspond to the configured output units)
set_point = 325
my_model_335.set_control_setpoint(1, set_point)

# Turn on the heater by setting the range
my_model_335.set_heater_range(1, Model335HeaterRange.HIGH)

# Check to see if there are any heater related errors
heater_error = my_model_335.get_heater_status(1)
if heater_error is not Model335HeaterError.NO_ERROR:
    raise Exception(heater_error.name)

# Allow the heater some time to turn on and start maintaining a setpoint
sleep(10)

# Ensure that the temperature is within 5 degrees kelvin of the setpoint
kelvin_reading = my_model_335.get_kelvin_reading(1)
if (kelvin_reading < (set_point - 5)) or (kelvin_reading > (set_point + 5)):
    raise Exception("Temperature reading is not within 5k of the setpoint")

# Initiate autotune in PI mode, initial conditions will not be met if the system is not
# maintaining a temperature within 5 K of the setpoint
my_model_335.set_autotune(1, Model335AutoTuneMode.P_I)

# Poll the instrument until the autotune process completes
autotune_status = my_model_335.get_tuning_control_status()
while autotune_status["active_tuning_enable"] and not autotune_status["tuning_error"]:
    autotune_status = my_model_335.get_tuning_control_status()
    # Print the status to the console every 5 seconds
    print("Active tuning: " + str(autotune_status["active_tuning_enable"]))
    print("Stage status: " + str(autotune_status["stage_status"]) + "/10")
    sleep(5)

if autotune_status["tuning_error"]:
    raise Exception("An error occurred while running autotune")
```

## Enumeration objects

This section describes the Enum type objects that have been created to name various settings of the Model 335 series that are represented as an int or single character to the instrument. The purpose of these enum types is to make the settings more descriptive and obvious to the user rather than interpreting the ints taken by the instrument.

- `lakeshore.model_335.``Model335RelayControlMode`

  alias of [`lakeshore.temperature_controllers.RelayControlMode`](https://lake-shore-python-driver.readthedocs.io/en/latest/model_335.html#lakeshore.temperature_controllers.RelayControlMode)

- *class*`lakeshore.temperature_controllers.``RelayControlMode`

  Relay operating mode enumeration`ALARMS`*= 2*`RELAY_OFF`*= 0*`RELAY_ON`*= 1*

- `lakeshore.model_335.``Model335RelayControlAlarm`

  alias of [`lakeshore.temperature_controllers.RelayControlAlarm`](https://lake-shore-python-driver.readthedocs.io/en/latest/model_335.html#lakeshore.temperature_controllers.RelayControlAlarm)

- *class*`lakeshore.temperature_controllers.``RelayControlAlarm`

  Enumeration of the setting determining which alarm(s) cause a relay to close in alarm mode.`BOTH_ALARMS`*= 2*`HIGH_ALARM`*= 1*`LOW_ALARM`*= 0*

- `lakeshore.model_335.``Model335InterfaceMode`

  alias of [`lakeshore.temperature_controllers.InterfaceMode`](https://lake-shore-python-driver.readthedocs.io/en/latest/model_335.html#lakeshore.temperature_controllers.InterfaceMode)

- *class*`lakeshore.temperature_controllers.``InterfaceMode`

  Enumeration for the mode of the remote interface`LOCAL`*= 0*`REMOTE`*= 1*`REMOTE_LOCAL_LOCK`*= 2*

- `lakeshore.model_335.``Model335HeaterError`

  alias of [`lakeshore.temperature_controllers.HeaterError`](https://lake-shore-python-driver.readthedocs.io/en/latest/model_335.html#lakeshore.temperature_controllers.HeaterError)

- *class*`lakeshore.temperature_controllers.``HeaterError`

  Enumeration for possible errors flagged by the heater`HEATER_OPEN_LOAD`*= 1*`HEATER_SHORT`*= 2*`NO_ERROR`*= 0*

- `lakeshore.model_335.``Model335CurveFormat`

  alias of [`lakeshore.temperature_controllers.CurveFormat`](https://lake-shore-python-driver.readthedocs.io/en/latest/model_335.html#lakeshore.temperature_controllers.CurveFormat)

- *class*`lakeshore.temperature_controllers.``CurveFormat`

  Enumerations specify formats for temperature sensor curves`LOG_OHMS_PER_KELVIN`*= 4*`MILLIVOLT_PER_KELVIN`*= 1*`OHMS_PER_KELVIN`*= 3*`VOLTS_PER_KELVIN`*= 2*

- `lakeshore.model_335.``Model335CurveTemperatureCoefficient`

  alias of [`lakeshore.temperature_controllers.CurveTemperatureCoefficient`](https://lake-shore-python-driver.readthedocs.io/en/latest/model_335.html#lakeshore.temperature_controllers.CurveTemperatureCoefficient)

- *class*`lakeshore.temperature_controllers.``CurveTemperatureCoefficient`

  Enumerations specify positive/negative temperature sensor curve coefficients`NEGATIVE`*= 1*`POSITIVE`*= 2*

- `lakeshore.model_335.``Model335AutoTuneMode`

  alias of [`lakeshore.temperature_controllers.AutotuneMode`](https://lake-shore-python-driver.readthedocs.io/en/latest/model_335.html#lakeshore.temperature_controllers.AutotuneMode)

- *class*`lakeshore.temperature_controllers.``AutotuneMode`

  Enumerator used to represent the different autotune control modes`P_I`*= 1*`P_I_D`*= 2*`P_ONLY`*= 0*

- `lakeshore.model_335.``Model335HeaterResistance`

  alias of [`lakeshore.temperature_controllers.HeaterResistance`](https://lake-shore-python-driver.readthedocs.io/en/latest/model_335.html#lakeshore.temperature_controllers.HeaterResistance)

- *class*`lakeshore.temperature_controllers.``HeaterResistance`

  Enumerator used to represent the different heater resistances`HEATER_25_OHM`*= 1*`HEATER_50_OHM`*= 2*

- `lakeshore.model_335.``Model335HeaterOutputUnits`

  alias of [`lakeshore.temperature_controllers.HeaterOutputUnits`](https://lake-shore-python-driver.readthedocs.io/en/latest/model_335.html#lakeshore.temperature_controllers.HeaterOutputUnits)

- *class*`lakeshore.temperature_controllers.``HeaterOutputUnits`

  Enumerator used to represent heater output unit settings`CURRENT`*= 1*`POWER`*= 2*

- *class*`lakeshore.model_335.``Model335InputSensor`

  Enumeration when “NONE” is an option for sensor input`CHANNEL_A`*= 1*`CHANNEL_B`*= 2*`NONE`*= 0*

- *class*`lakeshore.model_335.``Model335MonitorOutUnits`

  Units associated with a sensor channel`CELSIUS`*= 2*`KELVIN`*= 1*`SENSOR`*= 3*

- `lakeshore.model_335.``Model335Polarity`

  alias of [`lakeshore.temperature_controllers.Polarity`](https://lake-shore-python-driver.readthedocs.io/en/latest/model_335.html#lakeshore.temperature_controllers.Polarity)

- *class*`lakeshore.temperature_controllers.``Polarity`

  Enumerator for unipolar or bipolar output operation`BIPOLAR`*= 1*`UNIPOLAR`*= 0*

- *class*`lakeshore.model_335.``Model335InputSensorType`

  Sensor type enumeration`DIODE`*= 1*`DISABLED`*= 0*`NTC_RTD`*= 3*`PLATINUM_RTD`*= 2*`THERMOCOUPLE`*= 4*

- `lakeshore.model_335.``Model335InputSensorUnits`

  alias of [`lakeshore.temperature_controllers.InputSensorUnits`](https://lake-shore-python-driver.readthedocs.io/en/latest/model_335.html#lakeshore.temperature_controllers.InputSensorUnits)

- *class*`lakeshore.temperature_controllers.``InputSensorUnits`

  Enumerator used to represent temperature sensor unit options`CELSIUS`*= 2*`KELVIN`*= 1*`SENSOR`*= 3*

- *class*`lakeshore.model_335.``Model335DiodeRange`

  Diode voltage range enumeration`TEN_VOLTS`*= 1*`TWO_POINT_FIVE_VOLTS`*= 0*

- *class*`lakeshore.model_335.``Model335RTDRange`

  RTD resistance range enumeration`HUNDRED_OHM`*= 2*`ONE_HUNDRED_THOUSAND_OHM`*= 8*`ONE_THOUSAND_OHM`*= 4*`TEN_OHM`*= 0*`TEN_THOUSAND_OHM`*= 6*`THIRTY_OHM`*= 1*`THIRTY_THOUSAND_OHM`*= 7*`THREE_HUNDRED_OHM`*= 3*`THREE_THOUSAND_OHM`*= 5*

- *class*`lakeshore.model_335.``Model335ThermocoupleRange`

  Thermocouple range enumeration`FIFTY_MILLIVOLT`*= 0*

- `lakeshore.model_335.``Model335BrightnessLevel`

  alias of [`lakeshore.temperature_controllers.BrightnessLevel`](https://lake-shore-python-driver.readthedocs.io/en/latest/model_335.html#lakeshore.temperature_controllers.BrightnessLevel)

- *class*`lakeshore.temperature_controllers.``BrightnessLevel`

  Enumerator to specify the brightness level of an instrument display`FULL`*= 3*`HALF`*= 1*`QUARTER`*= 0*`THREE_QUARTERS`*= 2*

- *class*`lakeshore.model_335.``Model335HeaterOutType`

  Heater output 2 enumeration`CURRENT`*= 0*`VOLTAGE`*= 1*

- *class*`lakeshore.model_335.``Model335HeaterOutputDisplay`

  Heater output display units enumeration`CURRENT`*= 1*`POWER`*= 2*

- *class*`lakeshore.model_335.``Model335HeaterOutputMode`

  Control loop enumeration`CLOSED_LOOP`*= 1*`MONITOR_OUT`*= 4*`OFF`*= 0*`OPEN_LOOP`*= 3*`WARMUP_SUPPLY`*= 5*`ZONE`*= 2*

- *class*`lakeshore.model_335.``Model335WarmupControl`

  Heater output 2 voltage mode warmup enumerations`AUTO_OFF`*= 0*`CONTINUOUS`*= 1*

- *class*`lakeshore.model_335.``Model335HeaterRange`

  Control loop heater range enumeration`HIGH`*= 3*`LOW`*= 1*`MEDIUM`*= 2*`OFF`*= 0*

- `lakeshore.model_335.``Model335ControlTypes`

  alias of [`lakeshore.temperature_controllers.ControlTypes`](https://lake-shore-python-driver.readthedocs.io/en/latest/model_335.html#lakeshore.temperature_controllers.ControlTypes)

- *class*`lakeshore.temperature_controllers.``ControlTypes`

  Enumerator used to represent the control type settings`AUTO_OFF`*= 0*`CONTINUOUS`*= 1*

- `lakeshore.model_335.``Model335DiodeCurrent`

  alias of [`lakeshore.temperature_controllers.DiodeCurrent`](https://lake-shore-python-driver.readthedocs.io/en/latest/model_335.html#lakeshore.temperature_controllers.DiodeCurrent)

- *class*`lakeshore.temperature_controllers.``DiodeCurrent`

  Enumerator used to represent diode current ranges`ONE_MILLIAMP`*= 1*`TEN_MICROAMPS`*= 0*

- *class*`lakeshore.model_335.``Model335DisplaySetup`

  Panel display setup enumeration`CUSTOM`*= 6*`INPUT_A`*= 0*`INPUT_A_MAX_MIN`*= 1*`INPUT_B`*= 3*`INPUT_B_MAX_MIN`*= 4*`TWO_INPUT_A`*= 2*`TWO_INPUT_B`*= 5*`TWO_LOOP`*= 7*

- *class*`lakeshore.model_335.``Model335HeaterVoltageRange`

  Voltage mode heater enumerations`VOLTAGE_OFF`*= 0*`VOLTAGE_ON`*= 1*

- *class*`lakeshore.model_335.``Model335DisplayInputChannel`

  Panel display information enumeration`INPUT_A`*= 1*`INPUT_B`*= 2*`NONE`*= 0*`OUTPUT_1`*= 5*`OUTPUT_2`*= 6*`SETPOINT_1`*= 3*`SETPOINT_2`*= 4*

- *class*`lakeshore.model_335.``Model335DisplayFieldUnits`

  Panel display units enumeration`CELSIUS`*= 2*`KELVIN`*= 1*`MAXIMUM_DATA`*= 5*`MINIMUM_DATA`*= 4*`SENSOR_NAME`*= 6*`SENSOR_UNITS`*= 3*

## Status register classes

This section describes the register objects. Each bit in the register is represented as a member of the register’s class

- *class*`lakeshore.model_335.``Model335StatusByteRegister`(*message_available_summary_bit*, *event_status_summary_bit*, *service_request*, *operation_summary_bit*)

  Class object representing the status byte register LSB to MSB

- *class*`lakeshore.model_335.``Model335ServiceRequestEnable`(*message_available_summary_bit*, *event_status_summary_bit*, *operation_summary_bit*)

  Class object representing the service request enable register LSB to MSB

- `lakeshore.model_335.``Model335StandardEventRegister`

  alias of [`lakeshore.temperature_controllers.StandardEventRegister`](https://lake-shore-python-driver.readthedocs.io/en/latest/model_335.html#lakeshore.temperature_controllers.StandardEventRegister)

- *class*`lakeshore.temperature_controllers.``StandardEventRegister`(*operation_complete*, *query_error*, *execution_error*, *command_error*, *power_on*)

  Class object representing the standard event register

- `lakeshore.model_335.``Model335OperationEvent`

  alias of [`lakeshore.temperature_controllers.OperationEvent`](https://lake-shore-python-driver.readthedocs.io/en/latest/model_335.html#lakeshore.temperature_controllers.OperationEvent)

- *class*`lakeshore.temperature_controllers.``OperationEvent`(*alarm*, *sensor_overload*, *loop_2_ramp_done*, *loop_1_ramp_done*, *new_sensor_reading*, *autotune_process_completed*, *calibration_error*, *processor_communication_error*)

  Class object representing the status byte register LSB to MSB

- *class*`lakeshore.model_335.``Model335InputReadingStatus`(*invalid_reading*, *temp_underrange*, *temp_overrange*, *sensor_units_zero*, *sensor_units_overrange*)

  Class object representing the input status flag bits