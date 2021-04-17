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
 * @returns {ProgressBar[]} An array containing all active progress bars
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
 * Image object for setting the background image of the progress bar
 * @typedef {Object} Image
 * @property {string} source - Source of the image
 * @property {number} leftShift - Number of pixels to shift the image left
 * @property {number} upShift - Number of pixels to shift the image up
 */

/**
 * Optional parameters to set various options for the progress bar.
 * @typedef {Object} Progress
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
 * @property {Image} image - An object containing an image to use as the background image for the progress bar
 */

/** Class representing a regular progress bar */
class ProgressBar {
    /**
     * Create a progress bar
     * @param {...Progress} options - The options for the progress bar {@link Progress}
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
                leftShift: options.image.leftShift || 0,
                upShift: options.image.upShift || 0,
            }
        }

        this.style()

        // contains dom references to the progress bar and progress itself
        activeProgressBars.push(this)
    }

    /**
     * Style the progress bar according to this progress bar's attributes
     */
    style() {
        this.setHeight(this.height)
        this.setWidth(this.width)
        if (this.fontSize) this.setFontSize(this.fontSize)
        if (this.fontColor) this.setFontColor(this.fontColor)
        this.setOpacity(this.opacity)
        this.setProgressGradient(this.gradient)
        if (this.image) this.setBackgroundImage(this.image)
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
            this.finishAnimation()
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
            this.finishAnimation()
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

    /**
     * Fill the bar to 100%, fades it out, and removes it from the DOM and active progress bars
     */
    async finishAnimation() {
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

    /**
     * Immediately remove the progress bar
     */
    cancelBar() {
        delete activeProgressBars.splice(activeProgressBars.indexOf(this), 1)
        this.HTMLreference.remove()
    }

    /**
     * Set the height of the progress bar
     * @param {(number|string)} height
     */
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

    /**
     * Set the opacity of the progress bar
     * @param {number} opacity
     */
    setOpacity(opacity) {
        if (typeof opacity === 'number') {
            this.opacity = opacity
            this.HTMLreference.style.opacity = opacity
        } else {
            throw new Error('Invalid opacity supplied to progress bar')
        }
    }

    /**
     * Set the width of the progress bar
     * @param {(number|string)} width
     */
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

    /**
     * Set the font size of the percentage text
     * @param {(number|string)} fontSize
     */
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

    /**
     * Set the color of the percentage text
     * @param {string} fontColor
     */
    setFontColor(fontColor) {
        if (typeof fontColor === 'string') {
            this.fontColor = fontColor
            this.HTMLprogress.style.fontColor = fontColor
            this.HTMLouterPercentage.style.fontColor = fontColor
        } else {
            throw new Error('Invalid fontColor supplied to progress bar')
        }
    }

    /**
     * Change the gradient of the progress bar
     * A solid color progress bar is possible if the colors provided are the same.
     * @param {string[]} colors - Array of two or more strings that represent colors
     */
    setProgressGradient(colors) {
        this.gradient = colors
        console.log(this.gradient)
        // retrieve the progress bar's information from the stored array
        this.HTMLprogress.style.background =
            'linear-gradient(to right, ' + colors.join(', ') + ' )'
        this.HTMLprogress.style.boxShadow =
            '0px 2px 2px -5px ' +
            colors[0] +
            ', 0px 2px 5px ' +
            colors[colors.length - 1]
    }

    /**
     * Set the background image to the one set the the color
     */
    setBackgroundImage(image) {
        if (image) {
            this.image.source = image.source || this.image.source
            this.image.leftShift = image.leftShift || this.image.leftShift
            this.image.upShift = image.upShift || this.image.upShift
        }

        if (this.image.source) {
            this.HTMLreference.style.backgroundImage =
                'url(' + this.image.source + ')'
            this.HTMLreference.style.backgroundPosition =
                '-' +
                String(this.image.leftShift) +
                'px -' +
                String(this.image.upShift) +
                'px'
        }
    }

    /**
     * Hide progress percentage
     */
    hidePercent() {
        this.hidePercent = true
        this._updateInnerText()
    }

    /**
     * Display progress percentage
     */
    unhidePercent() {
        this.hidePercent = false
        this._updateInnerText()
    }

    /**
     * Toggle hide/display progress percentage
     */
    toggleHidePercent() {
        this.hidePercent = !this.hidePercent
        this._updateInnerText()
    }

    /**
     * Set the bar to stay when loading is complete
     */
    keepWhenDone() {
        this.removeWhenDone = false
    }

    unkeepWhenDone() {
        this.removeWhenDone = true

        // check if the progress bar is finished
        let percent = Math.round(this.percentage * 100) / 100
        if (percent >= 100 && this.removeWhenDone) {
            this.finishAnimation()
        }
    }

    // Interactivity:

    /**
     * Makes the progress bar draggable
     */
    makeDraggable() {
        // update draggable property in the object
        this.draggable = true

        // Set the style of the loading bar so that it can be moved around on the page
        this.HTMLreference.classList.add('draggable')

        // Add a listener for mouse clicks
        this.HTMLreference.addEventListener('mousedown', mouseDownDragHandler)
    }
}

/** Class representing a progress bar with the clicker game built in */
class ClickerProgressBar extends ProgressBar {
    /**
     * Create a clicker progress bar
     * @param {...Progress} options -
     */
    constructor(options = {}) {
        super(options)
        this.clicks = 0
        this.clickRate = 0
        this.hidePercent = options.hidePercent || true
        this.removeWhenDone = options.removeWhenDone || false
        this._updateInnerText()

        this.HTMLreference.classList.add('clicker-bar')
        this.HTMLreference.onclick = () => {
            this.incrementClicks(1)
        }

        // default purchases in the clicker game
        const defaultPurchases = [
            { name: 'Machine', cost: 10, rate: 1 },
            { name: 'Factory', cost: 25, rate: 3 },
            { name: 'Planet', cost: 500, rate: 50 },
        ]
        // purchases defined through arguments passed in
        let purchases = options.clickPurchases || defaultPurchases
        this.clickPurchases = purchases.map((i) =>
            this.newClickerPurchase(i.name, i.cost, i.rate)
        )
        this.checkPurchases()

        // interval to add clicks based on click rate
        this.interval = setInterval(() => {
            this.incrementClicks(this.clickRate)
        }, 1000)
    }

    /**
     * Increment the number of clicks by the specified amount
     * @param {number} amount
     */
    incrementClicks(amount) {
        this.clicks += amount
        this._updateInnerText()
        this.checkPurchases()
    }

    buy(cost, rate) {
        if (this.clicks >= cost) {
            this.clicks -= cost
            this.clickRate += rate
            this._updateInnerText()
            this.checkPurchases()
        }
    }

    checkPurchases() {
        this.clickPurchases.forEach((item) => {
            if (this.clicks >= item.cost) {
                item.HTMLreference.disabled = false
            } else {
                item.HTMLreference.disabled = true
            }
        })
    }

    /**
     * Ends the game and removes the progress bar
     */
    finishGame() {
        clearInterval(this.interval)
        this.unkeepWhenDone()
    }

    newClickerPurchase(name, cost, rate) {
        if (
            typeof name !== 'string' ||
            typeof cost !== 'number' ||
            typeof rate !== 'number'
        ) {
            throw new Error('New purchase item for clicker bar invalid')
        }

        const clickerButton = document.createElement('button')
        clickerButton.appendChild(
            document.createTextNode(
                name +
                    ' - ' +
                    'Cost: ' +
                    String(cost) +
                    ' clicks - ' +
                    String(rate) +
                    ' click/s'
            )
        )

        clickerButton.onclick = () => {
            this.buy(cost, rate)
        }
        this.HTMLreference.appendChild(clickerButton)

        return { HTMLreference: clickerButton, rate: rate, cost: cost }
    }

    /**
     * Helper function that updates the number of clicks and clicks per second
     */
    _updateInnerText() {
        let active, deactive
        if (this.percentage > 50) {
            active = this.HTMLprogress
            deactive = this.HTMLouterPercentage
        } else {
            deactive = this.HTMLprogress
            active = this.HTMLouterPercentage
        }
        active.innerText =
            'Clicks: ' +
            String(this.clicks) +
            ' (+' +
            String(this.clickRate) +
            'c/s)'
        deactive.innerText = ''
    }
}

class ReflexProgressBar extends ProgressBar {}

// The current position of mouse and the selected progress bar
let mouseX = 0
let mouseY = 0
let active = null

// Handle mouse events
function mouseDownDragHandler(e) {
    // record current mouse position
    mouseX = e.clientX
    mouseY = e.clientY

    // the progress bar being dragged
    active = e.target

    // in case the user clicks on the progress bar and not the container
    if (!active.className.includes('progress-bar'))
        active = active.parentElement

    // mouse listeners
    document.addEventListener('mousemove', mouseMoveDragHandler)
    document.addEventListener('mouseup', mouseUpDragHandler)
}

function mouseMoveDragHandler(e) {
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

function mouseUpDragHandler() {
    // Set active element to null
    active = null

    // Remove the DragHandlers of `mousemove` and `mouseup` when the user lets go
    document.removeEventListener('mousemove', mouseMoveDragHandler)
    document.removeEventListener('mouseup', mouseUpDragHandler)
}
