'use strict';

class Utils {
    static mandatory(name){
        throw new Error(`Param ${name} is mandatory`);
    }
}

module.exports = Utils;