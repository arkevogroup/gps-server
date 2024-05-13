import express from "express";
import bodyParser from "body-parser";
import gpsRoutes from './routes/gpsRoutes.js';
import traccarRoutes from './routes/traccarRoutes.js'
import net from "net"
import morgan from "morgan";
import connectDB from "./config/database/database.js";
import { successColGreen, successColBlue,errorCol }  from "./utils/messageColors.js"
import TcpClientServiceTeltonika from "./teltonika-parser.js";
import writeLog from './utils/writeLog.js'

connectDB().then(() => {
  const app = express();
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(morgan('combined', {}));

  app.use((req, res, next) => {
    next();
  });

  app.use("/api/gps", gpsRoutes);
  app.use("/api/traccar", traccarRoutes);


  app.use((err, req, res, next) => {
    console.error(errorCol("An error occurred:", err.stack));
    res.status(500).send('Something broke!');
    writeLog(err.stack);
  });

  const port = 8088;
  app.listen(port, () => {
    console.log(successColGreen(`Server port ${port}`));
    writeLog(`Server started on port ${port}`);
  });

  const GPSPORT = 5711;

  const gpsServer = net.createServer((socket) => {
    const tcpClientService = new TcpClientServiceTeltonika(socket);
    tcpClientService.run();
  });
  gpsServer.listen(GPSPORT, () => {
    console.log(successColBlue(`Server Started on port ${GPSPORT}`));
    writeLog(`Listening on port ${GPSPORT}`);
  });
}).catch(error => {
  console.error(errorCol("Error connecting to the database:", error));
});


