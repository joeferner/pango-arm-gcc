'use strict';
const path = require('path');

require('pango').run({
    projectDir: __dirname,
    buildDir: path.join(__dirname, 'build'),
    gcc: {
        linkerOptions: ['--specs=nosys.specs']
    },
    components: [
        'pango',
        'pango-arm-gcc',
        'pango-gcc',
        'main'
    ]
});
