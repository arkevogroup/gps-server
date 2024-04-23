import express from "express";
import bodyParser from "body-parser";
import gpsRoutes from './routes/gpsRoutes.js';
import traccarRoutes from './routes/traccarRoutes.js'
import net from "net"
import morgan from "morgan";
import fileupload from "express-fileupload"
import connectDB from "./config/database/database.js";
import { successColGreen, successColBlue }  from "./utils/messageColors.js"
import TcpClientServiceTeltonika from "./teltonika-parser.js";
import writeLog from "./config/writeLog.js";

connectDB();
const app = express();
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('combined', {}));

//loging middleware
app.use((req, res, next) => {
  logs = console.log(req.method+'-'+req.url);
  writeLog(logs);
  next();
});

//root request handler
app.use("/api/gps", gpsRoutes);
// app.use("/api/test", fileupload(), gpsRoutes);
app.use("/api/traccar", traccarRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(errorColRed("An error occurred:", err.stack));
  res.status(500).send('Something broke!');

});

const port = 8088;
app.listen(port, () => {
  console.log(successColGreen(`Server port ${port}`));
  writeLog(`Server port ${port}`)
});

const GPSPORT = 5711;
const gpsServer = net.createServer((socket) => {
  const tcpClientService = new TcpClientServiceTeltonika(socket);
  tcpClientService.run();
});
gpsServer.listen(GPSPORT, () => {
  console.log(successColBlue(`GPSServer listening on port ${GPSPORT}`));
});

