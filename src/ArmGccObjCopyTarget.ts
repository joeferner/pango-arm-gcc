import {ProjectOptions, Shell, Target, Targets} from "pango";
import {getArmGccOptions} from "./ArmGccOptions";
import * as path from "path";
import {getGccOptions} from "pango-gcc";

export class ArmGccObjCopyTarget implements Target {
    postRequisites = ['build'];
    preRequisites = ['link'];

    async run(projectOptions: ProjectOptions): Promise<void | Targets | string[]> {
        const gccOptions = getGccOptions(projectOptions);
        const options = getArmGccOptions(projectOptions);

        options.binFile = options.binFile || path.join(path.dirname(gccOptions.outputFile), options.binFileName);

        const cmd = [
            'arm-none-eabi-objcopy',
            '-Obinary',
            gccOptions.outputFile,
            options.binFile
        ];
        await Shell.shell(projectOptions, cmd);
    }
}
