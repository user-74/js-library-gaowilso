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

    // set properties of the loading bar and
    progressBar.className = 'progress-bar'
    progressBar.style.textAlign = 'center'
    progressBar.style.alignItems = 'center'
    progressBar.style.justifyContent = 'center'
    progress.className = 'progress'
    progressBar.appendChild(progress)

    // loading bar starts at 0%
    let percentage = 0
    progress.percentage = percentage

    // contains dom references to the progress bar and progress itself
    activeProgressBars.push({
        HTMLreference: progressBar,
        percentage: 0,
        draggable: false,
    })

    // add this progress bar to the JS array
    log(activeProgressBars)

    return progressBar
}

async function addProgress(progressBar, amount) {
    // get the element's properties from the list
    let bar

    for (bar of activeProgressBars) {
        if (bar.HTMLreference == progressBar) {
            bar.percentage += amount
            break
        }
    }

    // access the progress of the loading bar
    const progress = progressBar.firstElementChild

    // increment the loading bar by the specified amount
    progress.percentage = bar.percentage
    if (progress.percentage > 100) progress.percentage = 100
    progress.innerText = Math.round(progress.percentage * 100) / 100 + '%'
    progress.style.width = progress.percentage + '%'

    // If we display 100%, loading has finished
    if (progress.innerText === '100%') {
        // Some css to make the loading bar appear to fade out after a while
        await timer(1000)
        progressBar.classList.add('fadeOut')
        await timer(2000)

        // remove the loading bar from the HTML DOM
        delete activeProgressBars.splice(activeProgressBars.indexOf(bar), 1)
        progressBar.remove()
        log(activeProgressBars)
    }
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
