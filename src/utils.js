'use strict';

export default class Utils {
    static mandatory(name){
        throw new Error(`Param ${name} is mandatory`);
    }
}
