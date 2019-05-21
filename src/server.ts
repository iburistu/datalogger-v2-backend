import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as sqlite3 from 'sqlite3'
import * as SerialPort from 'serialport'

var Readline = require('@serialport/parser-readline');

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

// Database connection
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        // Cannot open database
        console.log('Error connecting to database!');
        throw err;
    }
    else {
        console.log('Connected to SQLite3 database.')
    }
});

// Serial Port
const port = new SerialPort('/dev/ttyAMA0', {
    baudRate: 38400
}, (err) => {
    if (err) {
        return console.log(`${err.message}`);
    }
});
// Parser
const parser = port.pipe(new Readline({ delimiter: '\r\n'}));

// Websocket
wss.on('connection', (ws: WebSocket) => {
    ws.send('Connected sucessfully!');
    ws.on('error', (err) => {
        console.log(`Client disconnected: reason ${err}`);
    })
});

// Update loop; updates once a minute
setInterval(() => {
    wss.clients.forEach((ws: WebSocket) => {
        ws.send("Testing");
    })
}, 60000);

server.listen(4000, () => {
    console.log(`Server started on port 4000`);
})