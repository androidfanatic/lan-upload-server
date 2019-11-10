#!/usr/bin/env node

const express = require('express');
const path = require('path');
const multer = require('multer');
const program = require('commander');

const app = express();
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, process.cwd());
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
});

app.use('/', express.static(process.cwd()));
app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);
  res.end('ok');
})
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

program.version(require('../package.json').version);
program.option('-p, --port <port>', 'port to listen on', 8080);
program.parse(process.argv);
app.listen(program.port, '0.0.0.0', () => {
  console.log('Listening on: ')
  const ifaces = require('os').networkInterfaces();
    Object.keys(ifaces).forEach(dev => {
    ifaces[dev].filter(details => {
      if (details.family === 'IPv4' && details.internal === false) {
        address = details.address;
        console.log('  http://' + address + ':' + program.port)
      }
    });
  });

});