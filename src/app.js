'use strict';

const Crawler = require('./crawler');
const Html = require('./html');
const Url = require('./url');

class App {
  static download({baseUrl, urlLinks, linksSelector, contentSelector, outputFile}){
    const html = new Html();
    
    Crawler.crawl(urlLinks, linksSelector)
      .then($list => 
        $list.map((i) => 
          Url.join(baseUrl, $list.eq(i).attr('href'))
        ).get()
      )
      .then(urls => Crawler.bach(urls, contentSelector))
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
