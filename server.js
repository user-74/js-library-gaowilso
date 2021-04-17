/* server.js - Express server*/
'use strict'
const log = console.log
log('Express server')

const express = require('express')
const app = express()

const path = require('path')

app.use(express.static(path.join(__dirname, '/pub')))
app.use("/styles", express.static(__dirname + '/pub/out/styles'));
app.use("/fonts", express.static(__dirname + '/pub/out/fonts'));
app.use("/scripts", express.static(__dirname + '/pub/out/scripts'));

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, '/pub/landingpage.html'))
})

app.get('/examples', (req, res) => {
    res.sendFile(path.join(__dirname, '/pub/examples.html'))
})

app.get('/out/documentation', (req, res) => {
    res.sendFile(path.join(__dirname, '/pub/out/index.html'))
})

// will use an 'environmental variable', process.env.PORT, for deployment.
const port = process.env.PORT || 5000
app.listen(port, () => {
    log(`Listening on port ${port}...`)
}) // localhost development port 5000  (http://localhost:5000)
// We've bound that port to localhost to go to our express server.
// Must restart web server when you make changes to route handlers.
