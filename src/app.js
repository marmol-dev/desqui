'use strict';

const Crawler = require('./crawler');
const Html = require('./html');
const Url = require('./url');
const Scraper = require('./scraper');
const path = require('path');

class App {
  static download({baseUrl, urlLinks, linksSelector, contentSelector, outputFile, directory, headers, contentSelectors, templates}){
    const html = new Html({contentSelectors, templates});
    
    Crawler.crawl(urlLinks, linksSelector, headers)
      .then($list => 
        $list.map((i) => 
          Url.join(baseUrl, $list.eq(i).attr('href'))
        ).get()
      )
      .then(urls => Scraper.scrape({urls, headers, directory}))
      .then(paths => 
        Promise.all(
          paths.map(path => 
            Html.open(path)
          )
        )
      )
      .then(doms => {
        html.addContent(doms);
        return html.saveInDisk(path.join(directory, 'index.html'));
      })
      .then(
        dir => console.log('~', dir),
        err => console.error(err)
      );
  }
}

module.exports = App;
