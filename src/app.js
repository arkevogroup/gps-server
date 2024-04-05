import express from "express";
import bodyParser from "body-parser";
import gpsRoutes from './routes/gpsRoutes.js';
import traccarRoutes from './routes/traccarRoutes.js'
import net from "net"
import morgan from "morgan";
import fileupload from "express-fileupload"
import fs from "fs";
import connectDB from "./config/database/database.js";
import { successColGreen, successColBlue }  from "./utils/messageColors.js"
import TcpClientServiceTeltonika from "./teltonika-parser.js";
import { fileURLToPath } from 'url';
import path from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();
const app = express();
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

const accessLogStream = fs.createWriteStream(path.join(__dirname, `../logs/GpsServer-${new Date().toISOString().slice(0, 10)}.log`), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

//loging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
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
});

const GPSPORT = 5711;
const gpsServer = net.createServer((socket) => {
  const tcpClientService = new TcpClientServiceTeltonika(socket);
  tcpClientService.run();
});
gpsServer.listen(GPSPORT, () => {
  console.log(successColBlue(`GPSServer listening on port ${GPSPORT}`));
});

