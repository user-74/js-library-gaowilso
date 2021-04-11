// ----------------------------------------------------------------
// funloader.js for CSC309 individual project winter 2021
// by: Wilson Gao
// utorid/markus: gaowilso
// ----------------------------------------------------------------

// JS Object, array of all active loading bars
const activeProgressBars = []

// Basic Loading Bar Functionality:
/**
 * Get all active loading bars
 * @returns An array containing all active progress bars
 */
function getAllActiveProgressBars() {
    return activeProgressBars
}

/**
 * This function generates the HTML for a progress bar
 * @returns {HTMLDivElement} progressBar The HTML div containing the progress bar
 */
function progressBarHTML() {
    // create the divs that form the loading bar
    const progress = document.createElement('div')
    const progressBar = document.createElement('div')

    // displays percentage outside the progress bar if it is too small (< 25%)
    const outerPercentage = document.createElement('div')

    // set classes
    progressBar.className = 'progress-bar'
    progress.className = 'progress'
    outerPercentage.className = 'outerPercentage'

    progressBar.appendChild(progress)
    progressBar.appendChild(outerPercentage)
    return progressBar
}
/**
 * Options for the progress bar.
 * @typedef {Object} Progress~Options
 * @property {(number|string)} height - The height of the progress bar in pixels or some css amount
 * @property {(number|string)} width - The width of the progress bar in pixels or some css amount
 * @property {string} fontSize - The size of the percentage font, for both outer and inner percentages.
 * @property {string} fontColor - The color of the percentage font, for both outer and inner percentages.
 * @property {boolean} draggable - Whether the progress bar is draggable
 * @property {boolean} hidePercent - Whether the percentage displayed in the progress bar is hidden
 * @property {boolean} removeWhenDone - Whether to remove the progress bar when it reaches 100%
 * @property {number} opacity - A number between 0 and 1 for the opacity of the progress bar
 * @property {string[]} gradient - An array of colour values for a horizontal gradient.
 * @property {boolean} overflow - Whether the progress bar can be filled beyond 100%
 * @property {Object} image - An object containing an image to use as the background image for the progress bar
 */

/** Class representing a progress bar */
class ProgressBar {
    /**
     * Create a progress bar
     * @param {...Progress~Options} options - The options for the progress bar
     */
    constructor(options = {}) {
        this.percentage = 0
        this.height = options.height || 30
        this.width = options.width || 300
        this.fontSize = options.fontSize || null
        this.fontColor = options.fontColor || null
        this.draggable = options.draggable || false
        this.hidePercent = options.hidePercent || false
        this.removeWhenDone = options.removeWhenDone || true
        this.opacity = options.opacity || 1
        this.gradient = options.gradient || ['#00adb981', '#00eeffec']
        this.overflow = options.overflow || false

        this.HTMLreference = progressBarHTML()
        this.HTMLprogress = this.HTMLreference.getElementsByClassName(
            'progress'
        )[0]
        this.HTMLouterPercentage = this.HTMLreference.getElementsByClassName(
            'outerPercentage'
        )[0]

        if (options.image) {
            this.image = {
                source: options.image.source,
            }
        }

        this.style()

        // contains dom references to the progress bar and progress itself
        activeProgressBars.push(this)
    }

    /**
     * Style the progress bar according to the options specified
     */
    style() {
        this.setHeight(this.height)
        this.setWidth(this.width)
        if (this.fontSize) this.setFontSize(this.fontSize)
        if (this.fontColor) this.setFontColor(this.fontColor)
        this.setOpacity(this.opacity)
        this.setProgressGradient(this.gradient)
    }

    /**
     * Advances the progress bar by amount%.
     * @param {number} amount - The percentage to add to the progress bar
     */
    addProgress(amount) {
        if (typeof amount !== 'number') {
            throw new Error('Amount to add to progress bar is invalid')
        }

        this.percentage += amount
        let percent = Math.round(this.percentage * 100) / 100
        if (percent >= 100 && !this.overflow) percent = 100

        this.HTMLprogress.style.width = Math.min(100, percent) + '%'
        this._updateInnerText()

        if (percent === 100 && this.removeWhenDone) {
            this.finishBar()
        }
    }

    /**
     * Sets the progress bar to amount %
     * @param {number} amount - The percentage to set the progress bar to
     */
    setProgress(amount) {
        if (typeof amount !== 'number') {
            throw new Error('Amount to set progress bar to is invalid')
        } else if (amount < 0 || (amount > 100 && !this.overflow)) {
            throw new Error('Amount to set progress bar to is out of range')
        }

        this.percentage = amount

        this.HTMLprogress.style.width = Math.min(100, this.percentage) + '%'
        this._updateInnerText()

        if (percent === 100 && this.removeWhenDone) {
            this.finishBar()
        }
    }

    /**
     * Helper function that updates the percentage that is shown or hidden
     */
    _updateInnerText() {
        let percent = Math.round(this.percentage * 100) / 100
        if (percent >= 100 && !this.overflow) percent = 100

        if (!this.hidePercent) {
            if (this.percentage > 50) {
                this.HTMLprogress.innerText = percent + '%'
                this.HTMLouterPercentage.innerText = ''
            } else {
                this.HTMLouterPercentage.innerText = percent + '%'
            }
        } else {
            this.HTMLouterPercentage.innerText = ''
            this.HTMLprogress.innerText = ''
        }
    }

    async finishBar() {
        // complete the bar
        if (!this.hidePercent) {
            this.HTMLprogress.innerText = '100%'
        }
        this.HTMLprogress.style.width = '100%'

        // Some css to make the loading bar appear to fade out after a while
        this.HTMLreference.classList.add('fadeOut')

        // remove the loading bar from the HTML DOM
        setTimeout(() => this.cancelBar(), 2000)
    }

    cancelBar() {
        delete activeProgressBars.splice(activeProgressBars.indexOf(this), 1)
        this.HTMLreference.remove()
    }

    setHeight(height) {
        if (typeof height === 'number') {
            this.height = height
            this.HTMLreference.style.height = height + 'px'
        } else if (typeof height === 'string') {
            this.height = height
            this.HTMLreference.style.height = height
        } else {
            throw new Error('Invalid height supplied to progress bar')
        }
    }

    setOpacity(opacity) {
        if (typeof opacity === 'number') {
            this.opacity = opacity
            this.HTMLreference.style.opacity = opacity
        } else {
            throw new Error('Invalid opacity supplied to progress bar')
        }
    }

    setWidth(width) {
        if (typeof width === 'number') {
            this.width = width
            this.HTMLreference.style.width = width + 'px'
        } else if (typeof width === 'string') {
            this.width = width
            this.HTMLreference.style.width = width
        } else {
            throw new Error('Invalid width supplied to progress bar')
        }
    }

    setFontSize(fontSize) {
        if (typeof fontSize === 'string') {
            this.fontSize = fontSize
            this.HTMLprogress.style.fontSize = fontSize
            this.HTMLouterPercentage.style.fontSize = fontSize
        } else if (typeof fontSize === 'number') {
            this.fontSize = fontSize + 'px'
            this.HTMLprogress.style.fontSize = fontSize + 'px'
            this.HTMLouterPercentage.style.fontSize = fontSize + 'px'
        } else {
            throw new Error('Invalid fontSize supplied to progress bar')
        }
    }

    setFontColor(fontColor) {
        if (typeof fontSize === 'string') {
            this.HTMLprogress.style.fontSize = fontSize
            this.HTMLouterPercentage.style.fontSize = fontSize
        } else if (typeof fontSize === 'number') {
            this.HTMLprogress.style.fontSize = fontSize + 'px'
            this.HTMLouterPercentage.style.fontSize = fontSize + 'px'
        } else {
            throw new Error('Invalid fontSize supplied to progress bar')
        }
    }

    setProgressGradient(colors) {
        this.gradient = colors
        console.log(this.gradient)
        // retrieve the progress bar's information from the stored array
        this.HTMLprogress.style.background =
            'linear-gradient(to right, ' + colors.join(', ') + ' )'
        this.HTMLprogress.style.boxShadow =
            '0px 2px 2px -5px ' + colors[0] + ', 0px 2px 5px ' + colors[colors.length - 1]
    }

    // do not show percentage inside progress bar
    hidePercent() {
        this.hidePercent = true
        this._updateInnerText()
    }

    // show percentage inside progress bar
    unhidePercent() {
        this.hidePercent = false
        this._updateInnerText()
    }

    // toggle percentage showing
    toggleHidePercent() {
        this.hidePercent = !this.hidePercent
        this._updateInnerText()
    }

    keepWhenDone() {
        this.removeWhenDone = false
    }

    // Interactivity:

    makeDraggable() {
        // update draggable property in the object
        this.draggable = true

        // Set the style of the loading bar so that it can be moved around on the page
        this.HTMLreference.style.cursor = 'move'
        this.HTMLreference.style.userSelect = 'none'
        this.HTMLreference.style.position = 'absolute'

        // Add a listener for mouse clicks
        this.HTMLreference.addEventListener('mousedown', mouseDownHandler)
    }
}

// The current position of mouse and the selected progress bar
let mouseX = 0
let mouseY = 0
let active = null

// Handle mouse events
function mouseDownHandler(e) {
    // record current mouse position
    mouseX = e.clientX
    mouseY = e.clientY

    // the progress bar being dragged
    active = e.target

    // in case the user clicks on the progress bar and not the container
    if (active.className !== 'progress-bar') active = active.parentElement

    // mouse listeners
    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
}

function mouseMoveHandler(e) {
    // how far the mouse has been moved
    const dx = e.clientX - mouseX
    const dy = e.clientY - mouseY

    // Move the element with the mouse
    active.style.top = `${active.offsetTop + dy}px`
    active.style.left = `${active.offsetLeft + dx}px`

    // Reassign the position of mouse
    mouseX = e.clientX
    mouseY = e.clientY
}

function mouseUpHandler() {
    // Set active element to null
    active = null

    // Remove the handlers of `mousemove` and `mouseup` when the user lets go
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
}
