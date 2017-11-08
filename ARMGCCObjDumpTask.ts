import {ProjectOptions, Task, TaskOptions, Tasks} from "pango";
import {GccComponentOptions} from "@pango/gcc";
import {ARMGCCComponentOptions} from "./ARMGCCComponentOptions";
import {COMPONENT_NAME} from "./ARMGCCComponent";
import * as path from "path";
import * as fs from "fs";
import * as childProcess from "child-process-promise";

const spawn = childProcess.spawn;

export class ARMGCCObjDumpTask extends Task {
    getPrerequisites(projectOptions: ProjectOptions): string[] {
        return ['link'];
    }

    run(taskOptions: TaskOptions): Promise<void | Tasks> {
        const component: ARMGCCComponentOptions = taskOptions.projectOptions.components[COMPONENT_NAME];
        const gccComponent: GccComponentOptions = taskOptions.projectOptions.components['gcc'];

        component.dumpFile = path.join(
            path.dirname(gccComponent.outputFile),
            path.basename(gccComponent.outputFile, path.extname(gccComponent.outputFile)) + '.list'
        );

        const cmd = [
            'arm-none-eabi-objdump',
            '-S',
            gccComponent.outputFile
        ];
        const dumpFileOut = fs.createWriteStream(component.dumpFile);
        const promise = spawn(cmd[0], cmd.slice(1));
        const childProcess = promise.childProcess;
        childProcess.stdout.pipe(dumpFileOut);
        childProcess.stderr.on('data', function (data) {
            let lines = data.toString().trim().split('\n');
            for (const line of lines) {
                taskOptions.log.error(line);
            }
        });
        return promise.then(() => {
            dumpFileOut.close();
        });
    }
}