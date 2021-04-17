const timer = (ms) => new Promise((res) => setTimeout(res, ms))

document.addEventListener('DOMContentLoaded', () => loadPage(), false)

async function loadPage() {
    const p = new ProgressBar({
        finishedMessage: 'Select From Below',
        removeWhenDone: false,
        hidePercent: true,
        height: 50,
        width: 600,
        fontSize: 30,
    })

    const box = document.querySelector('.link-container')
    const progress = document.querySelector('.progress-container')

    progress.appendChild(p.HTMLreference)

    const examples = document.createElement('a')
    const documentation = document.createElement('a')
    const download = document.createElement('a')

    examples.href = './examples.html'
    documentation.href = './out/index.html'
    download.href = 'https://github.com/csc309-winter-2021/js-library-gaowilso'

    examples.appendChild(document.createTextNode('Examples'))
    documentation.appendChild(document.createTextNode('API Documentation'))
    download.appendChild(document.createTextNode('Download'))

    const a = [examples, documentation, download]

    for (let i = 0; i < a.length; i++) {
        await timer(1000)
        a[i].classList.add("fade-in")
        box.appendChild(a[i])
        p.addProgress(33.333333)
    }
}