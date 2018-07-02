import {ProjectOptions, Target, Targets} from "pango";
import {getArmGccOptions} from "./ArmGccOptions";
const fs = require("fs-extra");

export class ArmGccPrintSizeTarget implements Target {
    postRequisites = ['build'];
    preRequisites = ['arm-gcc-size'];

    async run(projectOptions: ProjectOptions): Promise<void | Targets | string[]> {
        const options = getArmGccOptions(projectOptions);
        
        const sizeData = await fs.readJson(options.sizeFile);
        const flash = options.flash || projectOptions.flash || 0;
        const ram = options.ram || projectOptions.ram || 0;
        const flashTotal = sizeData.text + sizeData.data;
        const ramTotal = sizeData.data + sizeData.bss;
        const textKiB = Math.ceil(sizeData.text / 1024);
        const dataKiB = Math.ceil(sizeData.data / 1024);
        const bssKiB = Math.ceil(sizeData.bss / 1024);
        const flashTotalKiB = Math.ceil(flashTotal / 1024);
        const ramTotalKiB = Math.ceil(ramTotal / 1024);
        const flashRemainingKiB = Math.ceil((flash - flashTotal) / 1024);
        const ramRemainingKiB = Math.ceil((ram - ramTotal) / 1024);
        console.log(``);
        console.log(`flash = ${flash / 1024}KB`);
        console.log(`ram   = ${ram / 1024}KB`);
        console.log(``);
        console.log(`flash = text (${textKiB}KB) + data (${dataKiB}KB) = ${flashTotalKiB}KB (remaining: ${flashRemainingKiB}KB)`);
        console.log(`ram   = data (${dataKiB}KB) + bss (${bssKiB}KB) = ${ramTotalKiB}KB (remaining: ${ramRemainingKiB}KB)`);
        console.log(``);
    }
}
