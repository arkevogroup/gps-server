import { ProtocolParser, parseIMEI } from "complete-teltonika-parser-fork"
import GpsModel from "./models/GpsModel.js";
const args = process.argv;
const PORT = args[2]
import { successColGreen, errorCol, successColBlue }  from "./utils/messageColors.js"
import {laravelCallback} from "./services/geocodeService.js";
import translateData from "./controllers/translateAVL.js";

class TcpClientServiceTeltonika {
  constructor(client) {
    this.client = client;
  }

  async run() {
    const stream = this.client;
    console.log(successColGreen(`${new Date()} Received connection request from ${stream.remoteAddress}:${stream.remotePort}`));

    // const connected = false;
    var hasConnection = false;
    var command = '000000000000000F0C010500000007676574696E666F0100004312';
    var commandlvcangetinfo = '00000000000000140C01050000000C6C7663616E676574696E666F010000059B';
    var sendCommand = true;
    var issent = 0;


    stream.on('data', async (data) => {
      console.log(successColGreen(`${new Date()} - received===== ${data.toString('hex')}`));
      const packet = data.toString('hex');
      
      if (packet.length == 34) { 
        let imei = parseIMEI(packet)
        console.log(successColBlue("Imei Received :", imei));
        //TODO: Check if it is primary or backup
        let response;
        //check if imei exi
          const exist = await GpsModel.exists({ imei:imei });
          const is_alternate_imei = await GpsModel.exists({ alternate_imei: imei });

        if( exist ){
          response = Buffer.from([0x01]);
          hasConnection = true;
          await stream.write(response);
          console.log(successColGreen(`${new Date()} - responded with ${response.toString('hex')}`));
        }
        if (is_alternate_imei){
            await stream.write(response);
            console.log(successColGreen(`${new Date()} - responded with ${response.toString('hex')} to backup imei`));
            ///this is alternative imei should return alert
            let message = {
                alert: `Device offline `,
                message: {
                    imei: imei,
                    status:` Operating in backup imei`
                }
            }
            await laravelCallback(message);
        }
        else {
          response = Buffer.from([0x00]);
          await stream.write(response);
          stream.destroy()
          console.log(errorCol(`${new Date()} - responded with0 [${response.toString('hex')}]`));
        }
        // return {
          //     "message" : "Imei Received!",
          //     imei: parseIMEI(packet)
          // }
      } else {
            if(hasConnection){          
                let parsed = new ProtocolParser(packet);
                let parsedData ='';
        
                if (parsed.CodecType == "data sending"){
                    parsedData = parsed.Content;
                    console.log('AVL INFO : ' + hasConnection);
                    // console.log(parsedData.AVL_Datas[0]);
                    // data fixing for each element should be mades
                    //console.log(parsedData.AVL_Datas[0]);
                    translateData(imei,parsedData.AVL_Datas[0]);
                    // parsedData.AVL_Datas.forEach(element => {
                    //     console.log(element);
                    // });
                }
                    
                if (hasConnection && sendCommand && issent == 0 ){
                    issent ++; 
                    // stream only one data from from the get info command
                    console.log(`${new Date()} - responded with ${commandlvcangetinfo.toString('hex')}`);
                    await stream.write(Buffer.from(commandlvcangetinfo, 'hex'));
                }

                if (parsed.CodecType == "GPRS messages"){
                        console.log('GET INFO COMMAND : ' + hasConnection);
                        console.log(parsed.Content);
                        stream.destroy() // close connection after geting response of command
                }
            }else{
                let response;
                response = Buffer.from([0x00]);
                await stream.write(response);
                console.log(`${new Date()} - responded with00 [${response.toString('hex')}]`);
            }
          // return { 
          //     "message" : "Data Received!",
          //     dataPacket: new ProtocolParser(packet)
          // }
        }

    });

    stream.on('end', () => {
      console.log(`${new Date()} Connection closed by the client`);
    });

    stream.on('error', (err) => {
      console.error(`${new Date()} Error: ${err.message}`);
    });
  }
}

export default TcpClientServiceTeltonika


// const server = net.createServer((socket) => {
//   const tcpClientService = new TcpClientService(socket);
//   tcpClientService.run();
// });

// server.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

//dataexample
// AVL_Data {
//   Timestamp: 2024-01-18T14:21:01.000Z,
//   Priority: 1,
//   GPSelement: GPSelement {
//     Longitude: 19.8253566,
//     Latitude: 41.3187166,
//     Altitude: 0,
//     Angle: 0,
//     Satellites: 0,
//     Speed: 0
//   },
//   IOelement: IOelement {
//     EventID: 240,
//     ElementCount: 20,
//     Elements: {
//       '4': 0,
//       '16': 73,
//       '21': 5,
//       '24': 0,
//       '25': 32767,
//       '66': 12404,
//       '67': 0,
//       '68': 0,
//       '69': 2,
//       '80': 1,
//       '89': 0,
//       '113': 0,
//       '181': 0,
//       '182': 0,
//       '200': 0,
//       '238': 0,
//       '240': 1,
//       '241': 27601,
//       '306': 0,
//       '338': 0
//     }
//   }
// }


// ProtocolParser {
//   Packet: '000000000000009f0c0106000000975254433a323032342f312f32332031373a313020496e69743a323032342f312f32332031363a343420557054696d653a3135333473205057523a507772566f6c74616765205253543a30204750533a32205341543a3020545446463a302054544c463a30204e4f4750533a303a32352053523a302046473a3020464c3a363320534d533a30205245433a313035204d443a302044423a300100003892',
//   Preamble: 0,
//   Data_Length: 159,
//   CodecID: 12,
//   Quantity1: 1,
//   CRC: 14482,
//   Quantity2: 1,
//   CodecType: 'GPRS messages',
//   Content: GPRS {
//     isResponse: true,
//     type: 6,
//     responseStr: 'RTC:2024/1/23 17:10 Init:2024/1/23 16:44 UpTime:1534s PWR:PwrVoltage RST:0 GPS:2 SAT:0 TTFF:0 TTLF:0 NOGPS:0:25 SR:0 FG:0 FL:63 SMS:0 REC:105 MD:0 DB:0'
//   }
// }