import {ProjectOptions, Task, TaskOptions, Tasks} from "pango";
import {GccComponentOptions} from "pango-gcc";
import {ARMGCCComponentOptions} from "./ARMGCCComponentOptions";
import * as path from "path";
import {COMPONENT_NAME} from "./ARMGCCComponent";

export class ARMGCCObjCopyTask extends Task {
    getPrerequisites(projectOptions: ProjectOptions): string[] {
        return ['link'];
    }

    run(taskOptions: TaskOptions): Promise<void | Tasks> {
        const component: ARMGCCComponentOptions = taskOptions.projectOptions.components[COMPONENT_NAME];
        const gccComponent: GccComponentOptions = taskOptions.projectOptions.components['gcc'];

        component.binFile = path.join(
            path.dirname(gccComponent.outputFile),
            path.basename(gccComponent.outputFile, path.extname(gccComponent.outputFile)) + '.bin'
        );

        const cmd = [
            'arm-none-eabi-objcopy',
            '-Obinary',
            gccComponent.outputFile,
            component.binFile
        ];
        return this.shell(taskOptions, cmd)
            .then(() => {
            });
    }
}