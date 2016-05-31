module.exports =
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
	
	var _crawler = __webpack_require__(2);
	
	var _crawler2 = _interopRequireDefault(_crawler);
	
	var _html = __webpack_require__(5);
	
	var _html2 = _interopRequireDefault(_html);
	
	var _url = __webpack_require__(10);
	
	var _url2 = _interopRequireDefault(_url);
	
	var _scraper = __webpack_require__(12);
	
	var _scraper2 = _interopRequireDefault(_scraper);
	
	var _path = __webpack_require__(7);
	
	var path = _interopRequireWildcard(_path);
	
	var _logger = __webpack_require__(14);
	
	var _logger2 = _interopRequireDefault(_logger);
	
	var _utils = __webpack_require__(9);
	
	var _schemaInspector = __webpack_require__(15);
	
	var inspector = _interopRequireWildcard(_schemaInspector);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var App = function () {
	  function App() {
	    _classCallCheck(this, App);
	  }
	
	  _createClass(App, null, [{
	    key: 'getUrls',
	    value: function getUrls(args) {
	      var validation = inspector.validate(args, {
	        type: 'object',
	        properties: {
	          urlLinks: { type: 'string', minLength: 8 },
	          linksSelector: { type: 'string', minlength: 1 },
	          headers: { type: 'object', optional: true },
	          logMode: { type: 'boolean', optional: true },
	          baseUrl: { type: 'string', minlength: 8 }
	        }
	      });
	
	      if (!validation.valid) {
	        return Promise.reject(new Error(validation.format()));
	      }
	
	      var baseUrl = args.baseUrl;
	      var urlLinks = args.urlLinks;
	      var linksSelector = args.linksSelector;
	      var headers = args.headers;
	      var _args$logMode = args.logMode;
	      var logMode = _args$logMode === undefined ? true : _args$logMode;
	
	      return _crawler2.default.crawl({ url: urlLinks, selector: linksSelector, headers: headers }).then(function ($list) {
	        return $list.map(function (i) {
	          return _url2.default.join(baseUrl, $list.eq(i).attr('href'));
	        }).get();
	      });
	    }
	  }, {
	    key: 'createDocument',
	    value: function createDocument(args) {
	
	      if (args instanceof Object && !args.urls) {
	        return App.getUrls(args).then(function (urls) {
	          return App.createDocument(Object.assign(args, { urls: urls }));
	        });
	      }
	
	      var schema = {
	        type: 'object',
	        properties: {
	          documentTitle: { type: 'string' },
	          urls: [{ type: 'string', minlength: 1 }],
	          selectors: { type: 'object' },
	          directory: { type: 'string' },
	          headers: { type: 'object', optional: true },
	          itemTemplate: { type: 'string' },
	          documentFrontTemplate: { type: 'string', minlength: 1, optional: true },
	          documentTemplate: { type: 'string', minlength: 1, optional: true },
	          logMode: { type: 'boolean', optional: true }
	        }
	      };
	
	      var validation = inspector.validate(schema, args);
	
	      if (!validation.valid) {
	        return Promise.reject(new Error(validation.format()));
	      }
	
	      var sanitation = inspector.sanitize(schema, args);
	
	      var _sanitation$data = sanitation.data;
	      var urls = _sanitation$data.urls;
	      var selectors = _sanitation$data.selectors;
	      var directory = _sanitation$data.directory;
	      var headers = _sanitation$data.headers;
	      var itemTemplate = _sanitation$data.itemTemplate;
	      var documentFrontTemplate = _sanitation$data.documentFrontTemplate;
	      var documentTemplate = _sanitation$data.documentTemplate;
	      var logMode = _sanitation$data.logMode;
	      var documentTitle = _sanitation$data.documentTitle;
	
	
	      var html = new _html2.default({ selectors: selectors, documentTitle: documentTitle, templates: { item: itemTemplate, documentFront: documentFrontTemplate, document: documentTemplate } });
	
	      return _scraper2.default.scrape({ urls: urls, headers: headers, directory: directory }).then(function (resources) {
	        return Promise.all(resources.map(function (resource) {
	          return _html2.default.open(path.join(directory, resource.filename));
	        }));
	      }).then(function (doms) {
	        html.addContent(doms);
	        return html.saveInDisk(path.join(process.cwd(), directory, 'index.html'));
	      }).then(function (dir) {
	        _logger2.default.log(logMode, dir);
	        return dir;
	      }, function (err) {
	        _logger2.default.error(logMode, err);
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
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _request = __webpack_require__(3);
	
	var _request2 = _interopRequireDefault(_request);
	
	var _cheerio = __webpack_require__(4);
	
	var cheerio = _interopRequireWildcard(_cheerio);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
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
	        (0, _request2.default)(url, { headers: headers }, function (err, response, body) {
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
	
	exports.default = Crawler;

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
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _cheerio = __webpack_require__(4);
	
	var cheerio = _interopRequireWildcard(_cheerio);
	
	var _fs = __webpack_require__(6);
	
	var fs = _interopRequireWildcard(_fs);
	
	var _path = __webpack_require__(7);
	
	var path = _interopRequireWildcard(_path);
	
	var _lodash = __webpack_require__(8);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _utils = __webpack_require__(9);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
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
	    var itemTemplate = _ref$templates$item === undefined ? (0, _utils.mandatory)('templates.item') : _ref$templates$item;
	
	    _classCallCheck(this, Html);
	
	    var documentFront = (0, _lodash2.default)(documentFrontTemplate)({ documentTitle: documentTitle });
	    var document = (0, _lodash2.default)(documentTemplate)({ documentTitle: documentTitle, documentFront: documentFront });
	
	    this.$ = cheerio.load(document);
	
	    this.itemCompiledTemplate = (0, _lodash2.default)(itemTemplate);
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
	
	exports.default = Html;

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
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
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
	
	exports.default = Utils;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _urlJoin = __webpack_require__(11);
	
	var _urlJoin2 = _interopRequireDefault(_urlJoin);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Url = function () {
	    function Url() {
	        _classCallCheck(this, Url);
	    }
	
	    _createClass(Url, null, [{
	        key: 'join',
	        value: function join() {
	            return _urlJoin2.default.apply(undefined, arguments);
	        }
	    }]);
	
	    return Url;
	}();
	
	exports.default = Url;

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("url-join");

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _request = __webpack_require__(3);
	
	var _request2 = _interopRequireDefault(_request);
	
	var _cheerio = __webpack_require__(4);
	
	var cheerio = _interopRequireWildcard(_cheerio);
	
	var _websiteScraper = __webpack_require__(13);
	
	var scraper = _interopRequireWildcard(_websiteScraper);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
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
	
	exports.default = Scraper;

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("website-scraper");

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
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
	
	exports.default = Logger;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(16);


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * This module is intended to be executed both on client side and server side.
	 * No error should be thrown. (soft error handling)
	 */
	
	(function () {
		var root = {};
		// Dependencies --------------------------------------------------------------
		root.async = ( true) ? __webpack_require__(17) : window.async;
		if (typeof root.async !== 'object') {
			throw new Error('Module async is required (https://github.com/caolan/async)');
		}
		var async = root.async;
	
		function _extend(origin, add) {
			if (!add || typeof add !== 'object') {
				return origin;
			}
			var keys = Object.keys(add);
			var i = keys.length;
			while (i--) {
				origin[keys[i]] = add[keys[i]];
			}
			return origin;
		}
	
		function _merge() {
			var ret = {};
			var args = Array.prototype.slice.call(arguments);
			var keys = null;
			var i = null;
	
			args.forEach(function (arg) {
				if (arg && arg.constructor === Object) {
					keys = Object.keys(arg);
					i = keys.length;
					while (i--) {
						ret[keys[i]] = arg[keys[i]];
					}
				}
			});
			return ret;
		}
	
		// Customisable class (Base class) -------------------------------------------
		// Use with operation "new" to extend Validation and Sanitization themselves,
		// not their prototype. In other words, constructor shall be call to extend
		// those functions, instead of being in their constructor, like this:
		//		_extend(Validation, new Customisable);
	
		function Customisable() {
			this.custom = {};
	
			this.extend = function (custom) {
				return _extend(this.custom, custom);
			};
	
			this.reset = function () {
				this.custom = {};
			};
	
			this.remove = function (fields) {
				if (!_typeIs.array(fields)) {
					fields = [fields];
				}
				fields.forEach(function (field) {
					delete this.custom[field];
				}, this);
			};
		}
	
		// Inspection class (Base class) ---------------------------------------------
		// Use to extend Validation and Sanitization prototypes. Inspection
		// constructor shall be called in derived class constructor.
	
		function Inspection(schema, custom) {
			var _stack = ['@'];
	
			this._schema = schema;
			this._custom = {};
			if (custom != null) {
				for (var key in custom) {
					if (custom.hasOwnProperty(key)){
						this._custom['$' + key] = custom[key];
					}
				}
			}
	
			this._getDepth = function () {
				return _stack.length;
			};
	
			this._dumpStack = function () {
				return _stack.map(function (i) {return i.replace(/^\[/g, '\033\034\035\036');})
				.join('.').replace(/\.\033\034\035\036/g, '[');
			};
	
			this._deeperObject = function (name) {
				_stack.push((/^[a-z$_][a-z0-9$_]*$/i).test(name) ? name : '["' + name + '"]');
				return this;
			};
	
			this._deeperArray = function (i) {
				_stack.push('[' + i + ']');
				return this;
			};
	
			this._back = function () {
				_stack.pop();
				return this;
			};
		}
		// Simple types --------------------------------------------------------------
		// If the property is not defined or is not in this list:
		var _typeIs = {
			"function": function (element) {
				return typeof element === 'function';
			},
			"string": function (element) {
				return typeof element === 'string';
			},
			"number": function (element) {
				return typeof element === 'number' && !isNaN(element);
			},
			"integer": function (element) {
				return typeof element === 'number' && element % 1 === 0;
			},
			"NaN": function (element) {
				return typeof element === 'number' && isNaN(element);
			},
			"boolean": function (element) {
				return typeof element === 'boolean';
			},
			"null": function (element) {
				return element === null;
			},
			"date": function (element) {
				return element != null && element instanceof Date;
			},
			"object": function (element) {
				return element != null && element.constructor === Object;
			},
			"array": function (element) {
				return element != null && element.constructor === Array;
			},
			"any": function (element) {
				return true;
			}
		};
	
		function _simpleType(type, candidate) {
			if (typeof type == 'function') {
				return candidate instanceof type;
			}
			type = type in _typeIs ? type : 'any';
			return _typeIs[type](candidate);
		}
	
		function _realType(candidate) {
			for (var i in _typeIs) {
				if (_simpleType(i, candidate)) {
					if (i !== 'any') { return i; }
					return 'an instance of ' + candidate.constructor.name;
				}
			}
		}
	
		function getIndexes(a, value) {
			var indexes = [];
			var i = a.indexOf(value);
	
			while (i !== -1) {
				indexes.push(i);
				i = a.indexOf(value, i + 1);
			}
			return indexes;
		}
	
		// Available formats ---------------------------------------------------------
		var _formats = {
			'void': /^$/,
			'url': /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)?(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
			'date-time': /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z?|(-|\+)\d{2}:\d{2})$/,
			'date': /^\d{4}-\d{2}-\d{2}$/,
			'coolDateTime': /^\d{4}(-|\/)\d{2}(-|\/)\d{2}(T| )\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
			'time': /^\d{2}\:\d{2}\:\d{2}$/,
			'color': /^#([0-9a-f])+$/i,
			'email': /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
			'numeric': /^[0-9]+$/,
			'integer': /^\-?[0-9]+$/,
			'decimal': /^\-?[0-9]*\.?[0-9]+$/,
			'alpha': /^[a-z]+$/i,
			'alphaNumeric': /^[a-z0-9]+$/i,
			'alphaDash': /^[a-z0-9_-]+$/i,
			'javascript': /^[a-z_\$][a-z0-9_\$]*$/i,
			'upperString': /^[A-Z ]*$/,
			'lowerString': /^[a-z ]*$/
		};
	
	// Validation ------------------------------------------------------------------
		var _validationAttribut = {
			optional: function (schema, candidate) {
				var opt = typeof schema.optional === 'boolean' ? schema.optional : (schema.optional === 'true'); // Default is false
	
				if (opt === true) {
					return;
				}
				if (typeof candidate === 'undefined') {
					this.report('is missing and not optional');
				}
			},
			type: function (schema, candidate) {
				// return because optional function already handle this case
				if (typeof candidate === 'undefined' || (typeof schema.type !== 'string' && !(schema.type instanceof Array) && typeof schema.type !== 'function')) {
					return;
				}
				var types = _typeIs.array(schema.type) ? schema.type : [schema.type];
				var typeIsValid = types.some(function (type) {
					return _simpleType(type, candidate);
				});
				if (!typeIsValid) {
					types = types.map(function (t) {return typeof t === 'function' ? 'and instance of ' + t.name : t; });
					this.report('must be ' + types.join(' or ') + ', but is ' + _realType(candidate));
				}
			},
			uniqueness: function (schema, candidate) {
				if (typeof schema.uniqueness === 'string') { schema.uniqueness = (schema.uniqueness === 'true'); }
				if (typeof schema.uniqueness !== 'boolean' || schema.uniqueness === false || (!_typeIs.array(candidate) && typeof candidate !== 'string')) {
					return;
				}
				var reported = [];
				for (var i = 0; i < candidate.length; i++) {
					if (reported.indexOf(candidate[i]) >= 0) {
						continue;
					}
					var indexes = getIndexes(candidate, candidate[i]);
					if (indexes.length > 1) {
						reported.push(candidate[i]);
						this.report('has value [' + candidate[i] + '] more than once at indexes [' + indexes.join(', ') + ']');
					}
				}
			},
			pattern: function (schema, candidate) {
				var self = this;
				var regexs = schema.pattern;
				if (typeof candidate !== 'string') {
					return;
				}
				var matches = false;
				if (!_typeIs.array(regexs)) {
					regexs = [regexs];
				}
				regexs.forEach(function (regex) {
					if (typeof regex === 'string' && regex in _formats) {
						regex = _formats[regex];
					}
					if (regex instanceof RegExp) {
						if (regex.test(candidate)) {
							matches = true;
						}
					}
				});
				if (!matches) {
					self.report('must match [' + regexs.join(' or ') + '], but is equal to "' + candidate + '"');
				}
			},
			validDate: function (schema, candidate) {
				if (String(schema.validDate) === 'true' && candidate instanceof Date && isNaN(candidate.getTime())) {
					this.report('must be a valid date');
				}
			},
			minLength: function (schema, candidate) {
				if (typeof candidate !== 'string' && !_typeIs.array(candidate)) {
					return;
				}
				var minLength = Number(schema.minLength);
				if (isNaN(minLength)) {
					return;
				}
				if (candidate.length < minLength) {
					this.report('must be longer than ' + minLength + ' elements, but it has ' + candidate.length);
				}
			},
			maxLength: function (schema, candidate) {
				if (typeof candidate !== 'string' && !_typeIs.array(candidate)) {
					return;
				}
				var maxLength = Number(schema.maxLength);
				if (isNaN(maxLength)) {
					return;
				}
				if (candidate.length > maxLength) {
					this.report('must be shorter than ' + maxLength + ' elements, but it has ' + candidate.length);
				}
			},
			exactLength: function (schema, candidate) {
				if (typeof candidate !== 'string' && !_typeIs.array(candidate)) {
					return;
				}
				var exactLength = Number(schema.exactLength);
				if (isNaN(exactLength)) {
					return;
				}
				if (candidate.length !== exactLength) {
					this.report('must have exactly ' + exactLength + ' elements, but it have ' + candidate.length);
				}
			},
			lt: function (schema, candidate) {
				var limit = Number(schema.lt);
				if (typeof candidate !== 'number' || isNaN(limit)) {
					return;
				}
				if (candidate >= limit) {
					this.report('must be less than ' + limit + ', but is equal to "' + candidate + '"');
				}
			},
			lte: function (schema, candidate) {
				var limit = Number(schema.lte);
				if (typeof candidate !== 'number' || isNaN(limit)) {
					return;
				}
				if (candidate > limit) {
					this.report('must be less than or equal to ' + limit + ', but is equal to "' + candidate + '"');
				}
			},
			gt: function (schema, candidate) {
				var limit = Number(schema.gt);
				if (typeof candidate !== 'number' || isNaN(limit)) {
					return;
				}
				if (candidate <= limit) {
					this.report('must be greater than ' + limit + ', but is equal to "' + candidate + '"');
				}
			},
			gte: function (schema, candidate) {
				var limit = Number(schema.gte);
				if (typeof candidate !== 'number' || isNaN(limit)) {
					return;
				}
				if (candidate < limit) {
					this.report('must be greater than or equal to ' + limit + ', but is equal to "' + candidate + '"');
				}
			},
			eq: function (schema, candidate) {
				if (typeof candidate !== 'number' && typeof candidate !== 'string' && typeof candidate !== 'boolean') {
					return;
				}
				var limit = schema.eq;
				if (typeof limit !== 'number' && typeof limit !== 'string' && typeof limit !== 'boolean' && !_typeIs.array(limit)) {
					return;
				}
				if (_typeIs.array(limit)) {
					for (var i = 0; i < limit.length; i++) {
						if (candidate === limit[i]) {
							return;
						}
					}
					this.report('must be equal to [' + limit.map(function (l) {
						return '"' + l + '"';
					}).join(' or ') + '], but is equal to "' + candidate + '"');
				}
				else {
					if (candidate !== limit) {
						this.report('must be equal to "' + limit + '", but is equal to "' + candidate + '"');
					}
				}
			},
			ne: function (schema, candidate) {
				if (typeof candidate !== 'number' && typeof candidate !== 'string') {
					return;
				}
				var limit = schema.ne;
				if (typeof limit !== 'number' && typeof limit !== 'string' && !_typeIs.array(limit)) {
					return;
				}
				if (_typeIs.array(limit)) {
					for (var i = 0; i < limit.length; i++) {
						if (candidate === limit[i]) {
							this.report('must not be equal to "' + limit[i] + '"');
							return;
						}
					}
				}
				else {
					if (candidate === limit) {
						this.report('must not be equal to "' + limit + '"');
					}
				}
			},
			someKeys: function (schema, candidat) {
				var _keys = schema.someKeys;
				if (!_typeIs.object(candidat)) {
					return;
				}
				var valid = _keys.some(function (action) {
					return (action in candidat);
				});
				if (!valid) {
					this.report('must have at least key ' + _keys.map(function (i) {
						return '"' + i + '"';
					}).join(' or '));
				}
			},
			strict: function (schema, candidate) {
				if (typeof schema.strict === 'string') { schema.strict = (schema.strict === 'true'); }
				if (schema.strict !== true || !_typeIs.object(candidate) || !_typeIs.object(schema.properties)) {
					return;
				}
				var self = this;
				if (typeof schema.properties['*'] === 'undefined') {
					var intruder = Object.keys(candidate).filter(function (key) {
						return (typeof schema.properties[key] === 'undefined');
					});
					if (intruder.length > 0) {
						var msg = 'should not contains ' + (intruder.length > 1 ? 'properties' : 'property') +
							' [' + intruder.map(function (i) { return '"' + i + '"'; }).join(', ') + ']';
						self.report(msg);
					}
				}
			},
			exec: function (schema, candidate, callback) {
				var self = this;
	
				if (typeof callback === 'function') {
					return this.asyncExec(schema, candidate, callback);
				}
				(_typeIs.array(schema.exec) ? schema.exec : [schema.exec]).forEach(function (exec) {
					if (typeof exec === 'function') {
						exec.call(self, schema, candidate);
					}
				});
			},
			properties: function (schema, candidate, callback) {
				if (typeof callback === 'function') {
					return this.asyncProperties(schema, candidate, callback);
				}
				if (!(schema.properties instanceof Object) || !(candidate instanceof Object)) {
					return;
				}
				var properties = schema.properties,
						i;
				if (properties['*'] != null) {
					for (i in candidate) {
						if (i in properties) {
							continue;
						}
						this._deeperObject(i);
						this._validate(properties['*'], candidate[i]);
						this._back();
					}
				}
				for (i in properties) {
					if (i === '*') {
						continue;
					}
					this._deeperObject(i);
					this._validate(properties[i], candidate[i]);
					this._back();
				}
			},
			items: function (schema, candidate, callback) {
				if (typeof callback === 'function') {
					return this.asyncItems(schema, candidate, callback);
				}
				if (!(schema.items instanceof Object) || !(candidate instanceof Object)) {
					return;
				}
				var items = schema.items;
				var i, l;
				// If provided schema is an array
				// then call validate for each case
				// else it is an Object
				// then call validate for each key
				if (_typeIs.array(items) && _typeIs.array(candidate)) {
					for (i = 0, l = items.length; i < l; i++) {
						this._deeperArray(i);
						this._validate(items[i], candidate[i]);
						this._back();
					}
				}
				else {
					for (var key in candidate) {
						if (candidate.hasOwnProperty(key)){
							this._deeperArray(key);
							this._validate(items, candidate[key]);
							this._back();
						}
	
					}
				}
			}
		};
	
		var _asyncValidationAttribut = {
			asyncExec: function (schema, candidate, callback) {
				var self = this;
				async.eachSeries(_typeIs.array(schema.exec) ? schema.exec : [schema.exec], function (exec, done) {
					if (typeof exec === 'function') {
						if (exec.length > 2) {
							return exec.call(self, schema, candidate, done);
						}
						exec.call(self, schema, candidate);
					}
					async.nextTick(done);
				}, callback);
			},
			asyncProperties: function (schema, candidate, callback) {
				if (!(schema.properties instanceof Object) || !_typeIs.object(candidate)) {
					return callback();
				}
				var self = this;
				var properties = schema.properties;
				async.series([
					function (next) {
						if (properties['*'] == null) {
							return next();
						}
						async.eachSeries(Object.keys(candidate), function (i, done) {
							if (i in properties) {
								return async.nextTick(done);
							}
							self._deeperObject(i);
							self._asyncValidate(properties['*'], candidate[i], function (err) {
								self._back();
								done(err);
							});
						}, next);
					},
					function (next) {
						async.eachSeries(Object.keys(properties), function (i, done) {
							if (i === '*') {
								return async.nextTick(done);
							}
							self._deeperObject(i);
							self._asyncValidate(properties[i], candidate[i], function (err) {
								self._back();
								done(err);
							});
						}, next);
					}
				], callback);
			},
			asyncItems: function (schema, candidate, callback) {
				if (!(schema.items instanceof Object) || !(candidate instanceof Object)) {
					return callback();
				}
				var self = this;
				var items = schema.items;
				var i, l;
	
				if (_typeIs.array(items) && _typeIs.array(candidate)) {
					async.timesSeries(items.length, function (i, done) {
						self._deeperArray(i);
						self._asyncValidate(items[i], candidate[i], function (err, res) {
							self._back();
							done(err, res);
						});
						self._back();
					}, callback);
				}
				else {
					async.eachSeries(Object.keys(candidate), function (key, done) {
						self._deeperArray(key);
						self._asyncValidate(items, candidate[key], function (err, res) {
							self._back();
							done(err, res);
						});
					}, callback);
				}
			}
		};
	
		// Validation Class ----------------------------------------------------------
		// inherits from Inspection class (actually we just call Inspection
		// constructor with the new context, because its prototype is empty
		function Validation(schema, custom) {
			Inspection.prototype.constructor.call(this, schema, _merge(Validation.custom, custom));
			var _error = [];
	
			this._basicFields = Object.keys(_validationAttribut);
			this._customFields = Object.keys(this._custom);
			this.origin = null;
	
			this.report = function (message, code) {
				var newErr = {
					code: code || this.userCode || null,
					message: this.userError || message || 'is invalid',
					property: this.userAlias ? (this.userAlias + ' (' + this._dumpStack() + ')') : this._dumpStack()
				};
				_error.push(newErr);
				return this;
			};
	
			this.result = function () {
				return {
					error: _error,
					valid: _error.length === 0,
					format: function () {
						if (this.valid === true) {
							return 'Candidate is valid';
						}
						return this.error.map(function (i) {
							return 'Property ' + i.property + ': ' + i.message;
						}).join('\n');
					}
				};
			};
		}
	
		_extend(Validation.prototype, _validationAttribut);
		_extend(Validation.prototype, _asyncValidationAttribut);
		_extend(Validation, new Customisable());
	
		Validation.prototype.validate = function (candidate, callback) {
			this.origin = candidate;
			if (typeof callback === 'function') {
				var self = this;
				return async.nextTick(function () {
					self._asyncValidate(self._schema, candidate, function (err) {
						self.origin = null;
						callback(err, self.result());
					});
				});
			}
			return this._validate(this._schema, candidate).result();
		};
	
		Validation.prototype._validate = function (schema, candidate, callback) {
			this.userCode = schema.code || null;
			this.userError = schema.error || null;
			this.userAlias = schema.alias || null;
			this._basicFields.forEach(function (i) {
				if ((i in schema || i === 'optional') && typeof this[i] === 'function') {
					this[i](schema, candidate);
				}
			}, this);
			this._customFields.forEach(function (i) {
				if (i in schema && typeof this._custom[i] === 'function') {
					this._custom[i].call(this, schema, candidate);
				}
			}, this);
			return this;
		};
	
		Validation.prototype._asyncValidate = function (schema, candidate, callback) {
			var self = this;
			this.userCode = schema.code || null;
			this.userError = schema.error || null;
			this.userAlias = schema.alias || null;
	
			async.series([
				function (next) {
					async.eachSeries(Object.keys(_validationAttribut), function (i, done) {
						async.nextTick(function () {
							if ((i in schema || i === 'optional') && typeof self[i] === 'function') {
								if (self[i].length > 2) {
									return self[i](schema, candidate, done);
								}
								self[i](schema, candidate);
							}
							done();
						});
					}, next);
				},
				function (next) {
					async.eachSeries(Object.keys(self._custom), function (i, done) {
						async.nextTick(function () {
							if (i in schema && typeof self._custom[i] === 'function') {
								if (self._custom[i].length > 2) {
									return self._custom[i].call(self, schema, candidate, done);
								}
								self._custom[i].call(self, schema, candidate);
							}
							done();
						});
					}, next);
				}
			], callback);
		};
	
	// Sanitization ----------------------------------------------------------------
		// functions called by _sanitization.type method.
		var _forceType = {
			number: function (post, schema) {
				var n;
				if (typeof post === 'number') {
					return post;
				}
				else if (post === '') {
					if (typeof schema.def !== 'undefined')
						return schema.def;
					return null;
				}
				else if (typeof post === 'string') {
					n = parseFloat(post.replace(/,/g, '.').replace(/ /g, ''));
					if (typeof n === 'number') {
						return n;
					}
				}
				else if (post instanceof Date) {
					return +post;
				}
				return null;
			},
			integer: function (post, schema) {
				var n;
				if (typeof post === 'number' && post % 1 === 0) {
					return post;
				}
				else if (post === '') {
					if (typeof schema.def !== 'undefined')
						return schema.def;
					return null;
				}
				else if (typeof post === 'string') {
					n = parseInt(post.replace(/ /g, ''), 10);
					if (typeof n === 'number') {
						return n;
					}
				}
				else if (typeof post === 'number') {
					return parseInt(post, 10);
				}
				else if (typeof post === 'boolean') {
					if (post) { return 1; }
					return 0;
				}
				else if (post instanceof Date) {
					return +post;
				}
				return null;
			},
			string: function (post, schema) {
				if (typeof post === 'boolean' || typeof post === 'number' || post instanceof Date) {
					return post.toString();
				}
				else if (_typeIs.array(post)) {
					// If user authorize array and strings...
					if (schema.items || schema.properties)
						return post;
					return post.join(String(schema.joinWith || ','));
				}
				else if (post instanceof Object) {
					// If user authorize objects ans strings...
					if (schema.items || schema.properties)
						return post;
					return JSON.stringify(post);
				}
				else if (typeof post === 'string' && post.length) {
					return post;
				}
				return null;
			},
			date: function (post, schema) {
				if (post instanceof Date) {
					return post;
				}
				else {
					var d = new Date(post);
					if (!isNaN(d.getTime())) { // if valid date
						return d;
					}
				}
				return null;
			},
			boolean: function (post, schema) {
				if (typeof post === 'undefined') return null;
				if (typeof post === 'string' && post.toLowerCase() === 'false') return false;
				return !!post;
			},
			object: function (post, schema) {
				if (typeof post !== 'string' || _typeIs.object(post)) {
					return post;
				}
				try {
					return JSON.parse(post);
				}
				catch (e) {
					return null;
				}
			},
			array: function (post, schema) {
				if (_typeIs.array(post))
					return post;
				if (typeof post === 'undefined')
					return null;
				if (typeof post === 'string') {
					if (post.substring(0,1) === '[' && post.slice(-1) === ']') {
						try {
							return JSON.parse(post);
						}
						catch (e) {
							return null;
						}
					}
					return post.split(String(schema.splitWith || ','));
	
				}
				if (!_typeIs.array(post))
					return [ post ];
				return null;
			}
		};
	
		var _applyRules = {
			upper: function (post) {
				return post.toUpperCase();
			},
			lower: function (post) {
				return post.toLowerCase();
			},
			title: function (post) {
				// Fix by seb (replace \w\S* by \S* => exemple : coucou ça va)
				return post.replace(/\S*/g, function (txt) {
					return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
				});
			},
			capitalize: function (post) {
				return post.charAt(0).toUpperCase() + post.substr(1).toLowerCase();
			},
			ucfirst: function (post) {
				return post.charAt(0).toUpperCase() + post.substr(1);
			},
			trim: function (post) {
				return post.trim();
			}
		};
	
		// Every function return the future value of each property. Therefore you
		// have to return post even if you do not change its value
		var _sanitizationAttribut = {
			strict: function (schema, post) {
				if (typeof schema.strict === 'string') { schema.strict = (schema.strict === 'true'); }
				if (schema.strict !== true)
					return post;
				if (!_typeIs.object(schema.properties))
					return post;
				if (!_typeIs.object(post))
					return post;
				var that = this;
				Object.keys(post).forEach(function (key) {
					if (!(key in schema.properties)) {
						delete post[key];
					}
				});
				return post;
			},
			optional: function (schema, post) {
				var opt = typeof schema.optional === 'boolean' ? schema.optional : (schema.optional !== 'false'); // Default: true
				if (opt === true) {
					return post;
				}
				if (typeof post !== 'undefined') {
					return post;
				}
				this.report();
				if (schema.def === Date) {
					return new Date();
				}
				return schema.def;
			},
			type: function (schema, post) {
				// if (_typeIs['object'](post) || _typeIs.array(post)) {
				// 	return post;
				// }
				if (typeof schema.type !== 'string' || typeof _forceType[schema.type] !== 'function') {
					return post;
				}
				var n;
				var opt = typeof schema.optional === 'boolean' ? schema.optional : true;
				if (typeof _forceType[schema.type] === 'function') {
					n = _forceType[schema.type](post, schema);
					if ((n === null && !opt) || (!n && isNaN(n)) || (n === null && schema.type === 'string')) {
						n = schema.def;
					}
				}
				else if (!opt) {
					n = schema.def;
				}
				if ((n != null || (typeof schema.def !== 'undefined' && schema.def === n)) && n !== post) {
					this.report();
					return n;
				}
				return post;
			},
			rules: function (schema, post) {
				var rules = schema.rules;
				if (typeof post !== 'string' || (typeof rules !== 'string' && !_typeIs.array(rules))) {
					return post;
				}
				var modified = false;
				(_typeIs.array(rules) ? rules : [rules]).forEach(function (rule) {
					if (typeof _applyRules[rule] === 'function') {
						post = _applyRules[rule](post);
						modified = true;
					}
				});
				if (modified) {
					this.report();
				}
				return post;
			},
			min: function (schema, post) {
				var postTest = Number(post);
				if (isNaN(postTest)) {
					return post;
				}
				var min = Number(schema.min);
				if (isNaN(min)) {
					return post;
				}
				if (postTest < min) {
					this.report();
					return min;
				}
				return post;
			},
			max: function (schema, post) {
				var postTest = Number(post);
				if (isNaN(postTest)) {
					return post;
				}
				var max = Number(schema.max);
				if (isNaN(max)) {
					return post;
				}
				if (postTest > max) {
					this.report();
					return max;
				}
				return post;
			},
			minLength: function (schema, post) {
				var limit = Number(schema.minLength);
				if (typeof post !== 'string' || isNaN(limit) || limit < 0) {
					return post;
				}
				var str = '';
				var gap = limit - post.length;
				if (gap > 0) {
					for (var i = 0; i < gap; i++) {
						str += '-';
					}
					this.report();
					return post + str;
				}
				return post;
			},
			maxLength: function (schema, post) {
				var limit = Number(schema.maxLength);
				if (typeof post !== 'string' || isNaN(limit) || limit < 0) {
					return post;
				}
				if (post.length > limit) {
					this.report();
					return post.slice(0, limit);
				}
				return post;
			},
			properties: function (schema, post, callback) {
				if (typeof callback === 'function') {
					return this.asyncProperties(schema, post, callback);
				}
				if (!post || typeof post !== 'object') {
					return post;
				}
				var properties = schema.properties;
				var tmp;
				var i;
				if (typeof properties['*'] !== 'undefined') {
					for (i in post) {
						if (i in properties) {
							continue;
						}
						this._deeperObject(i);
						tmp = this._sanitize(schema.properties['*'], post[i]);
						if (typeof tmp !== 'undefined') {
							post[i]= tmp;
						}
						this._back();
					}
				}
				for (i in schema.properties) {
					if (i !== '*') {
						this._deeperObject(i);
						tmp = this._sanitize(schema.properties[i], post[i]);
						if (typeof tmp !== 'undefined') {
							post[i]= tmp;
						}
						this._back();
					}
				}
				return post;
			},
			items: function (schema, post, callback) {
				if (typeof callback === 'function') {
					return this.asyncItems(schema, post, callback);
				}
				if (!(schema.items instanceof Object) || !(post instanceof Object)) {
					return post;
				}
				var i;
				if (_typeIs.array(schema.items) && _typeIs.array(post)) {
					var minLength = schema.items.length < post.length ? schema.items.length : post.length;
					for (i = 0; i < minLength; i++) {
						this._deeperArray(i);
						post[i] = this._sanitize(schema.items[i], post[i]);
						this._back();
					}
				}
				else {
					for (i in post) {
						this._deeperArray(i);
						post[i] = this._sanitize(schema.items, post[i]);
						this._back();
					}
				}
				return post;
			},
			exec: function (schema, post, callback) {
				if (typeof callback === 'function') {
					return this.asyncExec(schema, post, callback);
				}
				var execs = _typeIs.array(schema.exec) ? schema.exec : [schema.exec];
	
				execs.forEach(function (exec) {
					if (typeof exec === 'function') {
						post = exec.call(this, schema, post);
					}
				}, this);
				return post;
			}
		};
	
		var _asyncSanitizationAttribut = {
			asyncExec: function (schema, post, callback) {
				var self = this;
				var execs = _typeIs.array(schema.exec) ? schema.exec : [schema.exec];
	
				async.eachSeries(execs, function (exec, done) {
					if (typeof exec === 'function') {
						if (exec.length > 2) {
							return exec.call(self, schema, post, function (err, res) {
								if (err) {
									return done(err);
								}
								post = res;
								done();
							});
						}
						post = exec.call(self, schema, post);
					}
					done();
				}, function (err) {
					callback(err, post);
				});
			},
			asyncProperties: function (schema, post, callback) {
				if (!post || typeof post !== 'object') {
					return callback(null, post);
				}
				var self = this;
				var properties = schema.properties;
	
				async.series([
					function (next) {
						if (properties['*'] == null) {
							return next();
						}
						var globing = properties['*'];
						async.eachSeries(Object.keys(post), function (i, next) {
							if (i in properties) {
								return next();
							}
							self._deeperObject(i);
							self._asyncSanitize(globing, post[i], function (err, res) {
								if (err) { /* Error can safely be ignored here */ }
								if (typeof res !== 'undefined') {
									post[i] = res;
								}
								self._back();
								next();
							});
						}, next);
					},
					function (next) {
						async.eachSeries(Object.keys(properties), function (i, next) {
							if (i === '*') {
								return next();
							}
							self._deeperObject(i);
							self._asyncSanitize(properties[i], post[i], function (err, res) {
								if (err) {
									return next(err);
								}
								if (typeof res !== 'undefined') {
									post[i] = res;
								}
								self._back();
								next();
							});
						}, next);
					}
				], function (err) {
					return callback(err, post);
				});
			},
			asyncItems: function (schema, post, callback) {
				if (!(schema.items instanceof Object) || !(post instanceof Object)) {
					return callback(null, post);
				}
				var self = this;
				var items = schema.items;
				if (_typeIs.array(items) && _typeIs.array(post)) {
					var minLength = items.length < post.length ? items.length : post.length;
					async.timesSeries(minLength, function (i, next) {
						self._deeperArray(i);
						self._asyncSanitize(items[i], post[i], function (err, res) {
							if (err) {
								return next(err);
							}
							post[i] = res;
							self._back();
							next();
						});
					}, function (err) {
						callback(err, post);
					});
				}
				else {
					async.eachSeries(Object.keys(post), function (key, next) {
						self._deeperArray(key);
						self._asyncSanitize(items, post[key], function (err, res) {
							if (err) {
								return next();
							}
							post[key] = res;
							self._back();
							next();
						});
					}, function (err) {
						callback(err, post);
					});
				}
				return post;
			}
		};
	
		// Sanitization Class --------------------------------------------------------
		// inherits from Inspection class (actually we just call Inspection
		// constructor with the new context, because its prototype is empty
		function Sanitization(schema, custom) {
			Inspection.prototype.constructor.call(this, schema, _merge(Sanitization.custom, custom));
			var _reporting = [];
	
			this._basicFields = Object.keys(_sanitizationAttribut);
			this._customFields = Object.keys(this._custom);
			this.origin = null;
	
			this.report = function (message) {
				var newNot = {
						message: message || 'was sanitized',
						property: this.userAlias ? (this.userAlias + ' (' + this._dumpStack() + ')') : this._dumpStack()
				};
				if (!_reporting.some(function (e) { return e.property === newNot.property; })) {
					_reporting.push(newNot);
				}
			};
	
			this.result = function (data) {
				return {
					data: data,
					reporting: _reporting,
					format: function () {
						return this.reporting.map(function (i) {
							return 'Property ' + i.property + ' ' + i.message;
						}).join('\n');
					}
				};
			};
		}
	
		_extend(Sanitization.prototype, _sanitizationAttribut);
		_extend(Sanitization.prototype, _asyncSanitizationAttribut);
		_extend(Sanitization, new Customisable());
	
	
		Sanitization.prototype.sanitize = function (post, callback) {
			this.origin = post;
			if (typeof callback === 'function') {
				var self = this;
				return this._asyncSanitize(this._schema, post, function (err, data) {
					self.origin = null;
					callback(err, self.result(data));
				});
			}
			var data = this._sanitize(this._schema, post);
			this.origin = null;
			return this.result(data);
		};
	
		Sanitization.prototype._sanitize = function (schema, post) {
			this.userAlias = schema.alias || null;
			this._basicFields.forEach(function (i) {
				if ((i in schema || i === 'optional') && typeof this[i] === 'function') {
					post = this[i](schema, post);
				}
			}, this);
			this._customFields.forEach(function (i) {
				if (i in schema && typeof this._custom[i] === 'function') {
					post = this._custom[i].call(this, schema, post);
				}
			}, this);
			return post;
		};
	
		Sanitization.prototype._asyncSanitize = function (schema, post, callback) {
			var self = this;
			this.userAlias = schema.alias || null;
	
			async.waterfall([
				function (next) {
					async.reduce(self._basicFields, post, function (value, i, next) {
						async.nextTick(function () {
							if ((i in schema || i === 'optional') && typeof self[i] === 'function') {
								if (self[i].length > 2) {
									return self[i](schema, value, next);
								}
								value = self[i](schema, value);
							}
							next(null, value);
						});
					}, next);
				},
				function (inter, next) {
					async.reduce(self._customFields, inter, function (value, i, next) {
						async.nextTick(function () {
							if (i in schema && typeof self._custom[i] === 'function') {
								if (self._custom[i].length > 2) {
									return self._custom[i].call(self, schema, value, next);
								}
								value = self._custom[i].call(self, schema, value);
							}
							next(null, value);
						});
					}, next);
				}
			], callback);
		};
	
		// ---------------------------------------------------------------------------
	
		var INT_MIN = -2147483648;
		var INT_MAX = 2147483647;
	
		var _rand = {
			int: function (min, max) {
				return min + (0 | Math.random() * (max - min + 1));
			},
			float: function (min, max) {
				return (Math.random() * (max - min) + min);
			},
			bool: function () {
				return (Math.random() > 0.5);
			},
			char: function (min, max) {
				return String.fromCharCode(this.int(min, max));
			},
			fromList: function (list) {
				return list[this.int(0, list.length - 1)];
			}
		};
	
		var _formatSample = {
			'date-time': function () {
				return new Date().toISOString();
			},
			'date': function () {
				return new Date().toISOString().replace(/T.*$/, '');
			},
			'time': function () {
				return new Date().toLocaleTimeString({}, { hour12: false });
			},
			'color': function (min, max) {
				var s = '#';
				if (min < 1) {
					min = 1;
				}
				for (var i = 0, l = _rand.int(min, max); i < l; i++) {
					s += _rand.fromList('0123456789abcdefABCDEF');
				}
				return s;
			},
			'numeric': function () {
				return '' + _rand.int(0, INT_MAX);
			},
			'integer': function () {
				if (_rand.bool() === true) {
					return '-' + this.numeric();
				}
				return this.numeric();
			},
			'decimal': function () {
				return this.integer() + '.' + this.numeric();
			},
			'alpha': function (min, max) {
				var s = '';
				if (min < 1) {
					min = 1;
				}
				for (var i = 0, l = _rand.int(min, max); i < l; i++) {
					s += _rand.fromList('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
				}
				return s;
			},
			'alphaNumeric': function (min, max) {
				var s = '';
				if (min < 1) {
					min = 1;
				}
				for (var i = 0, l = _rand.int(min, max); i < l; i++) {
					s += _rand.fromList('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
				}
				return s;
			},
			'alphaDash': function (min, max) {
				var s = '';
				if (min < 1) {
					min = 1;
				}
				for (var i = 0, l = _rand.int(min, max); i < l; i++) {
					s += _rand.fromList('_-abcdefghijklmnopqrstuvwxyz_-ABCDEFGHIJKLMNOPQRSTUVWXYZ_-0123456789_-');
				}
				return s;
			},
			'javascript': function (min, max) {
				var s = _rand.fromList('_$abcdefghijklmnopqrstuvwxyz_$ABCDEFGHIJKLMNOPQRSTUVWXYZ_$');
				for (var i = 0, l = _rand.int(min, max - 1); i < l; i++) {
					s += _rand.fromList('_$abcdefghijklmnopqrstuvwxyz_$ABCDEFGHIJKLMNOPQRSTUVWXYZ_$0123456789_$');
				}
				return s;
			}
		};
	
		function _getLimits(schema) {
			var min = INT_MIN;
			var max = INT_MAX;
	
			if (schema.gte != null) {
				min = schema.gte;
			}
			else if (schema.gt != null) {
				min = schema.gt + 1;
			}
			if (schema.lte != null) {
				max = schema.lte;
			}
			else if (schema.lt != null) {
				max = schema.lt - 1;
			}
			return { min: min, max: max };
		}
	
		var _typeGenerator = {
			string: function (schema) {
				if (schema.eq != null) {
					return schema.eq;
				}
				var s = '';
				var minLength = schema.minLength != null ? schema.minLength : 0;
				var maxLength = schema.maxLength != null ? schema.maxLength : 32;
				if (typeof schema.pattern === 'string' && typeof _formatSample[schema.pattern] === 'function') {
					return _formatSample[schema.pattern](minLength, maxLength);
				}
	
				var l = schema.exactLength != null ? schema.exactLength : _rand.int(minLength, maxLength);
				for (var i = 0; i < l; i++) {
					s += _rand.char(32, 126);
				}
				return s;
			},
			number: function (schema) {
				if (schema.eq != null) {
					return schema.eq;
				}
				var limit = _getLimits(schema);
				var n = _rand.float(limit.min, limit.max);
				if (schema.ne != null) {
					var ne = _typeIs.array(schema.ne) ? schema.ne : [schema.ne];
					while (ne.indexOf(n) !== -1) {
						n = _rand.float(limit.min, limit.max);
					}
				}
				return n;
			},
			integer: function (schema) {
				if (schema.eq != null) {
					return schema.eq;
				}
				var limit = _getLimits(schema);
				var n = _rand.int(limit.min, limit.max);
				if (schema.ne != null) {
					var ne = _typeIs.array(schema.ne) ? schema.ne : [schema.ne];
					while (ne.indexOf(n) !== -1) {
						n = _rand.int(limit.min, limit.max);
					}
				}
				return n;
			},
			boolean: function (schema) {
				if (schema.eq != null) {
					return schema.eq;
				}
				return _rand.bool();
			},
			"null": function (schema) {
				return null;
			},
			date: function (schema) {
				if (schema.eq != null) {
					return schema.eq;
				}
				return new Date();
			},
			object: function (schema) {
				var o = {};
				var prop = schema.properties || {};
	
				for (var key in prop) {
					if (prop.hasOwnProperty(key)){
						if (prop[key].optional === true && _rand.bool() === true) {
							continue;
						}
						if (key !== '*') {
							o[key] = this.generate(prop[key]);
						}
						else {
							var rk = '__random_key_';
							var randomKey = rk + 0;
							var n = _rand.int(1, 9);
							for (var i = 1; i <= n; i++) {
								if (!(randomKey in prop)) {
									o[randomKey] = this.generate(prop[key]);
								}
								randomKey = rk + i;
							}
						}
					}
				}
				return o;
			},
			array: function (schema) {
				var self = this;
				var items = schema.items || {};
				var minLength = schema.minLength != null ? schema.minLength : 0;
				var maxLength = schema.maxLength != null ? schema.maxLength : 16;
				var type;
				var candidate;
				var size;
				var i;
	
				if (_typeIs.array(items)) {
					size = items.length;
					if (schema.exactLength != null) {
						size = schema.exactLength;
					}
					else if (size < minLength) {
						size = minLength;
					}
					else if (size > maxLength) {
						size = maxLength;
					}
					candidate = new Array(size);
					type = null;
					for (i = 0; i < size; i++) {
						type = items[i].type || 'any';
						if (_typeIs.array(type)) {
							type = type[_rand.int(0, type.length - 1)];
						}
						candidate[i] = self[type](items[i]);
					}
				}
				else {
					size = schema.exactLength != null ? schema.exactLength : _rand.int(minLength, maxLength);
					candidate = new Array(size);
					type = items.type || 'any';
					if (_typeIs.array(type)) {
						type = type[_rand.int(0, type.length - 1)];
					}
					for (i = 0; i < size; i++) {
						candidate[i] = self[type](items);
					}
				}
				return candidate;
			},
			any: function (schema) {
				var fields = Object.keys(_typeGenerator);
				var i = fields[_rand.int(0, fields.length - 2)];
				return this[i](schema);
			}
		};
	
		// CandidateGenerator Class (Singleton) --------------------------------------
		function CandidateGenerator() {
			// Maybe extends Inspection class too ?
		}
	
		_extend(CandidateGenerator.prototype, _typeGenerator);
	
		var _instance = null;
		CandidateGenerator.instance = function () {
			if (!(_instance instanceof CandidateGenerator)) {
				_instance = new CandidateGenerator();
			}
			return _instance;
		};
	
		CandidateGenerator.prototype.generate = function (schema) {
			var type = schema.type || 'any';
			if (_typeIs.array(type)) {
				type = type[_rand.int(0, type.length - 1)];
			}
			return this[type](schema);
		};
	
	// Exports ---------------------------------------------------------------------
		var SchemaInspector = {};
	
		// if server-side (node.js) else client-side
		if (typeof module !== 'undefined' && module.exports) {
			module.exports = SchemaInspector;
		}
		else {
			window.SchemaInspector = SchemaInspector;
		}
	
		SchemaInspector.newSanitization = function (schema, custom) {
			return new Sanitization(schema, custom);
		};
	
		SchemaInspector.newValidation = function (schema, custom) {
			return new Validation(schema, custom);
		};
	
		SchemaInspector.Validation = Validation;
		SchemaInspector.Sanitization = Sanitization;
	
		SchemaInspector.sanitize = function (schema, post, custom, callback) {
			if (arguments.length === 3 && typeof custom === 'function') {
				callback = custom;
				custom = null;
			}
			return new Sanitization(schema, custom).sanitize(post, callback);
		};
	
		SchemaInspector.validate = function (schema, candidate, custom, callback) {
			if (arguments.length === 3 && typeof custom === 'function') {
				callback = custom;
				custom = null;
			}
			return new Validation(schema, custom).validate(candidate, callback);
		};
	
		SchemaInspector.generate = function (schema, n) {
			if (typeof n === 'number') {
				var r = new Array(n);
				for (var i = 0; i < n; i++) {
					r[i] = CandidateGenerator.instance().generate(schema);
				}
				return r;
			}
			return CandidateGenerator.instance().generate(schema);
		};
	})();


/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("async");

/***/ }
/******/ ]);
//# sourceMappingURL=app.build.js.map