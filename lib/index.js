'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var trimHTML = function () {
  function trimHTML(options) {
    _classCallCheck(this, trimHTML);

    this.trimFile = function () {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var assetsKey = arguments[1];

      var fileDataArr = data;
      if (fileDataArr.length > 0) {
        var newFileDataArr = fileDataArr.map(function (item) {
          /**
           * trim Link
           */
          if (item.indexOf('link') !== -1) {
            var newItem = item;
            var linkNames = item.match(/href=".+"/) || [];
            if (linkNames.length > 0) {
              var linkName = linkNames[0];
              linkName = linkName.substr(6, linkName.length - 7);
              assetsKey.forEach(function (keyItem) {
                if (keyItem.indexOf(linkName) !== -1) {
                  // console.log('replace link', item, keyItem);
                  newItem = item.replace(/href=".+"/, 'href="' + keyItem + '"');
                }
              });
              return newItem;
            }
          }
          /**
           * trim Script
           */
          if (item.indexOf('script') !== -1) {
            var _newItem = item;
            var scriptNames = item.match(/src=".+"/) || [];
            if (scriptNames.length > 0) {
              var scriptName = scriptNames[0];
              scriptName = scriptName.substr(6, scriptName.length - 7);
              assetsKey.forEach(function (keyItem) {
                if (keyItem.indexOf(scriptName) !== -1) {
                  // console.log('replace script', item, keyItem);
                  _newItem = item.replace(/src=".+"/, 'src="' + keyItem + '"');
                }
              });
              return _newItem;
            }
          }
          return item;
        });
        var randomString = parseInt(Math.random() * 100000000, 10);
        return newFileDataArr.join(randomString).replace(new RegExp(randomString.toString(), 'g'), '\n');
      }
    };

    this.options = options || {};
    this.webpackOptions = {};
  }

  _createClass(trimHTML, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      var options = compiler.options;

      var trimHtmlHashOption = options.trimHtmlHash || {};
      var localOptions = this.options;
      compiler.plugin('emit', function (compilation, callback) {
        _this.webpackOptions = compilation.options;
        if (_this.options.template || trimHtmlHashOption.template) {
          var data = void 0;
          try {
            data = _fs2.default.readFileSync(_path2.default.resolve(_this.options.template || trimHtmlHashOption.template), 'utf-8');
          } catch (e) {
            throw new Error('no such file or directory');
          }
          if (data) {
            var dataArr = data.split('\n');
            var htmlData = _this.trimFile(dataArr, Object.keys(compilation.assets));
            compilation.assets[localOptions.fileName || trimHtmlHashOption.fileName || 'index.html'] = {
              source: function source() {
                return htmlData;
              },
              size: function size() {
                return htmlData.length;
              }
            };
          }
        } else {
          console.error('no template path !!!');
        }
        callback();
      });
    }
  }]);

  return trimHTML;
}();

exports.default = trimHTML;