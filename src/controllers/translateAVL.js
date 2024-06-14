import Avl from "../models/AVLModel.js";
import Trip from "../models/tripModel.js";
import dictionary from "../utils/AVLtranslations.js";

async function translateData(imei, data) {
    try {
        const translatedData = {
            IOelement: {
                EventID: data.IOelement.IOelement.EventID,
                ElementCount: data.IOelement.IOelement.ElementCount,
                Elements: {}
            }
        };

        for (const key in data.IOelement.IOelement.Elements) {
            if (dictionary[key]) {
                if (typeof dictionary[key] === 'object') {
                    translatedData.IOelement.Elements[dictionary[key][data.IOelement.IOelement.Elements[key]]] = data.IOelement.IOelement.Elements[key];
                } else {
                    translatedData.IOelement.Elements[dictionary[key]] = data.IOelement.IOelement.Elements[key];
                }
            } else {
                translatedData.IOelement.Elements[key] = data.IOelement.IOelement.Elements[key];
            }
        }

        const trip = new Trip({
            imei: imei,
            timestamp: data.Timestamp,
            coordinates: [[data.GPSelement.GPSelement.Longitude, data.GPSelement.GPSelement.Latitude]]
        });

        await trip.save();
        const avlData = new Avl({
            imei: imei,
            avl_data: translatedData.IOelement.Elements
        });
        await avlData.save();

        console.log(translatedData.IOelement[0]);
    } catch (error) {
        console.log(error);
        return false;
    }
}

// //
// const imei = 864636061378788
//
// // const imei = 864636061378788
// const avldata = {
//     Timestamp: new Date().toLocaleDateString(),
//     Priority: 1,
//     GPSelement: {
//         GPSelement: {
//             Longitude: 41.292982,
//             Latitude: 19.726581,
//             Altitude: 0,
//             Angle: 0,
//             Satellites: 0,
//             Speed: 0
//         }
//     },
//     IOelement: {
//         IOelement: {
//             EventID: 240,
//             ElementCount: 20,
//             Elements: {
//                 '69': 2,
//                 '80': 1,
//                 '89': 0,
//                 '90': 256,
//                 '81':235
//             }
//         }
//     }
// };
//
// translateData(imei, avldata);
export default translateData;