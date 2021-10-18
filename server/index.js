const express = require('express')
const path = require('path')



const app = express()

app.get('/',function(req,res) {
  res.sendFile(path.join(__dirname, '../tictacjs.html'));
});

app.use('/js', express.static(path.join(__dirname, '../tictacjs.js')))
app.use('/css', express.static(path.join(__dirname, '../style.css')))

const port = process.env.PORT || 5500

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})