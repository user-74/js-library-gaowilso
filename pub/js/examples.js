// function to load a random image into the HTML DOM
const timer = (ms) => new Promise((res) => setTimeout(res, ms))

function createRandomImage(progressBar, amount) {
    const imageBox = document.querySelector('.image-box')

    const image = document.createElement('img')
    image.onload = function () {
        progressBar.addProgress(amount)
    }
    image.src =
        'https://picsum.photos/200/300/?random&t=' + new Date().getTime()

    imageBox.appendChild(image)
}

function toggleAll() {
    const progressBars = getAllActiveProgressBars()
    progressBars.forEach((bar) => bar.toggleHidePercent())
}

// function that generates images and needs a loading bar
async function generateImages() {
    // if (document.querySelector(".progress-bar")) return

    const num = Number(document.querySelector('.textboxImages').value)
    const draggable = document.querySelector('#enableDrag').checked
    const percent = 100 / num

    // if the number of images is invalid, stop
    if (!Number.isInteger(num) || num <= 0) return

    // get a loading bar an
    const p = new ProgressBar({opacity: 1, gradient:['red', 'green', 'blue']})
    const progressBar = p.HTMLreference
    const placement = document.querySelector('.loading-box')
    placement.appendChild(progressBar)

    // makes the loading bar draggable
    if (draggable) {
        p.makeDraggable()

    } else {
        progressBar.style.margin = 'auto'
        progressBar.style.marginTop = '10px'
        p.setFontSize('40px')
        p.setProgressGradient(['#FFFFFF', '#FFFFFF'])
    }

    // generate images with a second delay between images, to randomize images
    for (let i = 0; i < num; i++) {
        createRandomImage(p, percent)
        await timer(1000)
    }
}
