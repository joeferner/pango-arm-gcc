import {ProjectOptions, Target, Targets} from "pango";
import {getArmGccOptions} from "./ArmGccOptions";
import {getGccOptions} from "pango-gcc";
import * as path from "path";
import * as childProcess from "child-process-promise";
import * as fs from "fs-extra";

const spawn = childProcess.spawn;

export class ArmGccSizeTarget implements Target {
    postRequisites = ['build'];
    preRequisites = ['link'];

    async run(projectOptions: ProjectOptions): Promise<void | Targets | string[]> {
        const gccOptions = getGccOptions(projectOptions);
        const options = getArmGccOptions(projectOptions);

        options.sizeFile = options.sizeFile || path.join(path.dirname(gccOptions.outputFile), options.sizeFileName);

        const cmd = [
            'arm-none-eabi-size',
            gccOptions.outputFile
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
                projectOptions.logger.error(line);
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
            return fs.writeJson(options.sizeFile, data, {spaces: 2});
        });
    }
}
