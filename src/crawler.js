'use strict';

const request = require('request');
const cheerio = require('cheerio');

class Crawler {
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

module.exports = Crawler;
