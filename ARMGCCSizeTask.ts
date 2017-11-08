import {ProjectOptions, Task, TaskOptions, Tasks} from "pango";
import {GccComponentOptions} from "@pango/gcc";
import {ARMGCCComponentOptions} from "./ARMGCCComponentOptions";
import {COMPONENT_NAME} from "./ARMGCCComponent";
import * as path from "path";
import * as childProcess from "child-process-promise";
import * as fs from "fs-extra";

const spawn = childProcess.spawn;

export class ARMGCCSizeTask extends Task {
    getPrerequisites(projectOptions: ProjectOptions): string[] {
        return ['link'];
    }

    run(taskOptions: TaskOptions): Promise<void | Tasks> {
        const component: ARMGCCComponentOptions = taskOptions.projectOptions.components[COMPONENT_NAME];
        const gccComponent: GccComponentOptions = taskOptions.projectOptions.components['gcc'];

        component.sizeFile = path.join(
            path.dirname(gccComponent.outputFile),
            path.basename(gccComponent.outputFile, path.extname(gccComponent.outputFile)) + '.size'
        );

        const cmd = [
            'arm-none-eabi-size',
            gccComponent.outputFile
        ];
        const promise = spawn(cmd[0], cmd.slice(1));
        const childProcess = promise.childProcess;
        let output = '';
        childProcess.stdout.on('data', function (data) {
            output += data.toString();
        });
        childProcess.stderr.on('data', function (data) {
            let lines = data.toString().trim().split('\n');
            for (const line of lines) {
                taskOptions.log.error(line);
            }
        });
        return promise.then(() => {
            const lines = output.split('\n');
            const values = lines[1].trim().split(/\s+/);
            const data = {
                text: Number.parseInt(values[0]),
                data: Number.parseInt(values[1]),
                bss: Number.parseInt(values[2])
            };
            return fs.writeJson(component.sizeFile, data, {spaces: 2});
        });
    }
}