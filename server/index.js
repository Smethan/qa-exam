const express = require('express')
const path = require('path')
const Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '45de4a680f9e4823bddad3fccc8f85ce',
  captureUncaught: true,
  captureUnhandledRejections: true,
})


const app = express()

app.get('/',function(req,res) {
  res.sendFile(path.join(__dirname, '../tictacjs.html'));
  rollbar.info('successfully served html')
});

app.use('/js', express.static(path.join(__dirname, '../tictacjs.js')))

const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})