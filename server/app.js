const express = require('express');
const request = require('request');
const progress = require('request-progress');
const app = express();
const cors = require('cors');
const conf = {
  port: 3000
};

app.use(cors());
app.use('/static', express.static('src'));
app.use('/public', express.static('../dist'));

app.get('/download', function (req, res) {
  const { url: fileUrl } = req.query;
  const requestObject = request(fileUrl);

  progress(requestObject, {})
    .on('progress', function (state) {
      // The state is an object that looks like this:
      // {
      //     percent: 0.5,               // Overall percent (between 0 to 1)
      //     speed: 554732,              // The download speed in bytes/sec
      //     size: {
      //         total: 90044871,        // The total payload size in bytes
      //         transferred: 27610959   // The transferred payload size in bytes
      //     },
      //     time: {
      //         elapsed: 36.235,        // The total elapsed seconds since the start (3 decimals)
      //         remaining: 81.403       // The remaining seconds to finish (3 decimals)
      //     }
      // }
      console.log('progress', state);
    })
    .on('abort', function () {
      console.log('abort');
    })
    .on('error', function () {
      console.log('error');
    })
    .on('end', function () {
      console.log('end');
    })
    .pipe(res);
});

app.get('*', function (req, res) {
  return res.status(404).send({
    message: 'Method not found'
  });
});

/*
 *
 * SERVER START
 *
 */
let server = app.listen(conf.port, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log('NodeJS app | successfully | started. Listening on http://%s:%s', host, port);
});
