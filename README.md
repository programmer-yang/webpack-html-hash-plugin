# Inline Hash Webpack Plugin

## Getting Started

### Installation

```bash
$ npm i webpack-html-hash-plugin
```

### Basic Usage



Step1:
```javascript
// add hash
output: {
  filename: '[name].js?v=[hash:6]',
  // or [name].[hash].js
  chunkFilename: '[id].js?v=[hash:6]',
  // or id].[hash:6].js
},

```

Step2:
```javascript
import WebpackHtmlHashPlugin from 'webpack-html-hash-plugin';
//...
[
	new WebpackHtmlHashPlugin()
]
```
config
```javascript
import WebpackHtmlHashPlugin from 'webpack-html-hash-plugin';
//...
[
	new WebpackHtmlHashPlugin({
    fileName: 'test.html',
    template: 'template/test.html'
  })
]
```
template
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Demo</title>
  <link rel="stylesheet" href="index.css" />
</head>
<body>

<div id="root"></div>

<script src="common.js"></script>
<script src="index.js"></script>

</body>
</html>
```
build:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Demo</title>
  <link rel="stylesheet" href="index.css?v=4475fb" />
</head>
<body>

<div id="root"></div>

<script src="common.js?v=4475fb"></script>
<script src="index.js?v=4475fb"></script>

</body>
</html>
```
