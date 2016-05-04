'use strict';

const request = require('request');
const cheerio = require('cheerio');
const constants = require('./constants');

class Crawler {
  static crawl(url, selector){
    return new Promise((resolve, reject) => {
      request(url, (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          const $ = cheerio.load(body);
          resolve($(selector));
        }
      });
    });
  }

  static bach(urls, selector){
    console.log('batching', urls);
    return Promise.all(urls.map((url) => Crawler.crawl(url, selector)));
  }
}

module.exports = Crawler;
