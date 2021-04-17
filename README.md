# FunLoader.js

## Description

FunLoaderJs provides developers with a highly customizable progress bar that can be used in a variety of scenarios, 
from loading images to displaying user progress in a task!

[Landing Page](https://funloader.herokuapp.com/)

[Github Repository](https://github.com/csc309-winter-2021/js-library-gaowilso)

[Documentation](https://funloader.herokuapp.com/documentation)

The documentation page was created using:

* [JSDoc](https://devdocs.io/jsdoc/)
* [better-docs](https://github.com/SoftwareBrothers/better-docs)

### Getting Started

To get set up with the library, include the funloader.js script and funloader.css files in your webpage.

```html
<!-- Example loading the stylesheet and script. Place in the <head> tag of your HTML -->
<link rel="stylesheet" href="funloader.css" />
<script type="text/javascript" type="module" src="funloader.js"></script>
```

There are no external modules required to use this library.

Example code snippet for basic functionality.

```javascript
// Create the loading bar
const pbar = new ProgressBar()
const progressBar = pbar.HTMLreference

// Adding the loading bar to the HTML DOM
document.querySelector('.progress-box').appendChild(progressBar)

// Adding 15% progress to the loading bar.
pbar.addProgress(15)

// Editing the look of the loading bar.
pbar.setProgressGradient(['#FFFFFF', '#FFFFFF'])
pbar.setOpacity(0.7)
```
