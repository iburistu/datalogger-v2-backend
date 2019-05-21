import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as sqlite3 from 'sqlite3'

var Readline = require('@serialport/parser-readline');

let data: any[];

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

// Database connection
let db = new sqlite3.Database('../datalogger/database/database.db', (err) => {
    if (err) {
        // Cannot open database
        console.log('Error connecting to database!');
        throw err;
    }
    else {
        console.log('Connected to SQLite3 database.')
    }
});

// Websocket
wss.on('connection', (ws: WebSocket) => {
    ws.send('Connected sucessfully!');
    ws.on('error', (err) => {
        console.log(`Client disconnected: reason ${err}`);
    })
});

// SQL query
let sql = `SELECT * FROM data LIMIT 1440 OFFSET (SELECT COUNT(*) FROM data)-1440;`;

// Update loop; updates once a minute
setInterval(() => {
    db.each(sql, [], (err: any, rows: any) => {
	if (err) {
	    throw err;
	}
	console.log(rows);
    });
    //    wss.clients.forEach((ws: WebSocket) => {
    //    ws.send("Testing");
    //})
}, 10000);

server.listen(4000, () => {
    console.log(`Server started on port 4000`);

})
