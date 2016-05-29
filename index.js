try {
    var App = require('./dist/app.build');
    var path = require('path');

    if (process.argv.length < 3){
        throw new Error('You must specify a params file');
    }

    var paramsFileName = process.argv[2];

    var params;

    try {
        params = require(path.join(process.cwd(), paramsFileName));
    } catch (e){
        throw new Error('Invalid params file:' + paramsFileName);
    }

    App.download(params);
} catch (e){
    console.error(e.stack);
}
