'use strict';

const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

class Html {
  constructor(){
    this.$ = cheerio.load(`
      <html>
      <head></head>
      <body>
        <h1>The book</h1>
        <div id="content"></div>
      </body>
      </html>
    `);
    this.$wrapper = this.$('#content');
  }

  addContent(list){
    for(let item of list){
      //console.log('-> Content', item.html());
      this.$wrapper.append(item);
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
