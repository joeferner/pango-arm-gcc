const pangoArmGcc = require('.');

module.exports = {
    targets: {
        'arm-gcc-init': new pangoArmGcc.ArmGccInitTarget(),
        'arm-gcc-objcopy': new pangoArmGcc.ArmGccObjCopyTarget(),
        'arm-gcc-objdump': new pangoArmGcc.ArmGccObjDumpTarget(),
        'arm-gcc-size': new pangoArmGcc.ArmGccSizeTarget(),
        'arm-gcc-print-size': new pangoArmGcc.ArmGccPrintSizeTarget()
    }
};
