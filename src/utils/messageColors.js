import chalk from "chalk";

const successCol = chalk.bgCyanBright.bold;
const successColGreen = chalk.bgGreen.bold;
const successColBlue = chalk.bgBlue.bold;
const warningColOrange = chalk.bgYellow.bold;
const errorCol = chalk.bold.red;

export { 
    successCol, 
    errorCol, 
    warningColOrange,
    successColGreen,
    successColBlue 
}