import {ProjectOptions, Task, TaskOptions, Tasks} from "pango";
import {ARMGCCComponentOptions} from "./ARMGCCComponentOptions";
import {COMPONENT_NAME} from "./ARMGCCComponent";
import * as fs from "fs-extra";

export class ARMGCCPrintSizeTask extends Task {
    getPrerequisites(projectOptions: ProjectOptions): string[] {
        return ['arm-gcc-size', 'link'];
    }

    run(taskOptions: TaskOptions): Promise<void | Tasks> {
        const component: ARMGCCComponentOptions = taskOptions.projectOptions.components[COMPONENT_NAME];
        return fs.readJson(component.sizeFile)
            .then(sizeData => {
                const flash = component.flash || 0;
                const ram = component.ram || 0;
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
            });
    }
}