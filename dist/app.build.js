/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Crawler = __webpack_require__(2);
	var Html = __webpack_require__(5);
	var Url = __webpack_require__(10);
	var Scraper = __webpack_require__(12);
	var path = __webpack_require__(7);
	var Logger = __webpack_require__(14);
	
	var _require = __webpack_require__(9);
	
	var mandatory = _require.mandatory;
	
	var App = function () {
	  function App() {
	    _classCallCheck(this, App);
	  }
	
	  _createClass(App, null, [{
	    key: 'download',
	    value: function download(_ref) {
	      var _ref$baseUrl = _ref.baseUrl;
	      var baseUrl = _ref$baseUrl === undefined ? mandatory('baseUrl') : _ref$baseUrl;
	      var _ref$urlLinks = _ref.urlLinks;
	      var urlLinks = _ref$urlLinks === undefined ? mandatory('urlLinks') : _ref$urlLinks;
	      var _ref$selectors = _ref.selectors;
	      _ref$selectors = _ref$selectors === undefined ? mandatory('selectors') : _ref$selectors;
	      var _ref$selectors$links = _ref$selectors.links;
	      var linksSelector = _ref$selectors$links === undefined ? mandatory('selectors.links') : _ref$selectors$links;
	      var _ref$selectors$item = _ref$selectors.item;
	      var itemSelectors = _ref$selectors$item === undefined ? mandatory('selectors.item') : _ref$selectors$item;
	      var _ref$directory = _ref.directory;
	      var directory = _ref$directory === undefined ? mandatory('directory') : _ref$directory;
	      var headers = _ref.headers;
	      var templates = _ref.templates;
	      var _ref$logMode = _ref.logMode;
	      var logMode = _ref$logMode === undefined ? true : _ref$logMode;
	
	      var html = new Html({ itemSelectors: itemSelectors, templates: templates });
	
	      return Crawler.crawl({ url: urlLinks, selector: linksSelector, headers: headers }).then(function ($list) {
	        return $list.map(function (i) {
	          return Url.join(baseUrl, $list.eq(i).attr('href'));
	        }).get();
	      }).then(function (urls) {
	        return Scraper.scrape({ urls: urls, headers: headers, directory: directory });
	      }).then(function (resources) {
	        return Promise.all(resources.map(function (resource) {
	          return Html.open(path.join(directory, resource.filename));
	        }));
	      }).then(function (doms) {
	        html.addContent(doms);
	        return html.saveInDisk(path.join(process.cwd(), directory, 'index.html'));
	      }).then(function (dir) {
	        Logger.log(logMode, dir);
	        return dir;
	      }, function (err) {
	        Logger.error(logMode, err);
	        return Promise.reject(err);
	      });
	    }
	  }]);
	
	  return App;
	}();
	
	module.exports = App;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var request = __webpack_require__(3);
	var cheerio = __webpack_require__(4);
	
	var Crawler = function () {
	  function Crawler() {
	    _classCallCheck(this, Crawler);
	  }
	
	  _createClass(Crawler, null, [{
	    key: 'crawl',
	    value: function crawl(_ref) {
	      var url = _ref.url;
	      var selector = _ref.selector;
	      var _ref$headers = _ref.headers;
	      var headers = _ref$headers === undefined ? {} : _ref$headers;
	
	      return new Promise(function (resolve, reject) {
	        request(url, { headers: headers }, function (err, response, body) {
	          if (err) {
	            reject(err);
	          } else {
	            var $ = cheerio.load(body);
	            resolve($(selector));
	          }
	        });
	      });
	    }
	  }]);
	
	  return Crawler;
	}();
	
	module.exports = Crawler;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("cheerio");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var cheerio = __webpack_require__(4);
	var fs = __webpack_require__(6);
	var path = __webpack_require__(7);
	var lodashTemplate = __webpack_require__(8);
	
	var _require = __webpack_require__(9);
	
	var mandatory = _require.mandatory;
	
	
	var DEFAULT_DOCUMENT_TEMPLATE = '\n  <html>\n    <head>\n      <title>${documentTitle}</title>\n    </head>\n    <body>\n      <div id="front">\n        ${documentFront}\n      </div>\n      <div id="items"></div>\n    </body>\n</html>\n';
	
	var DEFAULT_DOCUMENT_FRONT = '\n  <span style="font-size:52px">\n  ${documentTitle}\n  </span>\n';
	
	var Html = function () {
	  _createClass(Html, null, [{
	    key: 'open',
	    value: function open(path) {
	      return new Promise(function (resolve, reject) {
	        fs.readFile(path, 'utf8', function (err, data) {
	          if (err) {
	            reject(err);
	          } else {
	            resolve(cheerio.load(data));
	          }
	        });
	      });
	    }
	  }]);
	
	  function Html(_ref) {
	    var itemSelectors = _ref.itemSelectors;
	    var documentTitle = _ref.documentTitle;
	    var _ref$templates = _ref.templates;
	    var _ref$templates$docume = _ref$templates.documentFront;
	    var documentFrontTemplate = _ref$templates$docume === undefined ? DEFAULT_DOCUMENT_FRONT : _ref$templates$docume;
	    var _ref$templates$docume2 = _ref$templates.document;
	    var documentTemplate = _ref$templates$docume2 === undefined ? DEFAULT_DOCUMENT_TEMPLATE : _ref$templates$docume2;
	    var _ref$templates$item = _ref$templates.item;
	    var itemTemplate = _ref$templates$item === undefined ? mandatory('templates.item') : _ref$templates$item;
	
	    _classCallCheck(this, Html);
	
	    var documentFront = lodashTemplate(documentFrontTemplate)({ documentTitle: documentTitle });
	    var document = lodashTemplate(documentTemplate)({ documentTitle: documentTitle, documentFront: documentFront });
	
	    this.$ = cheerio.load(document);
	
	    this.itemCompiledTemplate = lodashTemplate(itemTemplate);
	    this.itemSelectors = itemSelectors;
	    this.$items = this.$('#items');
	  }
	
	  _createClass(Html, [{
	    key: 'addContent',
	    value: function addContent(pages) {
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = pages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var $ = _step.value;
	
	          var context = {};
	          for (var name in this.itemSelectors) {
	            context[name] = $(this.itemSelectors[name]).html();
	          }
	          var str = this.itemCompiledTemplate(context);
	          this.$items.append(str);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'toString',
	    value: function toString() {
	      return '<html>' + this.$('html').html() + '</html>';
	    }
	  }, {
	    key: 'saveInDisk',
	    value: function saveInDisk(dir) {
	      var _this = this;
	
	      return new Promise(function (resolve, reject) {
	        fs.writeFile(dir, _this.toString(), function (err) {
	          if (err) reject(err);else resolve(dir);
	        });
	      });
	    }
	  }]);
	
	  return Html;
	}();
	
	module.exports = Html;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("lodash.template");

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Utils = function () {
	    function Utils() {
	        _classCallCheck(this, Utils);
	    }
	
	    _createClass(Utils, null, [{
	        key: 'mandatory',
	        value: function mandatory(name) {
	            throw new Error('Param ' + name + ' is mandatory');
	        }
	    }]);
	
	    return Utils;
	}();
	
	module.exports = Utils;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var urlJoin = __webpack_require__(11);
	
	var Url = function () {
	    function Url() {
	        _classCallCheck(this, Url);
	    }
	
	    _createClass(Url, null, [{
	        key: 'join',
	        value: function join() {
	            return urlJoin.apply(undefined, arguments);
	        }
	    }]);
	
	    return Url;
	}();
	
	module.exports = Url;

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("url-join");

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var request = __webpack_require__(3);
	var cheerio = __webpack_require__(4);
	var scraper = __webpack_require__(13);
	
	var Scraper = function () {
	  function Scraper() {
	    _classCallCheck(this, Scraper);
	  }
	
	  _createClass(Scraper, null, [{
	    key: 'scrape',
	    value: function scrape(_ref) {
	      var urls = _ref.urls;
	      var headers = _ref.headers;
	      var directory = _ref.directory;
	
	      console.log(urls, directory);
	      var cnt = 0;
	      var urlsObj = urls.map(function (url) {
	        return { url: url, filename: 'page_' + cnt++ + '.html' };
	      });
	      return scraper.scrape({
	        urls: urlsObj,
	        directory: directory,
	        request: {
	          headers: headers
	        }
	      });
	    }
	  }]);
	
	  return Scraper;
	}();
	
	module.exports = Scraper;

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("website-scraper");

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Logger = function () {
	    function Logger() {
	        _classCallCheck(this, Logger);
	    }
	
	    _createClass(Logger, null, [{
	        key: 'error',
	        value: function error(log) {
	            var _console;
	
	            for (var _len = arguments.length, msg = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                msg[_key - 1] = arguments[_key];
	            }
	
	            if (log) (_console = console).error.apply(_console, msg);
	        }
	    }, {
	        key: 'log',
	        value: function log(_log) {
	            var _console2;
	
	            for (var _len2 = arguments.length, msg = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	                msg[_key2 - 1] = arguments[_key2];
	            }
	
	            if (_log) (_console2 = console).log.apply(_console2, msg);
	        }
	    }]);
	
	    return Logger;
	}();
	
	module.exports = Logger;

/***/ }
/******/ ]);
//# sourceMappingURL=app.build.js.map