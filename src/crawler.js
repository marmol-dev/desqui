'use strict';

import request from 'request';
import * as cheerio from 'cheerio';

export default class Crawler {
  static crawl({url, selector, headers = {}}){
    return new Promise((resolve, reject) => {
      request(url, {headers}, (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          const $ = cheerio.load(body);
          resolve($(selector));
        }
      });
    });
  }
}
