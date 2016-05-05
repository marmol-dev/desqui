'use strict';

const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const lodashTemplate = require('lodash.template');

class Html {
  constructor({contentSelectors, templates: {docTitle, itemContent}}){
    this.$ = cheerio.load(`
      <html>
      <head></head>
      <body>
        <div id="title">
          ${docTitle}
        </div>
        <div id="content"></div>
      </body>
      </html>
    `);
        
    this.compiledTemplates = {
      itemContent: lodashTemplate(itemContent)
    };
    this.contentSelectors = contentSelectors;
    this.$contentWrapper = this.$('#content');
  }

  addContent(list){
   
    for(let item of list){
      const context = {};
      for(const name in this.contentSelectors){
        context[name] = item.find(this.contentSelectors[name]).html();
      } 
      const str = this.compiledTemplates.itemContent(context);
      this.$contentWrapper.append(str);
    }
  }

  toString(){
    return `<html>${this.$('html').html()}</html>`;
  }

  saveInDisk(dir){
    const finalDir = path.join(__dirname, '..', dir);
    return new Promise((resolve, reject)=>{
      fs.writeFile(finalDir, this.toString(), (err) => {
        if (err) reject(err);
        else resolve(finalDir);
      })
    });
  }
}

module.exports = Html;
