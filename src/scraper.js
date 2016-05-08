'use strict';

const request = require('request');
const cheerio = require('cheerio');
const scraper = require('website-scraper');

class Scraper {

  static scrape({urls, headers, directory}){
    console.log(urls, directory);
    let cnt = 0;
    const urlsObj = urls.map(url => ({url: url, filename: `page_${cnt++}.html`}));
    return scraper.scrape({
        urls: urlsObj,
        directory: directory,
        request: {
            headers: headers
        }
    });
  }
}



module.exports = Scraper;
