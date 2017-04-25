'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _iconvLite = require('iconv-lite');

var _iconvLite2 = _interopRequireDefault(_iconvLite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var initOption = {
  fileName: 'index.html',
  encoding: 'utf-8'
};

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
    // 合并默认值 配置参数优先于默认参数
    this.options = Object.assign({}, initOption, this.options);
    // this.options.encoding = this.options.encoding || 'utf-8';
    this.webpackOptions = {};
  }

  _createClass(trimHTML, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      var options = compiler.options;
      // 合并webpack config 配置参数， webpack config > option > default

      this.options = Object.assign({}, this.options, options.htmlHashOption);
      var localOptions = this.options;
      compiler.plugin('emit', function (compilation, callback) {
        _this.webpackOptions = compilation.options;
        if (_this.options.template) {
          var data = void 0;
          try {
            if (_this.options.encoding === 'utf-8') {
              data = _fs2.default.readFileSync(_path2.default.resolve(_this.options.template), 'utf-8');
            } else {
              data = _iconvLite2.default.decode(_fs2.default.readFileSync(_path2.default.resolve(_this.options.template)), localOptions.encoding);
            }
          } catch (e) {
            throw new Error('no such file or directory');
          }
          if (data) {
            var dataArr = data.split('\n');
            var htmlData = _this.trimFile(dataArr, Object.keys(compilation.assets));
            var htmlDataTrim = _iconvLite2.default.encode(htmlData, localOptions.encoding);
            compilation.assets[localOptions.fileName] = {
              source: function source() {
                return htmlDataTrim;
              },
              size: function size() {
                return htmlDataTrim.length;
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