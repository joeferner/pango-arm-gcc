import {Component} from "@pango/components";
import {ProjectOptions} from "pango";
import {ARMGCCComponentOptions} from "./ARMGCCComponentOptions";
import {ARMGCCBuildTarget} from "./ARMGCCBuildTarget";

export const COMPONENT_NAME = 'arm-gcc';

export class ARMGCCComponent implements Component {
    name?: string;

    constructor() {
        this.name = COMPONENT_NAME;
    }

    init(projectOptions: ProjectOptions) {
        const componentOptions: ARMGCCComponentOptions = projectOptions.components[this.name];
        componentOptions.targets.build = new ARMGCCBuildTarget();
        return Promise.resolve();
    }
}