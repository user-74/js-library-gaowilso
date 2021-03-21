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
    let progressBarObject = {
        progressBar: progressBar,
        progress: progress,
    }

    // add this progress bar to the JS array
    activeProgressBars.push(progressBarObject)
    log(activeProgressBars)

    return progressBar
}

async function addProgress(progressBar, amount) {
    // access the progress of the loading bar
    const progress = progressBar.firstElementChild

    // increment the loading bar by the specified amount
    progress.percentage += amount
    progress.innerText = Math.round(progress.percentage * 100) / 100 + '%'
    progress.style.width = progress.percentage + '%'

    // If we display 100%, loading has finished
    if (progress.innerText === '100%') {
        // Some css to make the loading bar appear to fade out after a while
        await timer(1000)
        progressBar.classList.add('fadeOut')
        await timer(2000)

        // remove the loading bar from the HTML DOM
        progressBar.remove()
        activeProgressBars.splice(
            activeProgressBars.indexOf({
                progressBar: progressBar,
                progress: progress,
            }),
            1
        )
        log(activeProgressBars)
    }
}

// Interactivity:

// Draggable Loading Bar:
function makeDraggable(progressBar) {
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

    // Move the element
    active.style.top = `${active.offsetTop + dy}px`
    active.style.left = `${active.offsetLeft + dx}px`

    // Reassign the position of mouse
    mouseX = e.clientX
    mouseY = e.clientY
}

function mouseUpHandler() {
    // Set active element to null
    active = null

    // Remove the handlers of `mousemove` and `mouseup` when the use lets go
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
}
