const express = require('express')
const morgan = require('morgan')
const floyd = require('./floyd')

let getRoute = null;
(async function () {
  getRoute = await floyd()
})()

const app = express()
app.use(morgan())
app.use(express.static('./public'))

app.get('/query', function (req, res) {
  const from = Number(req.query.from)
  const to = Number(req.query.to)
  res.send(JSON.stringify(getRoute(from, to)));
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
})