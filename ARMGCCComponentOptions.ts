import {ComponentOptions} from "pango-components";

export interface ARMGCCComponentOptions extends ComponentOptions {
    binFile: string;
    dumpFile: string;
    sizeFile: string;
}