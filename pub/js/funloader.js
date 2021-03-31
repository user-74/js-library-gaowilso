// ----------------------------------------------------------------
// funloader.js for CSC309 individual project winter 2021
// by: Wilson Gao
// utorid/markus: gaowilso
// ----------------------------------------------------------------

// to log things easily
const log = console.log
// timer for delaying animations etc. in async functions
const timer = (ms) => new Promise((res) => setTimeout(res, ms))
// JS Object, array of all active loading bars
const activeProgressBars = []

// Basic Loading Bar Functionality:

// Creates the default loading bar
function defaultProgressBar() {
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

    // contains dom references to the progress bar and progress itself
    activeProgressBars.push({
        HTMLreference: progressBar,
        percentage: 0,
        draggable: false,
        hidePercent: false,
    })

    return progressBar
}

// gets the progress bar element from the array of progress bars
function getProgressBar(progressBar) {
    return activeProgressBars.filter((object) => {
        return object.HTMLreference === progressBar
    })[0]
}

// adds amount to the percentage of the progress bar
function addProgress(progressBar, amount) {
    // retrieve the progress bar's information from the stored array
    const bar = getProgressBar(progressBar)
    const prevPercent = bar.percentage
    // update the percentage this bar has
    bar.percentage += amount
    // access the progress of the progress bar
    const progress = progressBar.firstElementChild
    const outerPercentage = progressBar.lastElementChild


    // increase progress by the specified amount
    let percent = Math.round(bar.percentage * 100) / 100
    // if we have over 100%, round it to 100%
    if (percent >= 100) percent = 100
    progress.style.width = percent + '%'

    if (!bar.hidePercent) {
        if (bar.percentage > 25){
            progress.innerText = percent + '%'
        } else{
            outerPercentage.innerText = percent + '%'
        }
        if (prevPercent < 25 && bar.percentage > 25) {
            outerPercentage.innerText = ''
        }
    }

    // If we display 100%, loading has finished
    if (percent === 100) {
        finishBar(progressBar)
    }
}

// function for animating the bar fading out after finished loading and deletes it
async function finishBar(progressBar) {
    const bar = getProgressBar(progressBar)
    const progress = progressBar.firstElementChild

    // complete the bar
    if (!bar.hidePercent) {
        progress.innerText = '100%'
    }
    progress.style.width = '100%'

    // Some css to make the loading bar appear to fade out after a while
    await timer(1000)
    progressBar.classList.add('fadeOut')
    await timer(2000)

    // remove the loading bar from the HTML DOM
    delete activeProgressBars.splice(activeProgressBars.indexOf(bar), 1)
    progressBar.remove()
}

// function if loading is cancelled
function cancelBar(progressBar) {
    const bar = getProgressBar(progressBar)
    delete activeProgressBars.splice(activeProgressBars.indexOf(bar), 1)
    progressBar.remove()
}

// Customization

// do not show percentage inside progress bar
function hidePercent(progressBar) {
    const bar = getProgressBar(progressBar)
    bar.hidePercent = true
}

// show percentage inside progress bar
function unhidePercent(progressBar) {
    const bar = getProgressBar(progressBar)
    bar.hidePercent = false
}

// customize the gradient colors of the progress bar
function setProgressGradient(progressBar, leftColor, rightColor) {
    // retrieve the progress bar's information from the stored array
    const progress = progressBar.firstElementChild
    progress.style.backgroundImage =
        'linear-gradient(to right,' + leftColor + ',' + rightColor + ')'
    progress.style.boxShadow =
        '0px 2px 2px -5px' + leftColor + ', 0px 2px 5px' + rightColor

    console.log(progress)
}

// Interactivity:

// Draggable Loading Bar:
function makeDraggable(progressBar) {
    // update draggable property
    for (const bar of activeProgressBars) {
        if (bar.HTMLreference == progressBar) {
            bar.draggable = true
            break
        }
    }

    // Set the style of the loading bar so that it can be moved around on the page
    progressBar.style.cursor = 'move'
    progressBar.style.userSelect = 'none'
    progressBar.style.position = 'absolute'
    progressBar.style.removeProperty('margin')
    progressBar.style.removeProperty('margin-top')

    // Add a listener for mouse clicks
    progressBar.addEventListener('mousedown', mouseDownHandler)
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
    if (active.className === 'progress') active = active.parentElement

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
