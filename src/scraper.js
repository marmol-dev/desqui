'use strict';

import request from 'request';
import * as cheerio from 'cheerio';
import * as scraper from 'website-scraper';

export default class Scraper {

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
