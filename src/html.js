'use strict';

import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import lodashTemplate from 'lodash.template';
import {mandatory} from './utils';

const DEFAULT_DOCUMENT_TEMPLATE = `
  <html>
    <head>
      <title>\${documentTitle}</title>
    </head>
    <body>
      <div id="front">
        \${documentFront}
      </div>
      <div id="items"></div>
    </body>
</html>
`;

const DEFAULT_DOCUMENT_FRONT = `
  <span style="font-size:52px">
  \${documentTitle}
  </span>
`;

class Html {
  static open(path){
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', function (err,data) {
        if (err) {
          reject(err);
        } else {
          resolve(cheerio.load(data));
        }
      });
    });
  }

  constructor({
    selectors: itemSelectors,
    documentTitle,
    templates: {
      documentFront : documentFrontTemplate = DEFAULT_DOCUMENT_FRONT,
      document : documentTemplate = DEFAULT_DOCUMENT_TEMPLATE,
      item: itemTemplate = mandatory('templates.item')
    }
  }){

    const documentFront = lodashTemplate(documentFrontTemplate)({documentTitle});
    const document = lodashTemplate(documentTemplate)({documentTitle, documentFront});

    this.$ = cheerio.load(document);

    this.itemCompiledTemplate = lodashTemplate(itemTemplate);
    this.itemSelectors = itemSelectors;
    this.$items = this.$('#items');
  }

  addContent(pages){
    for(let $ of pages){
      const context = {};
      for(const name in this.itemSelectors){
        context[name] = $(this.itemSelectors[name]).html();
      }
      const str = this.itemCompiledTemplate(context);
      this.$items.append(str);
    }
  }

  toString(){
    return `<html>${this.$('html').html()}</html>`;
  }

  saveInDisk(dir){
    return new Promise((resolve, reject)=>{
      fs.writeFile(dir, this.toString(), (err) => {
        if (err) reject(err);
        else resolve(dir);
      });
    });
  }
}

export default Html;
