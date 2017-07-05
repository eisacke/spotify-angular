const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.plugin(require('./lib/globalToJSON'));
mongoose.Promise = require('bluebird');
const { port, env, dbURI } = require('./config/environment');
const routes = require('./config/routes');
const socket = require('./config/socket.js');
const customResponses = require('./lib/customResponses');
const errorHandler = require('./lib/errorHandler');
const app = express();

mongoose.connect(dbURI);

if(env !== 'test') app.use(morgan('dev'));

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json({limit: '5mb'}));

app.use(customResponses);
app.use('/api', routes);
app.get('/*', (req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.use(errorHandler);

// starting sockets
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
io.sockets.on('connection', socket);
server.listen(port, () => console.log(`Express is listening on port ${port}`));
// ending sockets
