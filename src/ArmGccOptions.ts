import {ProjectOptions} from "pango";
import {GccOptions} from "pango-gcc";
import * as path from "path";

export interface ArmGccOptions {
    binFileName: string;
    binFile?: string;
    dumpFileName: string;
    dumpFile?: string;
    sizeFileName: string;
    sizeFile?: string;
    flash?: number;
    ram?: number;
}

export function getArmGccOptions(projectOptions: ProjectOptions): ArmGccOptions {
    const gccOptions: GccOptions = projectOptions.gcc;
    const outputFileName = gccOptions.outputFile || gccOptions.outputFileName || 'a.out';
    const baseName = path.basename(outputFileName, path.extname(outputFileName));

    return projectOptions.armGcc = {
        binFileName: `${baseName}.bin`,
        dumpFileName: `${baseName}.list`,
        sizeFileName: `${baseName}.size`,
        ...(projectOptions.armGcc),
    };
}
