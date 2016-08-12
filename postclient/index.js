const http = require('http');

const options = {
  port: '3000',
  method: 'POST',
  agent: false,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': 0,
  },
};

module.exports = (user, min, max) => {
  options.path = `/api/users/${user}/${min}/${max}`;
  const req = http.request(options, (res) => {
    res.setEncoding('utf8');
    req.on('error', (e) => {
      console.error(e);
    });
  });
  req.end();
  console.log(`post: ${options.path}`);
};
