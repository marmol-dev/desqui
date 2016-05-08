'use strict';

try {
    const App = require('./src/app');
    const path = require('path');

    if (process.argv.length < 3){
        throw new Error('You must specify a params file'); 
    }

    const paramsFileName = process.argv[2];

    let params;

    try {
        params = require(path.join(process.cwd(), paramsFileName));
    } catch (e){
        throw new Error(`Invalid params file: ${paramsFileName}`);
    }

    App.download(params);
} catch (e){
    console.error(e);
}
