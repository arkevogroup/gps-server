const dictionary = {
    '5': "Pulse Counter Din2  (Counts pulses, count is reset when records are saved)",
    '6': "Analog Input 2 (001*Voltage)",
    '11': "ICCID1  Value of SIM ICCID, MSB",
    '12': "Fuel Used GPS (0.001*Fuel Used)",
    '13': "Fuel Rate GPS (0.01 * Fuel Rate GPS)",
    '14': 379210915,
    '16': "Total Odometer",
    '17': "Axis X",
    '18': "Axis Y",
    '19': "Axis Z",
    '21': "GSM Signal Strength in range 1-5",
    '23': "BLE Battery #4 Battery level of sensor #4",
    '24': "Speed km/h GNSS Speed",
    '25': "BLE Temperature #1",
    '26': "BLE Temperature #2",
    '27': "BLE Temperature #3",
    '28': "BLE Temperature #4",
    '29': "BLE Battery #1 Battery level of sensor #1",
    '68': "Battery Current (001*A)",
    '69': {
        0: "GNSS OFF",
        1: "GNSS ON with fix",
        2: "GNSS ON without fix",
        3: "GNSS sleep"
    },
    '80': {
        0: "Home On Stop",
        1: "Home On Moving",
        2: "Roaming On Stop",
        3: "Roaming On Moving",
        4: "Unknown On Stop",
        5: "Unknown On Moving"
    },
    '81': "Vehicle Speed km/h",
    '83': "Fuel Consumed",
    '84': "Fuel Level Value in liters (0.1)",
    '85': "Engine RPM",
    '86': "BLE Humidity #1 (*0.1 => %RH)",
    '87': "Total Mileage",
    '89': "Fuel level Value in %",
    '90': {
            0: "all doors closed",
            256: "front left door is opened",
            512: "front right door is opened",
            1024: "rear left door is opened",
            2048: "rear right door is opened",
            4096: "hood is opened",
            8192: "trunk is opened",
            16128: "all doors are opened"
    },
    '100': "gps Program Number",
    '102': "Engine Worktime",
    '103': "Engine Worktime (counted)",
    '104': "BLE Humidity #2 (*0.1 => %RH)",
    '105': "Total Mileage (counted)",
    '106': "BLE Humidity #3 (*0.1 => %RH)",
    '107': "Fuel Consumed (counted) Total Fuel Consumed",
    '108': "BLE Humidity #4 (*0.1 => %RH)",
    '110': "Fuel Rate (0.1)",
    '113': "Battery Level (Battery capacity level in %)",
    '114': "Engine Load",
    '132': "Security State Flags",
    '134': "Trip Distance",
    '181': "GNSS PDOP",
    '182': "GNSS HDOP",
    '200': {
        0: "No Sleep",
        1: "GPS Sleep",
        2: "Deep Sleep",
        3: "Online Sleep",
        4: "Ultra Sleep"
    },
    '206': "GSM Area Code",
    '239': {
        0: "Ignition Off",
        1: "Ignition On"
    },
    '240': {
        0: "Movement Off",
        1: "Movement On"
    },
    '241': "Active GSM Operator",
    '253': {
        1: "harsh acceleration",
        2: "harsh braking",
        3: "harsh cornering"
    }
};

export default dictionary;