'use strict';

const Crawler = require('./crawler');
const Html = require('./html');
const Url = require('./url');

class App {
  static download({baseUrl, urlLinks, linksSelector, contentSelector, outputFile, headers, contentSelectors, templates}){
    const html = new Html({contentSelectors, templates});
    
    Crawler.crawl(urlLinks, linksSelector, headers)
      .then($list => 
        $list.map((i) => 
          Url.join(baseUrl, $list.eq(i).attr('href'))
        ).get()
      )
      .then(urls => Crawler.bach(urls, 'body', headers))
      .then(contents => {
        html.addContent(contents);
        return html.saveInDisk(outputFile);
      })
      .then(
        dir => console.log('~', dir),
        err => console.error(err)
      );
  }
}

module.exports = App;
