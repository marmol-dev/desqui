'use strict';

const urlJoin = require('url-join');

class Url {
    static join(...paths){
        return urlJoin(...paths);
    }
}

module.exports = Url;