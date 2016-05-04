'use strict';

const App = require('./src/app');
const path = require('path');

let paramsFileName = 'params.json';
if (process.argv.length > 2){
    paramsFileName = process.argv[2];
}

let params;

try {
    params = require(path.join(__dirname, paramsFileName));
} catch (e){
    throw new Error(`Invalid params file: ${paramsFileName}`);
}

App.download(params);
