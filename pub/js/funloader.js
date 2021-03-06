// ----------------------------------------------------------------
// funloader.js for CSC309 individual project winter 2021
// by: Wilson Gao
// utorid/markus: gaowilso
// ----------------------------------------------------------------

;(function (global, document) {
    // array of all active loading bars
    const _activeProgressBars = []

    /**
     * Helper function that generates the HTML for a progress bar
     * @returns {HTMLDivElement} progressBar The HTML div containing the progress bar
     */
    function _progressBarHTML() {
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
     * @property {string} fontSize - The size of the percentage font, for both outer and inner percentages
     * @property {string} fontColor - The color of the percentage font, for both outer and inner percentages
     * @property {boolean} draggable - Whether the progress bar is draggable. Note: draggable progress bars cannot have a margin style.
     * @property {boolean} hidePercent - Whether the percentage displayed in the progress bar is hidden
     * @property {boolean} removeWhenDone - Whether to remove the progress bar when it reaches 100%
     * @property {number} opacity - A number between 0 and 1 for the opacity of the progress bar
     * @property {string[]} gradient - An array of colour values for a horizontal gradient
     * @property {boolean} overflow - Whether the progress bar can be filled beyond 100%
     * @property {Image} image - An object containing an {@link Image} to use as the background image for the progress bar
     * @property {string} finishedMessage - A message to display when the progress bar has finished loading
     */

    /** Class representing a regular progress bar */
    class ProgressBar {
        /**
         * Create a progress bar
         * @param {...Progress} options - The {@link Progress} options for the progress bar
         */
        constructor(options = {}) {
            this.percentage = 0
            this.height = options.height || 30
            this.width = options.width || 300
            this.fontSize = options.fontSize || null
            this.fontColor = options.fontColor || null
            this.draggable = options.draggable || false
            this.hidePercent = options.hidePercent || false
            this.removeWhenDone = options.removeWhenDone !== false
            this.opacity = options.opacity || 1
            this.gradient = options.gradient || ['#00adb981', '#00eeffec']
            this.overflow = options.overflow || false
            this.finishedMessage = options.finishedMessage || null

            this.HTMLreference = _progressBarHTML()
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
            _activeProgressBars.push(this)
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
            if (this.draggable) this.makeDraggable()
        }

        /**
         * Advances the progress bar by amount%.
         * Should be invoked whenever progress has been made while loading an element
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
            this.HTMLouterPercentage.style.width =
                100 - Math.min(100, percent) + '%'
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
            this.HTMLouterPercentage.style.width =
                100 - Math.min(100, percent) + '%'
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

            if (percent === 100 && this.finishedMessage) {
                this.HTMLprogress.innerText = this.finishedMessage
                this.HTMLouterPercentage.innerText = ''
            } else if (!this.hidePercent) {
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
                this.HTMLprogress.innerText = this.finishedMessage || '100%'
            }
            this.HTMLprogress.style.width = '100%'
            this.HTMLouterPercentage.style.width = '0%'

            // Some css to make the loading bar appear to fade out after a while
            this.HTMLreference.classList.add('fadeOut')

            // remove the loading bar from the HTML DOM
            setTimeout(() => this.cancelBar(), 2000)
        }

        /**
         * Immediately remove the progress bar
         */
        cancelBar() {
            delete _activeProgressBars.splice(
                _activeProgressBars.indexOf(this),
                1
            )
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
                this.HTMLprogress.style.color = fontColor
                this.HTMLouterPercentage.style.color = fontColor
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
         * Set the background image of the progress bar
         * @param {Image} image - Image to use as the background for the progress bar
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
                    this.image.leftShift +
                    'px -' +
                    this.image.upShift +
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

        /**
         * Set the bar to disappear when loading is complete. If complete, remove the progress bar.
         */
        unkeepWhenDone() {
            this.removeWhenDone = true

            // check if the progress bar is finished
            let percent = Math.round(this.percentage * 100) / 100
            if (percent >= 100 && this.removeWhenDone) {
                this.finishAnimation()
            }
        }

        /**
         * Makes the progress bar draggable.
         * IMPORTANT NOTE: A draggable ProgressBar cannot have a margin style.
         */
        makeDraggable() {
            // update draggable property in the object
            this.draggable = true

            // Set the style of the loading bar so that it can be moved around on the page
            this.HTMLreference.classList.add('draggable')
            this.HTMLreference.style.margin = ""

            // Add a listener for mouse clicks
            this.HTMLreference.addEventListener(
                'mousedown',
                _mouseDownDragHandler
            )
        }

        /**
         * Get all active loading bars
         * @returns {ProgressBar[]} An array containing all active progress bars
         */
        getAllActiveProgressBars() {
            return _activeProgressBars
        }
    }

    /**
     * An object representing a purchasable clicker item in the ClickerProgressBar game
     * @typedef {Object} ClickerPurchase
     * @property {string} name - The name of the item that can be purchased
     * @property {number} cost - The cost of the item in clicks
     * @property {number} rate - The rate that the item produces clicks in clicks/second
     */

    /**
     * Optional parameters to set various options for the clicker progress bar.
     * @typedef {Object} ClickerProgress
     * @property {(number|string)} height - The height of the progress bar in pixels or some css amount
     * @property {(number|string)} width - The width of the progress bar in pixels or some css amount
     * @property {string} fontSize - The size of the percentage font, for both outer and inner percentages
     * @property {string} fontColor - The color of the percentage font, for both outer and inner percentages
     * @property {boolean} draggable - Whether the progress bar is draggable
     * @property {boolean} removeWhenDone - Whether to remove the progress bar when it reaches 100%
     * @property {number} opacity - A number between 0 and 1 for the opacity of the progress bar
     * @property {string[]} gradient - An array of colour values for a horizontal gradient
     * @property {boolean} overflow - Whether the progress bar can be filled beyond 100%
     * @property {Image} image - An object containing an image to use as the background image for the progress bar
     * @property {string} finishedMessage - A message to display when the progress bar has finished loading
     * @property {ClickerPurchase[]} clickPurchases - ClickerProgressBar specific: an array of objects of {@link ClickerPurchase} items
     */

    /** Class representing a progress bar with the clicker game built in */
    class ClickerProgressBar extends ProgressBar {
        /**
         * Create a clicker progress bar
         * In this progress bar, the clicks will be shown instead of percentage, so hidePercent is disabled.
         * @param {...ClickerProgress} options - {@link ClickerProgress} options to give to the clicker progress bar
         */
        constructor(options = {}) {
            super(options)
            this.clicks = 0
            this.clickRate = 0
            this.hidePercent = false
            this.removeWhenDone = options.removeWhenDone || false

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

            this._updateInnerText()
            // interval to add clicks based on click rate
            this.interval = setInterval(() => {
                this.incrementClicks(this.clickRate)
            }, 1000)
        }

        /**
         * Increment the number of clicks by the specified amount
         * @param {number} amount - Amount of clicks to increase the clicks by
         */
        incrementClicks(amount) {
            this.clicks += amount
            this._updateInnerText()
        }

        /**
         * Increases the auto click generation rate in exchange for a cost in clicks.
         * Used to buy a click purchase item.
         * @param {number} cost - Cost of an item in clicks
         * @param {number} rate - Rate of click production of an item in clicks/second
         */
        buy(cost, rate) {
            if (this.clicks >= cost) {
                this.clicks -= cost
                this.clickRate += rate
                this._updateInnerText()
            }
        }

        /**
         * Enables buttons of items that can be purchased, and disables buttons that cannot be purchased.
         */
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

        /**
         * Creates a new item that can be purchased with clicks
         * @param {string} name - Name of the item
         * @param {number} cost - Cost of the item in clicks
         * @param {number} rate - Rate of click production of the item in clicks/second
         * @returns An object containing the button's HTML reference, the rate, and cost of the item.
         */
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
                        '. ' +
                        'Cost: ' +
                        cost +
                        ' clicks. ' +
                        rate +
                        ' click/s'
                )
            )
            clickerButton.className = 'clickerbutton'

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

            this.checkPurchases()
        }
    }

    // The current position of mouse and the selected progress bar
    let _mouseX = 0
    let _mouseY = 0
    let _active = null

    /**
     * Helper EventListener for mouse down for dragging functionality.
     * Selects the clicked on progress bar as the active one for moving.
     * @param {event} e - mousedown event
     */
    function _mouseDownDragHandler(e) {
        // record current mouse position
        _mouseX = e.clientX
        _mouseY = e.clientY

        // the progress bar being dragged
        _active = e.target

        // in case the user clicks on the progress bar and not the container
        if (!_active.className.includes('progress-bar'))
            _active = _active.parentElement

        // mouse listeners
        document.addEventListener('mousemove', _mouseMoveDragHandler)
        document.addEventListener('mouseup', _mouseUpDragHandler)
    }

    /**
     * Helper EventListener for mouse move for dragging functionality.
     * Moves the actively selected progress bar.
     * @param {event} e - mousemove event
     */
    function _mouseMoveDragHandler(e) {
        // how far the mouse has been moved
        const dx = e.clientX - _mouseX
        const dy = e.clientY - _mouseY

        // Move the element with the mouse
        _active.style.top = `${_active.offsetTop + dy}px`
        _active.style.left = `${_active.offsetLeft + dx}px`

        // Reassign the position of mouse
        _mouseX = e.clientX
        _mouseY = e.clientY
    }

    /**
     * Helper EventListener for mouse up for dragging functionality.
     * Removes EventListeners when the progress bar is released.
     */
    function _mouseUpDragHandler() {
        // Set active element to null
        _active = null

        // Remove the DragHandlers of `mousemove` and `mouseup` when the user lets go
        document.removeEventListener('mousemove', _mouseMoveDragHandler)
        document.removeEventListener('mouseup', _mouseUpDragHandler)
    }

    global.ProgressBar = global.ProgressBar || ProgressBar
    global.ClickerProgressBar = global.ClickerProgressBar || ClickerProgressBar
})(window, window.document)
