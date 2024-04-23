import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const writeLog = (logMessage) => {
  const logFilePath = path.join(
    __dirname,
    `../../logs/GpsServer-${new Date().toISOString().slice(0, 10)}.log`
  );
  if (!logFilePath) {
    fs.createWriteStream(
      path.join(
        __dirname,
        `../logs/GpsServer-${new Date().toISOString().slice(0, 10)}.log`
      ),
      { flags: "a" }
    );
    fs.appendFileSync(
      logFilePath,
      `${new Date().toISOString()} - ${logMessage}\n`
    );
  } else {
    fs.appendFileSync(
      logFilePath,
      `${new Date().toISOString()} - ${logMessage}\n`
    );
  }
};
export default writeLog;
