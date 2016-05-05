'use strict';

const request = require('request');
const cheerio = require('cheerio');
const scraper = require('website-scraper');

class Scraper {

  static scrape({urls, headers, directory}){
    console.log(urls, directory);
    return scraper.scrape({
        urls: urls,
        directory: directory,
        sources: [
            {selector: 'img', attr: 'src'},
            {selector: 'link[rel="stylesheet"]', attr: 'href'},
            {selector: 'script', attr: 'src'}
        ],
        request: {
            headers: headers
        }
    });
  }
}

module.exports = Scraper;
