import {ProjectOptions, Target, Targets} from "pango";
import {GccOptions} from "pango-gcc";

export class ArmGccInitTarget implements Target {
    postRequisites = ['initialize'];

    async run(projectOptions: ProjectOptions): Promise<void | Targets | string[]> {
        const gccOptions: GccOptions = projectOptions.gcc = projectOptions.gcc || {};
        gccOptions.compilers = {
            ...{
                '.c': 'arm-none-eabi-gcc',
                '.cpp': 'arm-none-eabi-gcc',
                '.s': 'arm-none-eabi-gcc'
            },
            ...(gccOptions.compilers || {})
        };
        gccOptions.linker = gccOptions.linker || 'arm-none-eabi-gcc';
    }
}
