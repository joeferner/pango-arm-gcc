import {ProjectOptions, Target, Tasks} from "pango";
import {ARMGCCSetupTask} from "./ARMGCCSetupTask";
import {ARMGCCObjDumpTask} from "./ARMGCCObjDumpTask";
import {ARMGCCObjCopyTask} from "./ARMGCCObjCopyTask";
import {ARMGCCSizeTask} from "./ARMGCCSizeTask";
import {ARMGCCPrintSizeTask} from "./ARMGCCPrintSizeTask";

export class ARMGCCBuildTarget extends Target {
    getTasks(projectOptions: ProjectOptions): Promise<Tasks> {
        return Promise.resolve({
            'arm-gcc-setup': new ARMGCCSetupTask(),
            'arm-gcc-objcopy': new ARMGCCObjCopyTask(),
            'arm-gcc-objdump': new ARMGCCObjDumpTask(),
            'arm-gcc-size': new ARMGCCSizeTask(),
            'arm-gcc-print-size': new ARMGCCPrintSizeTask()
        });
    }

    get helpMessage(): string {
        return 'Build ARM GCC files';
    }
}