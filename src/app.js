'use strict';

const Crawler = require('./crawler');
const Html = require('./html');
const Url = require('./url');
const Scraper = require('./scraper');
const path = require('path');
const Logger = require('./logger');
const {mandatory} = require('./utils');


class App {
  static download({
    baseUrl = mandatory('baseUrl'), 
    urlLinks = mandatory('urlLinks'), 
    selectors: { 
      links: linksSelector = mandatory('selectors.links'),
      item: itemSelectors = mandatory('selectors.item') 
    } = mandatory('selectors'), 
    directory = mandatory('directory'), 
    headers, 
    templates,
    logMode = true
  }){
    const html = new Html({itemSelectors, templates});
    
    return Crawler.crawl({url: urlLinks, selector: linksSelector, headers})
      .then($list => 
        $list.map((i) => 
          Url.join(baseUrl, $list.eq(i).attr('href'))
        ).get()
      )
      .then(urls => Scraper.scrape({urls, headers, directory}))
      .then(resources => 
        Promise.all(
          resources.map(resource => 
            Html.open(path.join(directory, resource.filename))
          )
        )
      )
      .then(doms => {
        html.addContent(doms);
        return html.saveInDisk(path.join(process.cwd(),directory, 'index.html'));
      })
      .then(
        dir => {
          Logger.log(logMode, dir);
          return dir;
        },
        err => {
          Logger.error(logMode, err);
          return Promise.reject(err);
        }
      );
  }
}

module.exports = App;
