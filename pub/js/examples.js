// function to load a random image into the HTML DOM
const timer = (ms) => new Promise((res) => setTimeout(res, ms))

async function progressAdd(p) {
    for (let i = 0; i < 10; i++) {
        await timer(1000)
        p.addProgress(10)
    }
}

function example1() {
    const box = document.getElementById('e1')
    const p = new ProgressBar()
    box.appendChild(p.HTMLreference)
    progressAdd(p)
}

function example2() {
    const box = document.getElementById('e2')
    const p = new ProgressBar({ draggable: true })
    box.appendChild(p.HTMLreference)
    progressAdd(p)
}

function example3() {
    const box = document.getElementById('e3')
    const p = new ProgressBar({ height: 75, width: '100%', fontSize: 25 })
    box.appendChild(p.HTMLreference)
    progressAdd(p)
}

function example4() {
    const box = document.getElementById('e4')
    const p = new ProgressBar({
        height: 50,
        fontColor: '#FFFFFF',
        image: { source: 'images/pic.jpg', leftShift: 200, upShift: 45 },
    })
    box.appendChild(p.HTMLreference)
    progressAdd(p)
}

function example5() {
    const box = document.getElementById('e5')
    const p = new ClickerProgressBar()
    box.appendChild(p.HTMLreference)
    progressAdd(p)
}

function example6() {
    const box = document.getElementById('e6')
    const p = new ProgressBar({ opacity: 0.5, gradient: ['#000000, #FFFFFF'] })
    box.appendChild(p.HTMLreference)
    progressAdd(p)
}

async function example7() {
    const box = document.getElementById('e7')
    const p = new ProgressBar({ overflow: true, removeWhenDone: false })
    box.appendChild(p.HTMLreference)
    while (1) {
        await timer(1000)
        p.addProgress(10)
    }
}

function example8() {
    const box = document.getElementById('e8')
    const p = new ClickerProgressBar({
        draggable: true,
        clickPurchases: [
            { name: 'God', cost: 3, rate: 300 },
            { name: 'UofT', cost: 300, rate: -300 },
        ],
    })
    box.appendChild(p.HTMLreference)
    progressAdd(p)
}

function example9() {
    const box = document.getElementById('e9')
    const p = new ProgressBar({
        finishedMessage: 'Loading Complete!',
        removeWhenDone: false,
    })
    box.appendChild(p.HTMLreference)
    progressAdd(p)
}
