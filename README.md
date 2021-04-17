# FunLoader.js

## Description

[Landing Page](https://funloader.herokuapp.com/)
[Github Repository](https://github.com/csc309-winter-2021/js-library-gaowilso)
[Documentation](https://funloader.herokuapp.com/documentation)

The documentation page was created using:

* [JSDoc](https://devdocs.io/jsdoc/)
* [better-docs](https://github.com/SoftwareBrothers/better-docs)

## Getting Started

To get set up with the library, include the funloader.js script and funloader.css files in your webpage.
There are no external modules required to use this library.

Example code snippet for basic functionality

```javascript
// Create the loading bar
const pbar = new ProgressBar()
const progressBar = pbar.HTMLreference

// To place the loading bar in the HTML DOM
document.querySelector('.progress-box').appendChild(progressBar)

// To add progress to the loading bar.
pbar.addProgress(15)

// Edit the look of the loading bar.
pbar.setProgressGradient(['#FFFFFF', '#FFFFFF'])
```
