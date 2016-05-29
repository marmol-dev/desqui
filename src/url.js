'use strict';

import urlJoin from 'url-join';

export default class Url {
    static join(...paths){
        return urlJoin(...paths);
    }
}
