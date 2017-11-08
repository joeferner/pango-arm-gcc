import {ProjectOptions, Task, TaskOptions, Tasks} from "pango";

export class ARMGCCSetupTask extends Task {
    run(taskOptions: TaskOptions): Promise<void | Tasks> {
        const gccOpts = taskOptions.projectOptions.components['gcc'];
        gccOpts.compilers = {
            ...{
                '.c': 'arm-none-eabi-gcc',
                '.cpp': 'arm-none-eabi-gcc',
                '.s': 'arm-none-eabi-gcc'
            },
            ...gccOpts.compilers
        };
        gccOpts.linker = gccOpts.linker || 'arm-none-eabi-gcc';

        return Promise.resolve();
    }

    getPostRequisites(projectOptions: ProjectOptions): string[] {
        return ['compile'];
    }
}