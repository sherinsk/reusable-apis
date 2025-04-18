const express = require('express');
const http = require('http');
const morgan = require('morgan');
const app = express();

const server = http.createServer(app);

app.use(morgan('dev'));
app.use(express.json());  // <-- Fixed this line by adding parentheses

app.use('/api', require('./src/routes/route'));

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});
