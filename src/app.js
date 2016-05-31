'use strict';

import Crawler from './crawler';
import Html from './html';
import Url from './url';
import Scraper from './scraper';
import * as path from 'path';
import Logger from './logger';
import {mandatory} from './utils';
import * as inspector from 'schema-inspector';


class App {

  static getUrls(args){
    const validation = inspector.validate(args, {
      type: 'object',
      properties: {
        urlLinks: {type: 'string', minLength:8},
        linksSelector: {type: 'string', minlength:1},
        headers: {type: 'object', optional: true},
        logMode: {type: 'boolean', optional: true},
        baseUrl: {type: 'string', minlength: 8}
      }
    });

    if(!validation.valid){
      return Promise.reject(new Error(validation.format()));
    }

    const {baseUrl, urlLinks, linksSelector, headers, logMode = true} = args;
    return Crawler.crawl({url: urlLinks, selector: linksSelector, headers})
      .then($list =>
        $list.map((i) =>
          Url.join(baseUrl, $list.eq(i).attr('href'))
        ).get()
      );
  }

  static createDocument(args){

    if (args instanceof Object && !args.urls){
      return App.getUrls(args)
        .then(urls => App.createDocument(Object.assign(args, {urls})));
    }

    const schema = {
      type: 'object',
      properties: {
        documentTitle: {type: 'string'},
        urls: [{type: 'string', minlength: 1}],
        selectors: {type: 'object'},
        directory: {type: 'string'},
        headers: {type: 'object', optional: true},
        itemTemplate: {type: 'string'},
        documentFrontTemplate: {type: 'string', minlength: 1, optional: true},
        documentTemplate: {type: 'string', minlength: 1, optional: true},
        logMode: {type: 'boolean', optional: true}
      }
    };

    const validation = inspector.validate(schema, args);

    if (!validation.valid){
      return Promise.reject(new Error(validation.format()));
    }

    const sanitation = inspector.sanitize(schema, args);

    const {urls,
      selectors,
      directory,
      headers,
      itemTemplate,
      documentFrontTemplate,
      documentTemplate,
      logMode,
      documentTitle
    } = sanitation.data;

    const html = new Html({selectors, documentTitle, templates: {item: itemTemplate, documentFront: documentFrontTemplate, document: documentTemplate}});

    return Scraper.scrape({urls, headers, directory})
      .then(resources => {
        return Promise.all(
          resources.map(resource =>
            Html.open(path.join(directory, resource.filename))
          )
        );
      })
      .then(doms => {
        html.addContent(doms);
        return html.saveInDisk(path.join(process.cwd(), directory, 'index.html'));
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
