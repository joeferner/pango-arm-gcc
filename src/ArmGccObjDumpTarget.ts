import {ProjectOptions, Target, Targets} from "pango";
import {getArmGccOptions} from "./ArmGccOptions";
import {getGccOptions} from "pango-gcc";
import * as path from "path";
import * as fs from "fs";
import * as childProcess from "child-process-promise";

const spawn = childProcess.spawn;

export class ArmGccObjDumpTarget implements Target {
    postRequisites = ['build'];
    preRequisites = ['link'];

    async run(projectOptions: ProjectOptions): Promise<void | Targets | string[]> {
        const gccOptions = getGccOptions(projectOptions);
        const options = getArmGccOptions(projectOptions);

        options.dumpFile = options.dumpFile || path.join(path.dirname(gccOptions.outputFile), options.dumpFileName);

        const cmd = [
            'arm-none-eabi-objdump',
            '-S',
            gccOptions.outputFile
        ];
        const dumpFileOut = fs.createWriteStream(options.dumpFile);
        const promise = spawn(cmd[0], cmd.slice(1));
        const childProcess = promise.childProcess;
        childProcess.stdout.pipe(dumpFileOut);
        childProcess.stderr.on('data', function (data) {
            let lines = data.toString().trim().split('\n');
            for (const line of lines) {
                projectOptions.logger.error(line);
            }
        });
        await promise;
        dumpFileOut.close();
    }
}
