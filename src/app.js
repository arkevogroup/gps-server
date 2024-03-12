import express from "express";
import bodyParser from "body-parser";
import gpsRoutes from './routes/gpsRoutes.js';
import net from "net"
import fileupload from "express-fileupload"

import connectDB from "./config/database/database.js";
import { successColGreen, successColBlue }  from "./utils/messageColors.js"
import TcpClientServiceTeltonika from "./teltonika-parser.js";

connectDB();
const app = express();
app.use(express.json())

app.use("/api/gps", gpsRoutes);
// app.use("/api/test", fileupload(), gpsRoutes);

const port = 8088;
app.listen(port, () => {
  console.log(successColGreen(`Server port ${port}`));
});

const GPSPORT = 5711;
const gpsServer = net.createServer((socket) => {
  const tcpClientService = new TcpClientServiceTeltonika(socket);
  tcpClientService.run();
});
gpsServer.listen(GPSPORT, () => {
  console.log(successColBlue(`GPSServer listening on port ${GPSPORT}`));
});

